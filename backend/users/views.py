import os

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import RegisterSerializer
from .models import User


# ================= REGISTER =================
@api_view(['POST'])
def register(request):
    serializer = RegisterSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    user = serializer.save()

    return Response({
        "message": "User registered successfully",
        "user": {
            "id": str(user.id),   # ✅ useful for frontend
            "username": user.username,
            "email": user.email,
            "role": user.role
        }
    }, status=status.HTTP_201_CREATED)


# ================= LOGIN =================
@api_view(['POST'])
def login(request):
    username = request.data.get("username")
    password = request.data.get("password")

    # 🔴 validation
    if not username or not password:
        return Response(
            {"error": "Username and password are required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # ================= HR LOGIN =================
    admin_email = os.getenv("HR_ADMIN_EMAIL")
    admin_password = os.getenv("HR_ADMIN_PASSWORD")

    if admin_email and username == admin_email and password == admin_password:

        user, created = User.objects.get_or_create(
            email=admin_email,
            defaults={
                "username": admin_email,
                "role": "hr"
            }
        )

        if created:
            user.set_password(admin_password)
            user.save()

        refresh = RefreshToken.for_user(user)

        return Response({
            "message": "HR login successful",
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": str(user.id),
                "username": user.username,
                "email": user.email,
                "role": "hr"
            }
        }, status=status.HTTP_200_OK)

    # ================= NORMAL USER LOGIN =================
    user = authenticate(username=username, password=password)

    if user is None:
        return Response(
            {"error": "Invalid credentials"},
            status=status.HTTP_401_UNAUTHORIZED
        )

    refresh = RefreshToken.for_user(user)

    return Response({
        "message": "Login successful",
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "user": {
            "id": str(user.id),
            "username": user.username,
            "email": user.email,
            "role": user.role
        }
    }, status=status.HTTP_200_OK)