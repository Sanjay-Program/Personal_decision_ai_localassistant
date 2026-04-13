import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
import os
import json
from .security import security_manager

class MemoryManager:
    def __init__(self, storage_path: str = "/home/sanjay/project/ed/backend/memory"):
        self.storage_path = storage_path
        os.makedirs(self.storage_path, exist_ok=True)
        
        # Use a very small embedding model to save RAM (approx 80MB)
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        self.dimension = 384
        self.index = faiss.IndexFlatL2(self.dimension)
        self.metadata = []
        
        self.load()

    def add_memory(self, text: str, metadata: dict = None):
        embedding = self.model.encode([text])
        self.index.add(np.array(embedding).astype('float32'))
        self.metadata.append({"text": text, "metadata": metadata or {}})
        self.save()

    def search(self, query: str, k: int = 3):
        if self.index.ntotal == 0:
            return []
            
        embedding = self.model.encode([query])
        distances, indices = self.index.search(np.array(embedding).astype('float32'), k)
        
        results = []
        for i in range(len(indices[0])):
            idx = indices[0][i]
            if idx != -1 and idx < len(self.metadata):
                results.append(self.metadata[idx])
        return results

    def save(self):
        index_path = os.path.join(self.storage_path, "index.faiss")
        meta_path = os.path.join(self.storage_path, "metadata.json")
        
        # 1. Write the raw files temporarily
        faiss.write_index(self.index, index_path)
        with open(meta_path, "w") as f:
            json.dump(self.metadata, f)
            
        # 2. Encrypt them
        security_manager.encrypt_file(index_path)
        security_manager.encrypt_file(meta_path)

    def load(self):
        index_path = os.path.join(self.storage_path, "index.faiss")
        meta_path = os.path.join(self.storage_path, "metadata.json")
        
        if os.path.exists(index_path) and os.path.exists(meta_path):
            try:
                # 1. Decrypt into memory and load
                security_manager.decrypt_file(index_path)
                security_manager.decrypt_file(meta_path)
                
                self.index = faiss.read_index(index_path)
                with open(meta_path, "r") as f:
                    self.metadata = json.load(f)
                    
                # 2. Re-encrypt after loading to keep it secure on disk
                security_manager.encrypt_file(index_path)
                security_manager.encrypt_file(meta_path)
            except Exception as e:
                print(f"Error loading encrypted memory: {e}")
                # Fallback to empty if decryption fails (e.g. wrong key)
                self.index = faiss.IndexFlatL2(self.dimension)
                self.metadata = []

# Default instance
memory_manager = MemoryManager()
