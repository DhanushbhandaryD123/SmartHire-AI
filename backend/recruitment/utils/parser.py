from pdfminer.high_level import extract_text

def parse_resume(file_path):   # ✅ FIXED NAME
    try:
        text = extract_text(file_path)
        return text.lower() if text else ""
    except Exception:
        return ""