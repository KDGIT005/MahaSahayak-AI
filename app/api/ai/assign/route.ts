import { NextRequest, NextResponse } from 'next/server';
import { callGemini, parseGeminiJSON } from '@/lib/gemini';
import { DEMO_VOLUNTEERS, DEMO_ZONES } from '@/lib/demo-data';
import { AIAssignmentResponse } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const { zone_id, required_skills, volunteer_count } = await req.json();

    const zone = DEMO_ZONES.find((z) => z.id === zone_id) || DEMO_ZONES[0];
    const availableVolunteers = DEMO_VOLUNTEERS.filter(
      (v) => v.availability === 'available' && v.workload_score < 85
    );

    const prompt = `
You are an elite volunteer coordinator for Mahakumbh 2028, the world's largest religious gathering with 100+ million attendees.

ZONE REQUIRING VOLUNTEERS:
Zone: ${zone.zone_name} (${zone.zone_code})
Risk Level: ${zone.risk_level.toUpperCase()}
Crowd Density: ${zone.crowd_density}
Required Skills: ${(required_skills || zone.required_skills).join(', ')}
Volunteers Needed: ${volunteer_count || 5}

AVAILABLE VOLUNTEERS (JSON):
${JSON.stringify(
  availableVolunteers.map((v) => ({
    id: v.id,
    name: v.name,
    skills: v.skills,
    languages: v.languages,
    experience_level: v.experience_level,
    availability: v.availability,
    workload_score: v.workload_score,
    bharat_ready_score: v.bharat_ready_score,
    active_assignments: v.active_assignments,
  })),
  null,
  2
)}

ASSIGNMENT RULES:
1. Skills match is primary — never assign a volunteer without at least one required skill
2. For CRITICAL/HIGH risk zones, prefer experience_level "expert" or "intermediate"
3. Workload score > 75 = overloaded — avoid assigning unless no alternative
4. Ensure language diversity — at least one Hindi speaker, one English speaker if possible
5. Spread assignment across skill categories — do not pick all from the same skill

Return ONLY a valid JSON object (no markdown, no explanation outside JSON):
{
  "selected_volunteer_ids": ["id1", "id2"],
  "assignment_reasoning": {
    "id1": "Selected for expert medical skills and low workload. Language: Hindi+English.",
    "id2": "..."
  },
  "shift_recommendation": "morning",
  "confidence_score": 0.87,
  "warnings": ["Dr. Tripathi approaching burnout — monitor hours"],
  "coverage_summary": "3 medical, 2 crowd management, 1 multilingual. Zone coverage: 85%"
}
`;

    const raw = await callGemini(prompt);
    const result = parseGeminiJSON<AIAssignmentResponse>(raw);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('/api/ai/assign error:', error);
    return NextResponse.json(
      { success: false, error: 'AI assignment failed', details: String(error) },
      { status: 500 }
    );
  }
}
