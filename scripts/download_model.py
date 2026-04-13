import os
from huggingface_hub import hf_hub_download

def download_model():
    repo_id = "Qwen/Qwen2.5-1.5B-Instruct-GGUF"
    filename = "qwen2.5-1.5b-instruct-q4_k_m.gguf"
    
    # Save directory
    local_dir = "/home/sanjay/project/ed/backend/models"
    os.makedirs(local_dir, exist_ok=True)
    
    print(f"Downloading {filename} from {repo_id}...")
    try:
        path = hf_hub_download(
            repo_id=repo_id,
            filename=filename,
            local_dir=local_dir
        )
        print(f"Model downloaded to: {path}")
    except Exception as e:
        print(f"Error downloading model: {e}")

if __name__ == "__main__":
    download_model()
