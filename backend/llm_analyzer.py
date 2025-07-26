import google.generativeai as genai
import os

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("models/gemini-pro")

def format_prompt(logs):
    prompt = "You are a SOC analyst. Analyze the logs:\n"
    for i, log in enumerate(logs, 1):
        prompt += f"{i}. {log['description']} [Tactic: {log['event_type']}, Technique: {log['mitre_technique']}]\n"
    prompt += "\nClassify detection coverage (Full, Partial, None), summarize attacks, and suggest detection rules."
    return prompt

def analyze_logs_with_gemini(logs):
    prompt = format_prompt(logs)
    response = model.generate_content(prompt)
    return {
        "prompt": prompt,
        "markdown_summary": response.text
    }
