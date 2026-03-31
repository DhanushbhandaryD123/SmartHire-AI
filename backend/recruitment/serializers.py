from rest_framework import serializers


# ================= JOB =================
class JobSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=255)
    description = serializers.CharField()
    keywords = serializers.ListField(
        child=serializers.CharField(),
        allow_empty=False
    )


# ================= CANDIDATE =================
class CandidateSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255)
    email = serializers.EmailField()
    resume = serializers.FileField(required=True)