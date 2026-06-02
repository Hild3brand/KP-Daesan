export const buildUnderstandingExercisePrompt = ({
  stageCode,
  stageName,
  skillName,
  focusArea,
  materialChunk,
  studentErrorProfile,
  numQuestion,
}) => {

  const normalizedStage =
    String(stageCode || "")
      .toUpperCase()
      .trim();

  const safeStageCode = stageCode || "U1";
  const safeStageName = stageName || "Understanding";
  const safeSkillName = skillName || "Korean";
  const safeFocusArea = focusArea || "General";
  const safeMaterial = materialChunk || "No material provided";
  const safeErrorProfile = studentErrorProfile || "None";
  const safeNumQuestion = Number(numQuestion) || 10;

  const basePrompt = `
ROLE:
You are an expert Korean language tutor inside an Intelligent Tutoring System.

TASK:
Generate Korean language exercises for the UNDERSTANDING stage of Bloom's Taxonomy.

STAGE:
${safeStageCode} - ${safeStageName}

SKILL:
${safeSkillName}

FOCUS AREA:
${safeFocusArea}

LEARNING OBJECTIVE:
Students should understand:
- contextual meaning
- grammar interpretation
- sentence usage
- paraphrasing
- vocabulary meaning in context

====================================================
🚨 CRITICAL OUTPUT RULES (STRICT)
====================================================
YOU MUST FOLLOW THESE RULES WITHOUT EXCEPTION:

1. Output MUST be ONLY valid JSON
2. DO NOT include markdown (no \`\`\`)
3. DO NOT include explanation text
4. DO NOT include comments
5. DO NOT include extra text before or after JSON
6. DO NOT wrap output in code block
7. OUTPUT MUST START WITH { AND END WITH }

If output is not valid JSON → it is considered WRONG.

====================================================
QUESTION REQUIREMENTS
====================================================

- Generate exactly ${safeNumQuestion} questions
- MUST include BOTH types:
  - "multiple_choice"
  - "true_false"

QUESTION TYPE RULES:

1. multiple_choice:
   - type: "multiple_choice"
   - exactly 4 options (A, B, C, D)
   - only 1 correct answer

2. true_false:
   - type: "true_false"
   - exactly 2 options:
     - True
     - False
   - only 1 correct answer

DISTRIBUTION:
- ~60% multiple_choice
- ~40% true_false

====================================================
MATERIAL
====================================================
${safeMaterial}

====================================================
STUDENT ERROR PROFILE
====================================================
${safeErrorProfile}

====================================================
REQUIRED JSON FORMAT (STRICT)
====================================================

Return ONLY this structure:

{
  "questions": [
    {
      "id": "Q1",
      "type": "multiple_choice",
      "question": "",
      "options": [
        { "key": "A", "text": "" },
        { "key": "B", "text": "" },
        { "key": "C", "text": "" },
        { "key": "D", "text": "" }
      ],
      "answer": "A",
      "diagnostic": {
        "mastery_if_correct": "",
        "error_profile_if_wrong": ""
      }
    }
  ]
}
`;

  return basePrompt;
};