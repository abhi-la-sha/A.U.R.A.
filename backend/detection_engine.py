def run_detection_engine(logs):
    rules = {
        "T1059": ["powershell", "script"],
        "T1003": ["mimikatz", "lsass", "token"],
        "T1486": ["ransomware", "encrypted"],
        "T1566": ["phishing", "email"],
    }
    results = {}
    for log in logs:
        technique = log.get("technique_id", "").split()[0]
        desc = log.get("activity", "").lower()
        matched = any(keyword in desc for keyword in rules.get(technique, []))
        results[technique] = "Full" if matched else "None"
    return results
