import { NextRequest, NextResponse } from 'next/server';
import { callGemini, parseGeminiJSON } from '@/lib/gemini';
import { DEMO_VOLUNTEERS } from '@/lib/demo-data';
import { AIBalanceResponse } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const volunteers = body.volunteers || DEMO_VOLUNTEERS;

    const prompt = `
You are analyzing volunteer workforce health for Mahakumbh 2028.

COMPLETE WORKFORCE STATUS:
${JSON.stringify(
  volunteers.map((v: typeof DEMO_VOLUNTEERS[0]) => ({
    id: v.id,
    name: v.name,
    skills: v.skills,
    experience_level: v.experience_level,
    availability: v.availability,
    workload_score: v.workload_score,
    hours_worked: v.hours_worked,
    active_assignments: v.active_assignments,
    assigned_zone: v.assigned_zone,
  })),
  null,
  2
)}

Scoring thresholds:
- workload_score 0-40: Fresh (green)
- workload_score 41-70: Moderate (yellow)
- workload_score 71-85: Caution (orange)
- workload_score 86-100: BURNOUT RISK (red)

Analyze and return ONLY valid JSON:
{
  "overall_health_score": 74,
  "health_status": "fair",
  "burnout_risks": [
    {
      "volunteer_id": "v-19",
      "name": "Col. Vijay Rawat (Retd)",
      "workload_score": 91,
      "risk_level": "critical",
      "recommendation": "Immediate rotation — reduce to desk duties for 4 hours",
      "suggested_replacement_skill": "crowd_management"
    }
  ],
  "underutilized": [
    {
      "volunteer_id": "v-16",
      "name": "Rahul Chaudhary",
      "workload_score": 10,
      "suggested_action": "Deploy to Food Distribution Hub FD1 for crowd support"
    }
  ],
  "rebalancing_suggestions": [
    {
      "action": "Move Pooja Tiwari from Z02 to Z03",
      "reason": "Triveni Crossing needs traffic expertise urgently",
      "impact": "Reduces Z03 risk from critical to high"
    }
  ],
  "critical_alerts": [
    "2 experts approaching burnout — intervention needed within 2 hours"
  ],
  "skill_gap_analysis": {
    "multilingual": "Shortage in Z01 and Z03",
    "medical": "Only 4 medical volunteers available — below minimum safe level"
  }
}
`;

    const raw = await callGemini(prompt);
    const result = parseGeminiJSON<AIBalanceResponse>(raw);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('/api/ai/balance error:', error);
    return NextResponse.json(
      { success: false, error: 'Balance AI failed', details: String(error) },
      { status: 500 }
    );
  }
}
