from django.urls import path
from .views import *

urlpatterns = [

    # ================= CANDIDATE =================
    path('apply/', apply_candidate),

    # ================= JOB =================
    path('jobs/', get_jobs),
    path('jobs/create/', create_job),
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
    path('resume/<str:candidate_id>/', get_resume),
]