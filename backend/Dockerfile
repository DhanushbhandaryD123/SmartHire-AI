# Use Python
FROM python:3.10

# Set working dir
WORKDIR /app

# Copy files
COPY . .

# Install deps
RUN pip install --no-cache-dir -r requirements.txt

# Run server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]