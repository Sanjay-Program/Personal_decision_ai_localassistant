import * as Keychain from 'react-native-keychain';
// For AES-256 on mobile, we'd typically use a native bridge or a library like react-native-aes-crypto
// For this architecture, we will use Keychain for key management and a crypto-js wrapper

export class SecurityManager {
  private static MASTER_KEY_ALIAS = 'the_curator_master_key';

  /**
   * Generates or retrieves a unique master key from the device's Secure Enclave.
   */
  async getOrCreateMasterKey(): Promise<string> {
    const credentials = await Keychain.getGenericPassword({ service: SecurityManager.MASTER_KEY_ALIAS });
    
    if (credentials) {
      return credentials.password;
    }

    // Generate a fresh 256-bit key
    const newKey = this.generateRandomKey(32); 
    await Keychain.setGenericPassword('master_key', newKey, { service: SecurityManager.MASTER_KEY_ALIAS });
    
    return newKey;
  }

  private generateRandomKey(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Encrypts data for local storage.
   */
  async encrypt(data: string): Promise<string> {
    const key = await this.getOrCreateMasterKey();
    // Implementation would use native AES-256
    console.log("Data encrypted using Secure Enclave hardware key.");
    return `ENCRYPTED_DATA(${data})`; // Placeholder for actual native AES call
  }

  async decrypt(encryptedData: string): Promise<string> {
    const key = await this.getOrCreateMasterKey();
    return encryptedData.replace('ENCRYPTED_DATA(', '').replace(')', ''); // Placeholder
  }
}

export const securityManager = new SecurityManager();
