import os
import json
import asyncio
from typing import List, Dict, Any
from .llm import llm_manager
from .memory import memory_manager
from .plugin_manager import plugin_manager
from plugins.curator import curator

class Orchestrator:
    def __init__(self):
        self.llm = llm_manager
        self.memory = memory_manager
        self.plugins = plugin_manager
        self.plugins.load_plugins()
        self.live_tasks = []

    async def start_live_services(self):
        """Starts background workers for Gmail, WhatsApp, and SMS."""
        print("Initializing Live Intelligence Stream...")
        
        # 1. Start Gmail IDLE loop
        if "mail" in self.plugins.plugins:
            task = asyncio.create_task(self.plugins.plugins["mail"].start_idle_loop(self._on_new_mail))
            self.live_tasks.append(task)

        # 2. Start WhatsApp Session (Headless for 4GB RAM)
        if "whatsapp" in self.plugins.plugins:
            await self.plugins.plugins["whatsapp"].start_session(headless=True)
            task = asyncio.create_task(self._whatsapp_monitor_loop())
            self.live_tasks.append(task)
            
        # 3. Start ADB Monitor
        task = asyncio.create_task(self._adb_monitor_loop())
        self.live_tasks.append(task)

    async def _on_new_mail(self, msg):
        content = f"New Email from {msg.from_}: {msg.subject}"
        self.add_to_memory(content, {"source": "gmail", "uid": msg.uid})
        print(f"Ingested: {content}")

    async def _whatsapp_monitor_loop(self):
        while True:
            status = await self.plugins.plugins["whatsapp"].check_unread()
            if "unread" in status:
                self.add_to_memory(f"WhatsApp Alert: {status}", {"source": "whatsapp"})
            await asyncio.sleep(300) # Check every 5 mins

    async def _adb_monitor_loop(self):
        while True:
            if "sms_plugin" in self.plugins.plugins:
                messages = self.plugins.plugins["sms_plugin"].fetch_latest_adb_sms(limit=3)
                if isinstance(messages, list):
                    for msg in messages:
                        self.add_to_memory(f"SMS from {msg.get('address', 'Unknown')}: {msg.get('body', '')}", {"source": "sms"})
            await asyncio.sleep(600) # Check every 10 mins

    def process_query(self, query: str):
        # 1. Search memory for relevant context
        context_items = self.memory.search(query)
        context_str = "\n".join([item['text'] for item in context_items if 'text' in item])
        
        # 2. UNIFIED CONTEXT GATHERING
        tool_context = {}
        if any(kw in query.lower() for kw in ["mail", "email", "gmail"]):
            tool_context["Recent_Emails"] = self.plugins.execute_plugin("mail", "list_emails")
        if any(kw in query.lower() for kw in ["sms", "airtel", "message", "balance"]):
            if "sms_plugin" in self.plugins.plugins:
                tool_context["Live_SMS_Data"] = self.plugins.plugins["sms_plugin"].fetch_latest_adb_sms(limit=3)
        if any(kw in query.lower() for kw in ["search", "browse", "news", "current"]):
            tool_context["Web_Browser"] = "Available for real-time lookups."

        # 3. Build system prompt
        system_prompt = f"""You are a helpful, private AI assistant named 'The Curator'. 
Your core mission is to protect privacy while providing unified intelligence.

Context from Local Memory:
{context_str}

Connected Service Context:
{json.dumps(tool_context, indent=2)}

Available Capabilities: {', '.join(self.plugins.plugins.keys())}

GUIDELINES:
1. Synthesize information from ALL provided contexts.
2. If the context is empty, simply state what you can do.
3. Keep the tone professional, like a high-end digital butler.
4. All data processing is strictly local.
5. If the user asks to send a mail, use [SEND_EMAIL: to="x", subject="y", body="z"].
"""
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": query}
        ]
        
        # 4. Stream response
        return self.llm.chat(messages)

    def get_daily_briefing(self):
        """Generates a high-level curated briefing from the simulator data."""
        return curator.generate_briefing()

    def add_to_memory(self, content: str, metadata: dict = None):
        self.memory.add_memory(content, metadata)

# Default instance
orchestrator = Orchestrator()
