def filter_logs_by_severity(logs, severity_level):
    return [log for log in logs if log.get("severity", "").lower() == severity_level.lower()]