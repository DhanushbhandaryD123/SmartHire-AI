import os
import uuid
import json
from datetime import datetime
from bson import ObjectId

from django.conf import settings
from django.http import FileResponse
from django.http import HttpResponse
import csv

from reportlab.platypus import SimpleDocTemplate, Table
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .serializers import CandidateSerializer, JobSerializer
from .utils.parser import parse_resume
from .utils.email_service import send_email
from .utils.keyword_scorer import keyword_score
from .utils.ai_scorer import ai_score
from .utils.redis_client import redis_client
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

        # AI PROCESS
        resume_text = parse_resume(file_path)

        k_score, _, _ = keyword_score(resume_text, job.get("keywords", []))
        ai_result = ai_score(
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


# ================= JOBS =================
@api_view(['GET', 'POST'])
def get_jobs(request):

    # CREATE JOB
    if request.method == 'POST':
        if request.user.role != 'hr':
            return Response({"error": "Unauthorized"}, status=403)

        serializer = JobSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        job = serializer.validated_data
        job["created_at"] = datetime.utcnow()

        result = jobs_collection.insert_one(job)

        redis_client.delete("jobs")  # ✅ clear cache

        return Response({"job_id": str(result.inserted_id)}, status=201)

    # GET JOBS
    cached = redis_client.get("jobs")

    if cached:
        jobs = json.loads(cached)
    else:
        jobs = list(jobs_collection.find())

        for j in jobs:
            j["_id"] = str(j["_id"])

        redis_client.setex("jobs", 60, json.dumps(jobs))

    # SEARCH
    search = request.GET.get("search", "").strip()
    if search:
        search = search.lower()
        jobs = [
            j for j in jobs
            if search in j.get("title", "").lower()
            or search in j.get("description", "").lower()
        ]

    # PAGINATION (SAFE)
    try:
        page = int(request.GET.get("page", 1))
        limit = int(request.GET.get("limit", 10))
    except ValueError:
        return Response({"error": "Invalid pagination"}, status=400)

    if page < 1:
        page = 1
    if limit < 1:
        limit = 10

    start = (page - 1) * limit
    end = start + limit

    return Response({
        "total": len(jobs),
        "page": page,
        "limit": limit,
        "data": jobs[start:end]
    })


# ================= JOB UPDATE / DELETE =================
@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def job_detail(request, job_id):

    if request.user.role != 'hr':
        return Response({"error": "Unauthorized"}, status=403)

    try:
        obj_id = ObjectId(job_id)
    except:
        return Response({"error": "Invalid ID"}, status=400)

    job = jobs_collection.find_one({"_id": obj_id})
    if not job:
        return Response({"error": "Job not found"}, status=404)

    if request.method == 'PUT':
        jobs_collection.update_one(
            {"_id": obj_id},
            {"$set": request.data}
        )
        redis_client.delete("jobs")  # ✅ clear cache
        return Response({"message": "Job updated"})

    if request.method == 'DELETE':
        jobs_collection.delete_one({"_id": obj_id})
        redis_client.delete("jobs")  # ✅ clear cache
        return Response({"message": "Job deleted"})


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

    try:
        obj_id = ObjectId(candidate_id)
    except Exception:
        return Response({"error": "Invalid candidate ID"}, status=400)
    candidate = candidates_collection.find_one({"_id": obj_id})

    if not candidate:
        return Response({"error": "Not found"}, status=404)

    candidates_collection.update_one(
        {"_id": obj_id},
        {"$set": {"hr_status": "approved"}}
    )

    send_email(
        candidate["email"],  # ✅ FIXED
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

    try:
        obj_id = ObjectId(candidate_id)
    except Exception:
        return Response({"error": "Invalid candidate ID"}, status=400)
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

    if request.user.role != 'hr':
        return Response({"error": "Unauthorized"}, status=403)

    try:
        obj_id = ObjectId(candidate_id)
    except Exception:
        return Response({"error": "Invalid candidate ID"}, status=400)

    candidate = candidates_collection.find_one({"_id": obj_id})

    if not candidate:
        return Response({"error": "Not found"}, status=404)

    path = candidate.get("resume_file")

    if not path or not os.path.exists(path):
        return Response({"error": "File missing"}, status=404)

    return FileResponse(open(path, "rb"), content_type="application/pdf")


# ================= ANALYTICS =================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_analytics(request):
    if request.user.role != 'hr':
        return Response({"error": "Unauthorized"}, status=403)

    total_jobs = jobs_collection.count_documents({})
    total_candidates = candidates_collection.count_documents({})

    pending = candidates_collection.count_documents({"hr_status": "pending"})
    approved = candidates_collection.count_documents({"hr_status": "approved"})
    rejected = candidates_collection.count_documents({"hr_status": "rejected"})

    # 📊 Top job
    pipeline = [
        {"$group": {"_id": "$job_title", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 1}
    ]

    top_job = list(candidates_collection.aggregate(pipeline))

    return Response({
        "total_jobs": total_jobs,
        "total_candidates": total_candidates,
        "pending": pending,
        "approved": approved,
        "rejected": rejected,
        "top_job": top_job[0] if top_job else None
    })
    


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def export_candidates_csv(request):
    if request.user.role != 'hr':
        return Response({"error": "Unauthorized"}, status=403)

    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="candidates.csv"'

    writer = csv.writer(response)
    writer.writerow(["Name", "Email", "Job", "Score", "Status"])

    candidates = candidates_collection.find()

    for c in candidates:
        writer.writerow([
            c.get("name"),
            c.get("email"),
            c.get("job_title"),
            c.get("score"),
            c.get("hr_status")
        ])

    return response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def export_candidates_pdf(request):
    if request.user.role != 'hr':
        return Response({"error": "Unauthorized"}, status=403)

    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="candidates.pdf"'

    doc = SimpleDocTemplate(response)
    data = [["Name", "Email", "Job", "Score", "Status"]]

    for c in candidates_collection.find():
        data.append([
            c.get("name"),
            c.get("email"),
            c.get("job_title"),
            c.get("score"),
            c.get("hr_status")
        ])

    table = Table(data)
    doc.build([table])
    return response