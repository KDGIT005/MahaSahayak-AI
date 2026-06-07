import { NextRequest, NextResponse } from 'next/server';
import { callGemini, parseGeminiJSON } from '@/lib/gemini';
import { DEMO_VOLUNTEERS, DEMO_ZONES } from '@/lib/demo-data';
import { AIEmergencyResponse } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const { zone_id, incident_type, severity, description, volunteers_needed } = await req.json();

    const zone = DEMO_ZONES.find((z) => z.id === zone_id) || DEMO_ZONES[0];
    const availableVolunteers = DEMO_VOLUNTEERS.filter(
      (v) => v.availability === 'available' || v.availability === 'on_break'
    );

    const prompt = `
🚨 EMERGENCY RESPONSE PROTOCOL — MAHAKUMBH 2028

CRITICAL INCIDENT:
Location: ${zone.zone_name} (${zone.zone_code})
Incident Type: ${incident_type}
Severity: ${severity.toUpperCase()}
Description: ${description}
Responders Needed: ${volunteers_needed || 4}
Time of Incident: ${new Date().toISOString()}
Zone Risk Level: ${zone.risk_level}
Crowd Density: ${zone.crowd_density}

AVAILABLE RESPONDERS:
${JSON.stringify(
  availableVolunteers.map((v) => ({
    id: v.id,
    name: v.name,
    skills: v.skills,
    languages: v.languages,
    experience_level: v.experience_level,
    availability: v.availability,
    workload_score: v.workload_score,
    active_assignments: v.active_assignments,
  })),
  null,
  2
)}

RESPONSE RULES:
- Medical emergency → MUST include volunteers with: medical, first_aid, cpr, triage
- Crowd crush → crowd_management + emergency_response + medical backup
- Missing person → information_desk + multilingual + communication
- Fire/structural → emergency_response + first_aid + crowd_management
- Prefer volunteers with workload_score < 70 for primary responders
- Language match: ensure Hindi speaker in primary team

Return ONLY valid JSON:
{
  "primary_responders": ["id1", "id2"],
  "backup_responders": ["id3", "id4"],
  "estimated_response_time": "3-5 minutes",
  "action_plan": [
    "Step 1: Dispatch primary medical team to ${zone.zone_name}",
    "Step 2: Clear corridor for ambulance access",
    "Step 3: Set up triage point at zone entry",
    "Step 4: Activate backup team if primary team needs support"
  ],
  "risk_assessment": "Assessment of severity, crowd density impact, and access challenges.",
  "resource_requirements": ["2 first aid kits", "1 stretcher", "radio communication"],
  "escalation_needed": false,
  "command_center_alert": "Notify Zone Manager and Admin immediately"
}
`;

    const raw = await callGemini(prompt);
    const result = parseGeminiJSON<AIEmergencyResponse>(raw);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('/api/ai/emergency error:', error);
    return NextResponse.json(
      { success: false, error: 'Emergency AI failed', details: String(error) },
      { status: 500 }
    );
  }
}
