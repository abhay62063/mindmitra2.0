"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Send, Bot, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function MindMitraChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Namaste! Main MindMitraAI hoon. Aapki padhai mein kaise help kar sakta hoon? 😊",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Web Speech API setup
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = false;
      recog.lang = "en-IN"; // Good for Hinglish

      recog.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => prev + (prev ? " " : "") + transcript);
        setIsListening(false);
      };

      recog.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recog.onend = () => {
        setIsListening(false);
      };

      setRecognition(recog);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const toggleListening = () => {
    if (isListening) {
      recognition?.stop();
      setIsListening(false);
    } else {
      recognition?.start();
      setIsListening(true);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      setMessages((prev) => [...prev, data]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Oops! Kuch galat ho gaya. Please try again later." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-12 p-4 md:p-6 rounded-3xl bg-white border border-slate-200 shadow-xl relative overflow-hidden group">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 relative z-10 border-b border-slate-100 pb-4">
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200 shadow-sm">
          <Bot className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-display font-bold text-slate-900 tracking-wide flex items-center gap-2">
            MindMitraAI <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </h2>
          <p className="text-sm text-slate-500 font-mono">Your Personal Hinglish Tutor</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex flex-col gap-4 h-[400px] md:h-[500px] overflow-y-auto mb-6 pr-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent relative z-10">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                msg.role === "user"
                  ? "bg-slate-100 border-slate-200 text-slate-600"
                  : "bg-blue-50 border-blue-100 text-blue-600"
              }`}
            >
              {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div
              className={`max-w-[80%] rounded-2xl px-5 py-3 border shadow-sm ${
                msg.role === "user"
                  ? "bg-slate-50 text-slate-800 border-slate-200 rounded-tr-sm"
                  : "bg-white text-slate-800 border-blue-100 shadow-[0_4px_20px_rgba(37,99,235,0.05)] rounded-tl-sm"
              }`}
            >
              <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-blue-100 rounded-2xl rounded-tl-sm px-5 py-4 flex items-center gap-2 shadow-[0_4px_20px_rgba(37,99,235,0.05)]">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="relative z-10 flex items-end gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100 transition-all duration-300">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Ask me anything in Hinglish..."
          className="flex-1 bg-transparent border-none outline-none text-slate-800 placeholder:text-slate-400 resize-none max-h-32 min-h-[44px] py-3 px-4 text-[15px] scrollbar-thin scrollbar-thumb-slate-200"
          rows={1}
          style={{ height: "auto" }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = "auto";
            target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
          }}
        />
        
        <div className="flex items-center gap-2 pb-1 pr-1">
          {recognition && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleListening}
              className={`rounded-full transition-all duration-300 ${
                isListening
                  ? "bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600"
                  : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              }`}
              title="Voice input"
            >
              {isListening ? <Mic className="w-5 h-5 animate-pulse" /> : <MicOff className="w-5 h-5" />}
            </Button>
          )}
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all duration-300 w-11 h-11 p-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {isTyping ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 ml-1" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
