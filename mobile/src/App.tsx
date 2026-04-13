import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { Brain, Send, ShieldCheck, Cpu, Smartphone, Mail, MessageCircle, Mic } from 'lucide-react-native';
import { mobileAI } from './core/LlamaEngine';
import { NotificationPlugin } from './plugins/NotificationPlugin';
import { voicePlugin } from './plugins/VoicePlugin';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import IntelDashboard from './screens/IntelDashboard';

const Tab = createBottomTabNavigator();

function ChatScreen() {
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState([
    { role: "system", content: "Welcome Professor. 'The Curator Mobile' is active. All processing is on-device." }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const toggleVoice = () => {
    if (isListening) {
      voicePlugin.stopListening();
      setIsListening(false);
    } else {
      voicePlugin.startListening((text) => {
        setInput(text);
        setIsListening(false);
        handleSend(text);
      });
      setIsListening(true);
    }
  };

  const handleSend = async (overrideInput?: string) => {
    const textToSend = overrideInput || input;
    if (!textToSend.trim()) return;

    const newMessages = [...messages, { role: "user", content: textToSend }];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    try {
      const response = await mobileAI.chat(newMessages);
      setMessages(prev => [...prev, { role: "assistant", content: response.text }]);
      voicePlugin.speak(response.text);
    } catch (error) {
      setMessages(prev => [...prev, { role: "system", content: "Local AI Error. Check RAM." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0e0e0f]">
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View className="px-6 py-4 flex-row justify-between items-center border-b border-white/5">
        <View className="flex-row items-center space-x-3">
          <Brain className="text-cyan-400" size={24} />
          <Text className="text-xl font-bold text-white tracking-tight">The Curator</Text>
        </View>
        <View className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full flex-row items-center space-x-1">
          <ShieldCheck size={12} className="text-emerald-500" />
          <Text className="text-[10px] font-bold text-emerald-500 text-uppercase tracking-widest">LOCAL-ONLY</Text>
        </View>
      </View>

      {/* Chat Area */}
      <ScrollView className="flex-1 px-4 pt-6">
        {messages.map((msg, i) => (
          <View key={i} className={`mb-6 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <Text className="text-[10px] text-white/40 font-bold mb-1 uppercase tracking-widest">
              {msg.role === 'user' ? 'PROFESSOR' : 'THE CURATOR'}
            </Text>
            <View className={`p-4 rounded-2xl max-w-[85%] border ${
              msg.role === 'user' 
              ? 'bg-white/5 border-white/10' 
              : 'bg-cyan-950/20 border-cyan-400/20 shadow-lg shadow-cyan-400/10'
            }`}>
              <Text className="text-white text-sm leading-relaxed">{msg.content}</Text>
            </View>
          </View>
        ))}
        {isTyping && (
           <Text className="text-[10px] text-cyan-400/50 animate-pulse font-bold px-2">CURATOR IS SYNTHESIZING...</Text>
        )}
      </ScrollView>

      {/* Footer / Input */}
      <View className="p-4 border-t border-white/5 space-y-4">
        {/* Active Plugins Pulse Indicators */}
        <View className="flex-row justify-center space-x-6 pb-2">
            <View className="items-center space-y-1">
                <View className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-md shadow-cyan-400 animate-pulse" />
                <Smartphone className="text-white/30" size={14} />
            </View>
            <View className="items-center space-y-1">
                <View className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-md shadow-purple-400 animate-pulse" />
                <Mail className="text-white/30" size={14} />
            </View>
            <View className="items-center space-y-1">
                <View className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-md shadow-emerald-400 animate-pulse" />
                <MessageCircle className="text-white/30" size={14} />
            </View>
        </View>

        <View className="bg-[#1a191b] rounded-2xl p-2 border border-white/10 flex-row items-center">
          <TextInput 
            className="flex-1 text-white px-4 h-12 text-sm"
            placeholder="Talk to your local core..."
            placeholderTextColor="rgba(255,255,255,0.2)"
            value={input}
            onChangeText={setInput}
          />
          <TouchableOpacity 
            onPress={toggleVoice}
            className={`w-10 h-10 items-center justify-center mr-2 rounded-full ${isListening ? 'bg-red-500/20' : ''}`}
          >
            <Mic size={20} className={isListening ? 'text-red-500' : 'text-white/40'} />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => handleSend()}
            disabled={isTyping}
            className="bg-cyan-400 w-12 h-12 rounded-xl items-center justify-center"
          >
            <Send color="#000" size={20} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  useEffect(() => {
    NotificationPlugin.start();
    mobileAI.initialize().catch(err => console.error(err));
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#000',
            borderTopWidth: 0,
            paddingBottom: 20,
            height: 80,
            elevation: 0
          },
          tabBarActiveTintColor: '#22d3ee',
          tabBarInactiveTintColor: '#444'
        }}
      >
        <Tab.Screen 
            name="Intelligence" 
            component={IntelDashboard} 
            options={{ tabBarIcon: ({ color }) => <ShieldCheck color={color} size={24} /> }}
        />
        <Tab.Screen 
            name="Curator" 
            component={ChatScreen} 
            options={{ tabBarIcon: ({ color }) => <Brain color={color} size={24} /> }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
