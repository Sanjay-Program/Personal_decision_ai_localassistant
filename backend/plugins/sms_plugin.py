import re
import os
import subprocess
from typing import List, Dict, Any
from core.plugin_manager import BasePlugin

class SmsPlugin(BasePlugin):
    def __init__(self):
        super().__init__()
        self.name = "SMS Airtel"
        self.description = "Parses and stores SMS data, specifically optimized for Indian Airtel messages."
        
        # Airtel Specific Patterns
        self.patterns = {
            "data_balance": r"(?i)data\s+balance.*?(\d+(?:\.\d+)?\s*(?:GB|MB))",
            "amount": r"(?i)(?:bill|amount|INR|Rs\.?)\s*[:\s]*(\d+(?:\.\d{1,2})?)",
            "account": r"(?i)(?:A/c|fixedline|mobile|no|number)?\.?\s*[X*]*(\d{2,10})",
            "is_airtel": r"(?i)airtel"
        }

    def get_tools(self):
        return [
            {"name": "fetch_adb_sms", "description": "Fetch latest messages from connected Android phone via ADB"},
            {"name": "parse_sms", "description": "Parse a raw SMS string for Airtel insights"}
        ]

    def execute(self, action: str, **kwargs):
        if action == "parse_sms":
            return self.parse_raw_sms(kwargs.get("text", ""))
        elif action == "fetch_adb_sms":
            return self.fetch_latest_adb_sms(kwargs.get("limit", 5))
        return "Action not supported"

    def fetch_latest_adb_sms(self, limit=5):
        try:
            # Command to query the SMS inbox via ADB
            cmd = f"adb shell content query --uri content://sms/inbox --projection address:body:date --limit {limit}"
            result = subprocess.run(cmd.split(), capture_with=True, text=True, check=True)
            return self._parse_adb_output(result.stdout)
        except Exception as e:
            return f"ADB Error: {e}. Ensure phone is connected and ADB debugging is enabled."

    def _parse_adb_output(self, output: str) -> List[Dict[str, str]]:
        messages = []
        for line in output.splitlines():
            if "Row:" in line:
                # Extract address, body using basic regex
                address = re.search(r"address=([^,]+)", line)
                body = re.search(r"body=([^,]+)", line)
                messages.append({
                    "address": address.group(1) if address else "Unknown",
                    "body": body.group(1) if body else "No content"
                })
        return messages

    def parse_raw_sms(self, text: str) -> Dict[str, Any]:
        results = {
            "is_airtel": bool(re.search(self.patterns["is_airtel"], text)),
            "data_found": None,
            "amount_found": None,
            "account_found": None,
            "raw": text
        }
        
        data_match = re.search(self.patterns["data_balance"], text)
        if data_match:
            results["data_found"] = data_match.group(1)
            
        amount_match = re.search(self.patterns["amount"], text)
        if amount_match:
            results["amount_found"] = amount_match.group(1)
            
        account_match = re.search(self.patterns["account"], text)
        if account_match:
            results["account_found"] = account_match.group(1)
            
        return results
