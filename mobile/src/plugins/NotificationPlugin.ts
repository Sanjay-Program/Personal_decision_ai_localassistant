import { NativeModules, NativeEventEmitter } from 'react-native';
import { securityManager } from '../core/SecurityManager';

/**
 * Mobile 'Live' Plugin: Notification Listener
 * This replaces the Desktop Playwright (WhatsApp) and ADB (SMS) plugins.
 * It listens to system notifications and ingests them into AI memory.
 */
const { NotificationListener } = NativeModules;
const notificationEmitter = new NativeEventEmitter(NotificationListener);

export class NotificationPlugin {
  static start() {
    console.log("Starting Mobile Notification Listener...");
    
    notificationEmitter.addListener('onNotificationReceived', async (event) => {
      const { app, title, text } = event;

      // Filter for relevant apps (WhatsApp, SMS)
      if (app === 'com.whatsapp' || app.includes('sms') || app.includes('messaging')) {
        console.log(`Live Ingest from ${app}: ${title} - ${text}`);

        // 1. Encrypt the data immediately
        const encrypted = await securityManager.encrypt(`${title}: ${text}`);

        // 2. Add to Local AI Memory
        // TODO: Call Vector Memory store
        console.log(`Ingested to secure mobile memory: ${encrypted}`);
      }
    });

    NotificationListener.requestPermission();
  }
}
