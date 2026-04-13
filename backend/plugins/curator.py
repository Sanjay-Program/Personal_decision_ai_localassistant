import json
import os
from datetime import datetime, timedelta
from core.llm import llm_manager

class CuratorPlugin:
    def __init__(self, db_path="simulation/mock_db.json"):
        self.db_path = db_path

    def generate_briefing(self):
        if not os.path.exists(self.db_path):
            return "No life data found to curate."

        with open(self.db_path, "r") as f:
            data = json.load(f)

        # 1. Gather context from last 48 hours
        now = datetime.now()
        recent_cutoff = now - timedelta(days=2)
        
        briefing_context = []
        
        # Parse Finance for high spending
        recent_finance = [f for f in data["finance"] if datetime.fromisoformat(f["timestamp"]) > recent_cutoff]
        if recent_finance:
            total_spent = sum(f["amount"] for f in recent_finance)
            briefing_context.append(f"Finance: User spent {total_spent} in last 48h across {len(recent_finance)} transactions.")

        # Parse Mail for highlights
        recent_mail = [m for m in data["mail"] if datetime.fromisoformat(m["timestamp"]) > recent_cutoff]
        for m in recent_mail:
            briefing_context.append(f"Mail from {m['sender']}: {m['subject']}")

        # Parse Fitness
        today_fitness = data["fitness"][-1]
        briefing_context.append(f"Fitness Today: {today_fitness['steps']} steps, {today_fitness['sleep_hours']}h sleep.")

        # 2. Use Local LLM to Curate (Optimized for 1024 Context)
        prompt = [
            {"role": "system", "content": "You are 'The Curator'. Synthesize the data into exactly THREE high-impact, bulleted tactical insights. Focus on financial leaks and health alerts. Use a professional, minimalist tone. Max 100 words."},
            {"role": "user", "content": f"DATA:\n" + "\n".join(briefing_context) + "\n\nBRIEFING:"}
        ]

        try:
            response = ""
            for chunk in llm_manager.chat(prompt, stream=True):
                response += chunk
            return response
        except Exception as e:
            return f"Curator is currently busy synthesizing: {str(e)}"

curator = CuratorPlugin()
