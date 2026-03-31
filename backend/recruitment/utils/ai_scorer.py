import os
import json
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def ai_score_resume(resume_text, job_title, job_description, keywords):
    try:
        prompt = f"""
You are an AI recruiter.

Job Title: {job_title}
Job Description: {job_description}
Required Skills: {', '.join(keywords)}

Candidate Resume:
{resume_text}

Return STRICT JSON only:
{{
  "score": 0-100,
  "matched_skills": [],
  "missing_skills": [],
  "strengths": "",
  "weaknesses": ""
}}
"""

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3
        )

        output = response.choices[0].message.content.strip()

        # Clean markdown
        if "```" in output:
            output = output.replace("```json", "").replace("```", "").strip()

        result = json.loads(output)

        return {
            "score": int(result.get("score", 50)),
            "matched_skills": result.get("matched_skills", []),
            "missing_skills": result.get("missing_skills", []),
            "strengths": result.get("strengths", ""),
            "weaknesses": result.get("weaknesses", "")
        }

    except Exception:
        return {
            "score": 50,
            "matched_skills": [],
            "missing_skills": [],
            "strengths": "Fallback scoring used",
            "weaknesses": "AI parsing failed"
        }