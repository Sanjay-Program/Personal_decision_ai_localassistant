import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Brain, TrendingDown, Target, Bell, ArrowRight, ShieldCheck, Zap } from 'lucide-react-native';

const BACKEND_URL = "http://localhost:8000"; // Adjust for physical device testing

export default function IntelDashboard({ navigation }: { navigation: any }) {
    const [briefing, setBriefing] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${BACKEND_URL}/curator/briefing`)
            .then(res => res.json())
            .then(data => {
                setBriefing(data.briefing);
                setLoading(false);
            })
            .catch(err => {
                console.error("Dashboard Sync Failed:", err);
                setLoading(false);
            });
    }, []);

    return (
        <SafeAreaView className="flex-1 bg-[#000000] px-6">
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="py-8 flex-row justify-between items-center">
                    <View>
                        <Text className="text-white/40 text-[10px] uppercase font-bold tracking-[4px]">PERSONAL CORE</Text>
                        <Text className="text-white text-3xl font-bold mt-1">Intelligence</Text>
                    </View>
                    <View className="w-12 h-12 rounded-full border border-white/10 items-center justify-center">
                        <Zap size={20} className="text-cyan-400" />
                    </View>
                </View>

                {/* The Daily Briefing (Nothing Dot Style) */}
                <View className="bg-white/5 border border-white/10 rounded-[32px] p-6 mb-8">
                    <View className="flex-row items-center space-x-2 mb-4">
                        <Brain size={16} className="text-cyan-400" />
                        <Text className="text-cyan-400 text-[10px] font-bold uppercase tracking-widest">DR. CURATOR BRIEFING</Text>
                    </View>
                    
                    {loading ? (
                        <ActivityIndicator color="#22d3ee" className="py-4" />
                    ) : (
                        <Text className="text-white text-lg leading-relaxed font-medium">
                            {briefing || "Synthesizing your digital signals... Initializing local reasoning engine."}
                        </Text>
                    )}
                    
                    <View className="mt-6 h-[1px] bg-white/5 w-full" />
                    <TouchableOpacity className="mt-4 flex-row items-center justify-between">
                        <Text className="text-white/40 text-xs font-bold uppercase italic">SECURE-LOCAL-ONLY-ENCLAVE</Text>
                        <ShieldCheck size={14} className="text-white/20" />
                    </TouchableOpacity>
                </View>

                {/* Tactical Cards */}
                <View className="flex-row justify-between mb-8">
                    {/* Finance Card */}
                    <View className="w-[48%] bg-white/5 border border-white/10 rounded-[24px] p-5">
                        <TrendingDown size={20} className="text-red-400 mb-2" />
                        <Text className="text-white font-bold text-lg">-$1,240</Text>
                        <Text className="text-white/40 text-[10px] mt-1 uppercase font-bold tracking-widest">FINANCE / ALERT</Text>
                    </View>
                    
                    {/* Fitness Card */}
                    <View className="w-[48%] bg-white/5 border border-white/10 rounded-[24px] p-5">
                        <Target size={20} className="text-emerald-400 mb-2" />
                        <Text className="text-white font-bold text-lg">8,421</Text>
                        <Text className="text-white/40 text-[10px] mt-1 uppercase font-bold tracking-widest">FITNESS / STEPS</Text>
                    </View>
                </View>

                {/* Notification Feed Snippets */}
                <View className="mb-12">
                     <Text className="text-white/40 text-[10px] uppercase font-bold tracking-[4px] mb-6">LIVE SIGNAL STREAM</Text>
                     
                     {[
                         { icon: Bell, title: "Flight Booking", source: "MAIL", time: "2h ago" },
                         { icon: Bell, title: "Family Discussion", source: "WHATSAPP", time: "4h ago" },
                         { icon: Bell, title: "Security Alert", source: "SMS", time: "8h ago" }
                     ].map((item, idx) => (
                         <View key={idx} className="flex-row items-center justify-between mb-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                             <View className="flex-row items-center space-x-4">
                                 <View className="w-10 h-10 rounded-full bg-white/5 items-center justify-center">
                                     <item.icon size={16} className="text-white/60" />
                                 </View>
                                 <View>
                                     <Text className="text-white text-sm font-medium">{item.title}</Text>
                                     <Text className="text-white/30 text-[9px] uppercase font-bold tracking-widest mt-0.5">{item.source}</Text>
                                 </View>
                             </View>
                             <Text className="text-white/20 text-[9px] font-bold italic">{item.time}</Text>
                         </View>
                     ))}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}
