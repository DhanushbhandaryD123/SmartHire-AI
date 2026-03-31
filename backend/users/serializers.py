from rest_framework import serializers
from .models import User

class RegisterSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'role']
        extra_kwargs = {'password': {'write_only': True}}

    def validate_role(self, value):
        # ❌ Block HR registration from frontend
        if value == "hr":
            raise serializers.ValidationError("HR cannot register")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user