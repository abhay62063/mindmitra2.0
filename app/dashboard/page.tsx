"use client";

import Link from "next/link";
import { BookOpen, Target, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/landing/navigation";

// Mock Data
const studentData = {
    name: "Nag Shakti",
    course: "B.Tech Computer Science",
    overallProgress: 68,
    topicsCovered: 12,
    totalTopics: 20,
    quizAccuracy: 85,
    nextLesson: "Dynamic Programming (DP) basics",
};

export default function DashboardPage() {
    return (
        <main className="relative min-h-screen flex flex-col bg-slate-50 overflow-hidden pt-24">
            <Navigation />

            {/* Content Container */}
            <div className="relative flex-1 flex flex-col z-10 px-6 py-12 lg:px-12 max-w-[1200px] mx-auto w-full">

                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 tracking-tight mb-2">
                            Welcome back, <span className="text-blue-600">{studentData.name}</span>
                        </h1>
                        <p className="text-slate-600 text-lg">
                            Here is your learning progress for {studentData.course}.
                        </p>
                    </div>
                    <Link href="/chat">
                        <Button className="bg-white hover:bg-slate-50 text-blue-600 border border-slate-200 rounded-full px-6 h-12 shadow-sm transition-all group">
                            Chat with Mitra
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </header>

                {/* Progress Bar Section */}
                <div className="mb-16 bg-white border border-slate-200 p-8 rounded-3xl shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-display font-medium text-slate-900">Overall Progress</h2>
                        <span className="text-2xl font-bold text-blue-600">{studentData.overallProgress}%</span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                        <div
                            className="h-full bg-blue-600 rounded-full"
                            style={{ width: `${studentData.overallProgress}%` }}
                        />
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

                    {/* Card 1: Topics Covered */}
                    <div className="bg-white border border-slate-200 p-8 rounded-3xl flex flex-col gap-4 relative overflow-hidden group hover:border-blue-300 transition-colors shadow-sm">
                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100 text-blue-600">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-slate-500 font-medium mb-1">Topics Covered</h3>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-display font-bold text-slate-900">{studentData.topicsCovered}</span>
                                <span className="text-slate-400">/ {studentData.totalTopics}</span>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Quiz Accuracy */}
                    <div className="bg-white border border-slate-200 p-8 rounded-3xl flex flex-col gap-4 relative overflow-hidden group hover:border-blue-300 transition-colors shadow-sm">
                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100 text-blue-600">
                            <Target className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-slate-500 font-medium mb-1">Quiz Accuracy</h3>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-display font-bold text-slate-900">{studentData.quizAccuracy}%</span>
                                <span className="text-emerald-600 text-sm ml-2 font-medium">↑ 5%</span>
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Next Recommended Lesson */}
                    <div className="bg-blue-50 border border-blue-200 p-8 rounded-3xl flex flex-col gap-4 relative overflow-hidden group shadow-sm hover:border-blue-400 transition-colors cursor-pointer" onClick={() => window.location.href = '/chat'}>
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200 text-blue-600">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-blue-900 font-medium mb-2">Next Recommended Lesson</h3>
                            <p className="text-xl font-display font-bold text-blue-950 mb-4 line-clamp-2">
                                {studentData.nextLesson}
                            </p>
                            <div className="inline-flex items-center text-sm font-medium text-blue-700 hover:text-blue-800">
                                Start learning <ArrowRight className="w-4 h-4 ml-1" />
                            </div>
                        </div>
                    </div>

                </div>

            </div>

            {/* Clean Footer */}
            <footer className="w-full py-6 mt-auto border-t border-slate-200">
                <p className="text-center font-mono text-sm text-slate-500">
                    Created by Nag Shakti
                </p>
            </footer>
        </main>
    );
}
