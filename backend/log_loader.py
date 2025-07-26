import json
import os

def load_logs(file_path="simulation_logs/simulation_logs.json"):
    with open(file_path, "r") as f:
        logs = json.load(f)
    return logs
