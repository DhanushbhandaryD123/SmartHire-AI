def keyword_score(resume_text, keywords):
    resume_text = resume_text.lower()

    matched = []
    missing = []

    for k in keywords:
        if k.lower() in resume_text:
            matched.append(k)
        else:
            missing.append(k)

    score = int((len(matched) / len(keywords)) * 100) if keywords else 0

    return score, matched, missing