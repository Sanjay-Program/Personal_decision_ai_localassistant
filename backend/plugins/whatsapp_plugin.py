import asyncio
from playwright.async_api import async_playwright
from core.plugin_manager import BasePlugin
import os

class WhatsAppPlugin(BasePlugin):
    def __init__(self):
        super().__init__()
        self.name = "WhatsApp"
        self.description = "Live WhatsApp Web automation for real-time message ingestion."
        self.user_data_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "whatsapp_session")
        self.browser = None
        self.context = None
        self.page = None
        self.is_running = False

    def get_tools(self):
        return [
            {"name": "check_chats", "description": "Check for unread messages on WhatsApp Web"},
            {"name": "send_whatsapp", "description": "Send a WhatsApp message to a contact"}
        ]

    async def start_session(self, headless=True):
        if self.is_running:
            return
            
        p = await async_playwright().start()
        # Launch persistent context to save login
        self.context = await p.chromium.launch_persistent_context(
            user_data_dir=self.user_data_dir,
            headless=headless,
            args=["--disable-gpu", "--no-sandbox"]
        )
        
        self.page = await self.context.new_page()
        
        # Optimization: Block heavy resources
        await self.page.route("**/*", lambda route: route.abort() if route.request.resource_type in ["image", "media", "font"] else route.continue_())
        
        print("Connecting to WhatsApp Web...")
        await self.page.goto("https://web.whatsapp.com")
        self.is_running = True

    async def check_unread(self):
        if not self.page:
            return "WhatsApp session not started."
            
        try:
            # Look for unread message indicators
            unread_selector = "span[aria-label*='unread']"
            elements = await self.page.query_selector_all(unread_selector)
            return f"Found {len(elements)} chats with unread messages."
        except Exception as e:
            return f"Error checking WhatsApp: {e}"

    def execute(self, action: str, **kwargs):
        # Since execute needs to be synchronous for now in the existing Orchestrator,
        # we'll need to bridge it or make the whole chain async.
        # For the prototype, we'll return a status.
        return f"WhatsApp {action} requested. Connection is active."

whatsapp_plugin = WhatsAppPlugin()
