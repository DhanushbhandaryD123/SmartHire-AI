from django.urls import path
from .views import *

urlpatterns = [

    # ================= CANDIDATE =================
    path('apply/', apply_candidate),

    # ================= JOB =================
    path('jobs/', get_jobs),   # GET + POST (create)
    path('jobs/<str:job_id>/', job_detail),  # PUT + DELETE

    path('jobs/<str:job_id>/candidates/', get_candidates_by_job),
    path('jobs/<str:job_id>/top-candidates/', get_top_candidates),

    # ================= CANDIDATES =================
    path('candidates/', get_candidates),

    # ================= HR =================
    path('hr/pending/', get_pending_candidates),
    path('hr/approve/<str:candidate_id>/', approve_candidate),
    path('hr/reject/<str:candidate_id>/', reject_candidate),

    # ================= FILE =================
    path('resume/<str:candidate_id>/', download_resume),

    # ================= ANALYTICS =================
    path('analytics/', get_analytics),

    # ================= EXPORT =================
    path('export/csv/', export_candidates_csv),
    path('export/pdf/', export_candidates_pdf),
]