from celery import shared_task
from .utils.parser import parse_resume
from .utils.keyword_scorer import keyword_score
from .utils.ai_scorer import ai_score
from .utils.email_service import send_email
from .db import candidates_collection


@shared_task
def process_resume(candidate_id, resume_path, job_keywords):
    try:
        text = parse_resume(resume_path)

        # keyword scoring
        k_score, matched, missing = keyword_score(text, job_keywords)

        # ai scoring
        ai_result = ai_score(text, keywords=job_keywords)
        a_score = ai_result["score"]

        final_score = (k_score + a_score) / 2

        candidates_collection.update_one(
            {"_id": candidate_id},
            {"$set": {
                "keyword_score": k_score,
                "ai_score": a_score,
                "final_score": final_score,
                "matched_skills": matched,
                "missing_skills": missing,
                "status": "processed"
            }}
        )

    except Exception as e:
        print("ERROR:", e)


@shared_task
def send_status_email(email, status):
    try:
        send_email(email, status)
    except Exception as e:
        print("EMAIL ERROR:", e)