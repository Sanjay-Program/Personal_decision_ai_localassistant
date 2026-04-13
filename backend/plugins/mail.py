from imap_tools import MailBox, AND
import smtplib
from email.message import EmailMessage
import os
import asyncio
from dotenv import load_dotenv
from core.plugin_manager import BasePlugin

load_dotenv()

class MailPlugin(BasePlugin):
    def __init__(self):
        super().__init__()
        self.name = "Mail"
        self.description = "Manages IMAP/SMTP email operations with Live IDLE support."
        self.imap_server = os.getenv("IMAP_SERVER", "imap.gmail.com")
        self.smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        self.email_user = os.getenv("EMAIL_USER")
        self.email_pass = os.getenv("EMAIL_PASS")
        self.smtp_port = int(os.getenv("SMTP_PORT", 465))
        self.is_idling = False

    def get_tools(self):
        return [
            {"name": "list_emails", "description": "Fetch recent email subjects"},
            {"name": "start_live_mail", "description": "Start listening for new emails in real-time"}
        ]

    async def start_idle_loop(self, callback):
        if not self.email_user or not self.email_pass:
            return
            
        print("Starting Gmail IDLE loop...")
        self.is_idling = True
        while self.is_idling:
            try:
                with MailBox(self.imap_server).login(self.email_user, self.email_pass) as mailbox:
                    # Wait for 10 minutes or check for new mail
                    responses = mailbox.idle.wait(timeout=600)
                    if responses:
                        for msg in mailbox.fetch(AND(seen=False)):
                            await callback(msg)
            except Exception as e:
                print(f"Mail IDLE Error: {e}")
                await asyncio.sleep(60) # Retry after 1 min

    def execute(self, action: str, **kwargs):
        if action == "list_emails":
            return self.list_recent_emails(kwargs.get("count", 5))
        return "Action requested."

    def list_recent_emails(self, count=5):
        if not self.email_user or not self.email_pass:
            return "Email credentials not configured."
            
        try:
            with MailBox(self.imap_server).login(self.email_user, self.email_pass) as mailbox:
                emails = []
                for msg in mailbox.fetch(limit=count, reverse=True):
                    emails.append({
                        "uid": msg.uid,
                        "from": msg.from_,
                        "subject": msg.subject,
                        "date": msg.date_str
                    })
                return emails
        except Exception as e:
            return f"Error fetching emails: {e}"

    def send_email(self, to, subject, body):
        if not self.email_user or not self.email_pass:
            return "Email credentials not configured."
            
        msg = EmailMessage()
        msg.set_content(body)
        msg['Subject'] = subject
        msg['From'] = self.email_user
        msg['To'] = to

        try:
            with smtplib.SMTP_SSL(self.smtp_server, self.smtp_port) as server:
                server.login(self.email_user, self.email_pass)
                server.send_message(msg)
            return "Email sent successfully."
        except Exception as e:
            return f"Error sending email: {e}"
