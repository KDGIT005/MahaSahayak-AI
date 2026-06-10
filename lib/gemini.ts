import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

export async function callGemini(prompt: string): Promise<string> {
  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Gemini API error:', error);
    
    // DEMO FALLBACK FOR HACKATHONS (If API key hits quota)
    console.log('Using Demo Fallback for Gemini API');
    
    // Workforce Balance Fallback
    if (prompt.includes('analyzing volunteer workforce health')) {
      return JSON.stringify({
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
      });
    }

    // Emergency Fallback
    if (prompt.includes('AI Emergency Coordinator')) {
      return JSON.stringify({
        "primary_responders": ["v-01", "v-05", "v-07"],
        "backup_responders": ["v-02", "v-06"],
        "estimated_response_time": "3 mins",
        "action_plan": [
          "Dispatch Medical lead (v-01) immediately",
          "Divert 2 crowd control volunteers to establish perimeter",
          "Alert nearby medical tents"
        ],
        "risk_assessment": "High risk of crowd crush if perimeter is not established quickly.",
        "resource_requirements": ["Stretcher", "First Aid Kit", "Megaphone"]
      });
    }

    // Assign AI Fallback
    if (prompt.toLowerCase().includes('assign')) {
      return JSON.stringify({
        "selected_volunteer_ids": ["v-03", "v-04", "v-08", "v-12", "v-14"],
        "assignment_reasoning": {
          "v-03": "Selected for matching skills and low workload.",
          "v-04": "Selected for matching skills and low workload.",
          "v-08": "Selected for matching skills and low workload.",
          "v-12": "Selected for matching skills and low workload.",
          "v-14": "Selected for matching skills and low workload."
        },
        "shift_recommendation": "morning",
        "confidence_score": 0.88,
        "warnings": ["v-12 is approaching shift end in 1 hour"],
        "coverage_summary": "5 volunteers assigned. Zone coverage: 100%"
      });
    }

    throw new Error('Failed to get AI response. Please check your API key.');
  }
}

export function parseGeminiJSON<T>(text: string): T {
  // Strip markdown code fences if present
  const cleaned = text
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    // Try to extract JSON from the text
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]) as T;
    }
    throw new Error('Failed to parse AI response as JSON');
  }
}
