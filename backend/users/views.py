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
    try:
        serializer = RegisterSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # 🚫 Prevent HR registration
        if serializer.validated_data.get("role") == "hr":
            return Response(
                {"error": "HR cannot register"},
                status=status.HTTP_403_FORBIDDEN
            )

        user = serializer.save()

        return Response({
            "message": "User registered successfully",
            "user": {
                "username": user.username,
                "email": user.email,
                "role": user.role
            }
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response(
            {"error": "Registration failed", "details": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# ================= LOGIN =================
@api_view(['POST'])
def login(request):
    try:
        username = request.data.get("username")
        password = request.data.get("password")

        # 🔒 validation
        if not username or not password:
            return Response(
                {"error": "Username and password are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # ================= HR LOGIN (HARDCODE) =================
        if username == "admin@gmail.com" and password == "admin123":

            user, created = User.objects.get_or_create(
                email="admin@gmail.com",
                defaults={
                    "username": "admin",
                    "role": "hr"
                }
            )

            if created:
                user.set_password("admin123")
                user.save()

            refresh = RefreshToken.for_user(user)

            return Response({
                "message": "HR login successful",
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": {
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
                "username": user.username,
                "email": user.email,
                "role": user.role
            }
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {"error": "Login failed", "details": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )