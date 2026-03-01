"use client";

import { User, Settings, Heart, Bell, ChevronRight, LogOut } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
    return (
        <div className="p-6 space-y-8 pb-32">
            <header>
                <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
            </header>

            {/* User Info */}
            <div className="flex items-center gap-4 p-4 bg-card rounded-2xl border border-border">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
                    <User className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                    <h2 className="font-semibold text-lg">Amit Finkel</h2>
                    <p className="text-sm text-muted-foreground">Goal: Maintain Weight</p>
                </div>
            </div>

            {/* Settings List */}
            <div className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground ml-1 uppercase tracking-wider">Settings</h3>

                <div className="bg-card rounded-2xl overflow-hidden border border-border">
                    {[
                        { icon: Heart, label: "Health Details" },
                        { icon: Bell, label: "Notifications" },
                        { icon: Settings, label: "Preferences" },
                    ].map((item, i) => (
                        <div key={item.label} className="flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors cursor-pointer border-b border-border/50 last:border-0">
                            <div className="flex items-center gap-3">
                                <item.icon className="w-5 h-5 text-foreground" />
                                <span className="font-medium">{item.label}</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                    ))}
                </div>
            </div>

            <button className="w-full p-4 rounded-xl flex items-center justify-center gap-2 text-destructive font-medium hover:bg-destructive/10 transition-colors">
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
            </button>
        </div>
    );
}
