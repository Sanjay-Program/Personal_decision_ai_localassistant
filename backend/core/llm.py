from llama_cpp import Llama
import os

class LLMManager:
    def __init__(self, model_path: str):
        self.model_path = model_path
        self.llm = None
        
    def load_model(self):
        if not os.path.exists(self.model_path):
            print(f"Model not found at {self.model_path}")
            return False
            
        print(f"Loading model from {self.model_path}...")
        # Neural Squeezing: Optimized for memory-constrained environments
        # - n_ctx=1024 (Saves ~400-500MB RAM vs 2048)
        # - n_threads=4 (Prevents CPU thermal throttling)
        try:
            self.llm = Llama(
                model_path=self.model_path,
                n_ctx=1024,
                n_threads=4,
                n_batch=512,
                n_gpu_layers=0
            )
            return True
        except Exception as e:
            print(f"Error loading LLM: {e}")
            return False

    def chat(self, messages, stream=True):
        if not self.llm:
            if not self.load_model():
                yield "Error: Model could not be loaded."
                return

        response = self.llm.create_chat_completion(
            messages=messages,
            stream=stream,
            max_tokens=512,
            temperature=0.7
        )
        
        if stream:
            for chunk in response:
                delta = chunk['choices'][0]['delta']
                if 'content' in delta:
                    yield delta['content']
        else:
            return response['choices'][0]['message']['content']

# Default instance
MODEL_PATH = "/home/sanjay/project/ed/backend/models/qwen2.5-1.5b-instruct-q4_k_m.gguf"
llm_manager = LLMManager(MODEL_PATH)
