import { initLlama } from 'llama.rn';
import RNFS from 'react-native-fs';

export class LlamaEngine {
  private context: any = null;
  private modelPath: string = '';

  constructor(modelName: string = 'qwen2.5-1.5b-instruct-q4_k_m.gguf') {
    // On Android, Internal Storage is mapped to /storage/emulated/0/
    this.modelPath = `/storage/emulated/0/Download/models/${modelName}`;
  }

  async initialize() {
    console.log("Initializing Mobile AI Engine...");
    
    // Check if model exists
    const exists = await RNFS.exists(this.modelPath);
    if (!exists) {
      throw new Error(`Model not found at ${this.modelPath}. Please download it first.`);
    }

    // Initialize llama context
    // We target 4GB RAM devices, so we use low context and Q4 quantization
    this.context = await initLlama({
      model: this.modelPath,
      n_ctx: 2048,           // Limited context for mobile stability
      n_gpu_layers: 0,       // Adjust based on device (0 = CPU only)
      use_mlock: true,       // Lock in RAM for speed
      is_model_asset: false
    });

    console.log("Mobile AI Engine Ready.");
  }

  async chat(messages: { role: string, content: string }[]) {
    if (!this.context) throw new Error("AI Context not initialized");

    const prompt = this.formatPrompt(messages);
    
    return await this.context.completion({
      prompt: prompt,
      n_predict: 512,
      stop: ['<|im_end|>', '<|endoftext|>'],
      temperature: 0.7,
    });
  }

  private formatPrompt(messages: { role: string, content: string }[]) {
    // Qwen2.5 / ChatML format
    return messages.map(m => `<|im_start|>${m.role}\n${m.content}<|im_end|>`).join('\n') + '\n<|im_start|>assistant\n';
  }

  async release() {
    if (this.context) {
      await this.context.release();
      this.context = null;
    }
  }
}

export const mobileAI = new LlamaEngine();
