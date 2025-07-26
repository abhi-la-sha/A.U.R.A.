from collections import Counter

def extract_mitre_coverage(logs):
    counter = Counter()
    for log in logs:
        if "mitre_technique" in log:
            key = log["mitre_technique"].split()[0]
            counter[key] += 1
    return dict(counter)