from rest_framework import serializers
from .models import User


class RegisterSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'role']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    # ✅ Role validation
    def validate_role(self, value):
        if value == "hr":
            raise serializers.ValidationError("HR cannot register")
        return value

    # ✅ Email unique validation
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value

    # ✅ Create user properly
    def create(self, validated_data):
        password = validated_data.pop("password")

        user = User(
            username=validated_data.get("username"),
            email=validated_data.get("email"),
            role=validated_data.get("role", "candidate")  # default role
        )

        user.set_password(password)  # 🔐 hashing
        user.save()

        return user