# llama.rn native rules
-keep class com.rnllama.** { *; }
-keep class com.facebook.react.bridge.** { *; }

# Prevent shrinking of AI native methods
-keepclasseswithmembernames class * {
    native <methods>;
}
