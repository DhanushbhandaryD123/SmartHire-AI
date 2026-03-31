import os
import uuid
from datetime import datetime
from bson import ObjectId

from django.conf import settings
from django.http import FileResponse

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .serializers import CandidateSerializer, JobSerializer
from .utils.parser import extract_resume_text
from .utils.email_service import send_email
from .utils.keyword_scorer import keyword_score
from .utils.ai_scorer import ai_score_resume
from .db import candidates_collection, jobs_collection


# ================= APPLY =================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def apply_candidate(request):
    try:
        if request.user.role != 'candidate':
            return Response({"error": "Only candidates can apply"}, status=403)

        serializer = CandidateSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        name = serializer.validated_data['name']
        email = serializer.validated_data['email']
        resume = serializer.validated_data.get('resume')
        job_id = request.data.get("job_id")

        if not resume or not job_id:
            return Response({"error": "Missing data"}, status=400)

        try:
            job_obj_id = ObjectId(job_id)
        except:
            return Response({"error": "Invalid job ID"}, status=400)

        job = jobs_collection.find_one({"_id": job_obj_id})
        if not job:
            return Response({"error": "Job not found"}, status=404)

        # SAVE FILE
        upload_dir = os.path.join(settings.MEDIA_ROOT, "resumes")
        os.makedirs(upload_dir, exist_ok=True)

        file_name = f"{uuid.uuid4()}_{resume.name}"
        file_path = os.path.join(upload_dir, file_name)

        with open(file_path, "wb+") as f:
            for chunk in resume.chunks():
                f.write(chunk)

        resume_text = extract_resume_text(file_path)

        k_score, _, _ = keyword_score(resume_text, job.get("keywords", []))
        ai_result = ai_score_resume(
            resume_text,
            job.get("title"),
            job.get("description"),
            job.get("keywords", [])
        )

        final_score = int((k_score * 0.4) + (ai_result.get("score", 0) * 0.6))

        candidates_collection.insert_one({
            "name": name,
            "email": email,
            "job_id": job_id,
            "job_title": job.get("title"),
            "resume_file": file_path,
            "score": final_score,
            "hr_status": "pending",
            "created_at": datetime.utcnow()
        })

        return Response({"message": "Applied", "score": final_score})

    except Exception as e:
        return Response({"error": str(e)}, status=500)


# ================= CREATE JOB =================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_job(request):
    if request.user.role != 'hr':
        return Response({"error": "Unauthorized"}, status=403)

    serializer = JobSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=400)

    job = serializer.validated_data
    job["created_at"] = datetime.utcnow()

    result = jobs_collection.insert_one(job)

    return Response({"job_id": str(result.inserted_id)})


# ================= GET JOBS =================
@api_view(['GET'])
def get_jobs(request):
    jobs = list(jobs_collection.find())

    for j in jobs:
        j["_id"] = str(j["_id"])

    return Response(jobs)


# ================= ALL CANDIDATES =================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_candidates(request):
    if request.user.role != 'hr':
        return Response({"error": "Unauthorized"}, status=403)

    candidates = list(candidates_collection.find())

    for c in candidates:
        c["_id"] = str(c["_id"])

    return Response(candidates)


# ================= BY JOB =================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_candidates_by_job(request, job_id):
    if request.user.role != 'hr':
        return Response({"error": "Unauthorized"}, status=403)

    candidates = list(candidates_collection.find({"job_id": job_id}))

    for c in candidates:
        c["_id"] = str(c["_id"])

    return Response(candidates)


# ================= TOP CANDIDATES =================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_top_candidates(request, job_id):
    if request.user.role != 'hr':
        return Response({"error": "Unauthorized"}, status=403)

    candidates = list(candidates_collection.find({"job_id": job_id}))
    candidates.sort(key=lambda x: x.get("score", 0), reverse=True)

    top = candidates[:5]

    for c in top:
        c["_id"] = str(c["_id"])

    return Response(top)


# ================= PENDING =================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_pending_candidates(request):
    if request.user.role != 'hr':
        return Response({"error": "Unauthorized"}, status=403)

    candidates = list(candidates_collection.find({"hr_status": "pending"}))

    for c in candidates:
        c["_id"] = str(c["_id"])

    return Response(candidates)


# ================= APPROVE =================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def approve_candidate(request, candidate_id):
    if request.user.role != 'hr':
        return Response({"error": "Unauthorized"}, status=403)

    obj_id = ObjectId(candidate_id)
    candidate = candidates_collection.find_one({"_id": obj_id})

    if not candidate:
        return Response({"error": "Not found"}, status=404)

    candidates_collection.update_one(
        {"_id": obj_id},
        {"$set": {"hr_status": "approved"}}
    )

    send_email(
        "dhanushbhandary88@gmail.com",
        "Candidate Approved",
        f"{candidate.get('name')} approved",
        attachment_path=candidate.get("resume_file")
    )

    return Response({"message": "Approved"})


# ================= REJECT =================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reject_candidate(request, candidate_id):
    if request.user.role != 'hr':
        return Response({"error": "Unauthorized"}, status=403)

    obj_id = ObjectId(candidate_id)
    candidate = candidates_collection.find_one({"_id": obj_id})

    if not candidate:
        return Response({"error": "Not found"}, status=404)

    candidates_collection.update_one(
        {"_id": obj_id},
        {"$set": {"hr_status": "rejected"}}
    )

    send_email(candidate["email"], "Rejected", "Not selected")

    return Response({"message": "Rejected"})


# ================= DOWNLOAD =================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def download_resume(request, candidate_id):
    obj_id = ObjectId(candidate_id)
    candidate = candidates_collection.find_one({"_id": obj_id})

    if not candidate:
        return Response({"error": "Not found"}, status=404)

    path = candidate.get("resume_file")

    if not os.path.exists(path):
        return Response({"error": "File missing"}, status=404)

    return FileResponse(open(path, "rb"), content_type="application/pdf")


# ================= VIEW =================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_resume(request, candidate_id):
    return download_resume(request, candidate_id)