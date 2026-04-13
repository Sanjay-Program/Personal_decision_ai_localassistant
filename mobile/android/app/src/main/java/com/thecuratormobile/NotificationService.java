package com.thecuratormobile;

import android.service.notification.NotificationListenerService;
import android.service.notification.StatusBarNotification;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class NotificationService extends NotificationListenerService {
    private static final String TAG = "CuratorNotification";

    @Override
    public void onNotificationPosted(StatusBarNotification sbn) {
        String packageName = sbn.getPackageName();
        Bundle extras = sbn.getNotification().extras;
        String title = extras.getString("android.title");
        String text = extras.getCharSequence("android.text") != null ? 
                     extras.getCharSequence("android.text").toString() : "";

        Log.d(TAG, "Notification from: " + packageName + " - " + text);

        // Emit to React Native
        WritableMap params = Arguments.createMap();
        params.putString("app", packageName);
        params.putString("title", title);
        params.putString("text", text);

        try {
            MainApplication application = (MainApplication) getApplication();
            application.getReactNativeHost().getReactInstanceManager()
                    .getCurrentReactContext()
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("onNotificationReceived", params);
        } catch (Exception e) {
            Log.e(TAG, "Failed to emit notification to JS", e);
        }
    }
}
