from playwright.sync_api import sync_playwright
from core.plugin_manager import BasePlugin
from typing import List, Dict, Any

class BrowserPlugin(BasePlugin):
    def __init__(self):
        super().__init__()
        self.name = "Browser"
        self.description = "Enables the AI to browse the web for real-time information."

    def get_tools(self):
        return [
            {"name": "browse_url", "description": "Fetches text content from a URL"},
            {"name": "search_web", "description": "Performs a web search and returns results"}
        ]

    def execute(self, action: str, **kwargs):
        if action == "browse_url":
            return self.fetch_content(kwargs.get("url"))
        elif action == "search_web":
            return self.search(kwargs.get("query"))
        return "Action not supported"

    def fetch_content(self, url: str) -> str:
        try:
            with sync_playwright() as p:
                browser = p.chromium.launch(headless=True)
                page = browser.new_page()
                page.goto(url, wait_until="networkidle")
                content = page.evaluate("() => document.body.innerText")
                browser.close()
                return content[:5000] # Return summarized/truncated content
        except Exception as e:
            return f"Error browsing URL: {e}"

    def search(self, query: str) -> str:
        # Simple URL search for now (DuckDuckGo or Google)
        url = f"https://www.google.com/search?q={query}"
        return self.fetch_content(url)
