import os
import base64
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC

class SecurityManager:
    def __init__(self):
        self.key = self._get_or_create_key()
        self.fernet = Fernet(self.key)

    def _get_or_create_key(self):
        # In a real scenario, use machine-specific ID + a salt
        # For this prototype, we'll use a local key file (protected by OS permissions)
        key_path = os.path.join(os.path.dirname(__file__), ".master.key")
        if os.path.exists(key_path):
            with open(key_path, "rb") as f:
                return f.read()
        else:
            # Generate a new key and secure the file
            key = Fernet.generate_key()
            with open(key_path, "wb") as f:
                f.write(key)
            os.chmod(key_path, 0o600) # Only owner can read
            return key

    def encrypt_data(self, data: bytes) -> bytes:
        return self.fernet.encrypt(data)

    def decrypt_data(self, encrypted_data: bytes) -> bytes:
        return self.fernet.decrypt(encrypted_data)

    def encrypt_file(self, file_path: str):
        if not os.path.exists(file_path):
            return
        with open(file_path, "rb") as f:
            data = f.read()
        encrypted = self.encrypt_data(data)
        with open(file_path, "wb") as f:
            f.write(encrypted)

    def decrypt_file(self, file_path: str):
        if not os.path.exists(file_path):
            return
        with open(file_path, "rb") as f:
            data = f.read()
        decrypted = self.decrypt_data(data)
        with open(file_path, "wb") as f:
            f.write(decrypted)

security_manager = SecurityManager()
