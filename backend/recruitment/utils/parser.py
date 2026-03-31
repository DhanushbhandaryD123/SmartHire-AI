from pdfminer.high_level import extract_text


def extract_resume_text(file_path):
    try:
        text = extract_text(file_path)
        return text.lower() if text else ""
    except:
        return ""