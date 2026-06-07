import { NextRequest, NextResponse } from 'next/server';
import { callGemini, parseGeminiJSON } from '@/lib/gemini';
import { DEMO_VOLUNTEERS } from '@/lib/demo-data';
import { AIQueryResponse } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    const prompt = `
You are a smart search assistant for MahaSahayak AI at Mahakumbh 2028.

USER SEARCH QUERY: "${query}"

ALL VOLUNTEERS (JSON):
${JSON.stringify(
  DEMO_VOLUNTEERS.map((v) => ({
    id: v.id,
    name: v.name,
    skills: v.skills,
    languages: v.languages,
    availability: v.availability,
    experience_level: v.experience_level,
    workload_score: v.workload_score,
    assigned_zone: v.assigned_zone,
    hours_worked: v.hours_worked,
  })),
  null,
  2
)}

Parse the natural language query and identify relevant volunteers.
Consider: skills mentioned, languages mentioned, availability mentioned, experience level mentioned, zone preferences, workload.

Return ONLY valid JSON:
{
  "matched_volunteer_ids": ["id1", "id2", "id3"],
  "search_interpretation": "Looking for volunteers who speak Hindi, have medical skills, and are currently available",
  "filters_applied": {
    "skills": ["medical", "first_aid"],
    "languages": ["hindi"],
    "availability": "available",
    "experience_level": null,
    "zone": null
  },
  "total_matches": 4,
  "result_summary": "Found 4 Hindi-speaking medical volunteers available now"
}
`;

    const raw = await callGemini(prompt);
    const result = parseGeminiJSON<AIQueryResponse>(raw);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('/api/ai/query error:', error);
    return NextResponse.json(
      { success: false, error: 'Query AI failed', details: String(error) },
      { status: 500 }
    );
  }
}
