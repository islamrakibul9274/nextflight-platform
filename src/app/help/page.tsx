"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Send,
  HelpCircle,
  ShieldCheck,
  Luggage,
  Plane,
  Loader2,
  Bot,
  User,
} from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function HelpPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hello, and welcome to NextFlight. Ask me about cabin options, baggage, memberships, or how to manage your booking. Where are you thinking of going?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<AbortController | null>(null);
  const sendingRef = useRef(false);
  const retryRef = useRef<ChatMessage[]>([]);
  const [chatError, setChatError] = useState("");

  useEffect(() => {
    const area = messagesRef.current;
    if (!area) return;
    area.scrollTo({
      top: area.scrollHeight,
      behavior:
        messages.length > 1 &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "smooth"
          : "auto",
    });
  }, [messages, loading, chatError]);
  useEffect(() => () => requestRef.current?.abort(), []);

  const handleSend = async (textToSend?: string, retry = false) => {
    const text = (textToSend ?? input).trim();
    if ((!text && !retry) || sendingRef.current) return;
    sendingRef.current = true;
    const newMessages: ChatMessage[] = retry
      ? retryRef.current
      : [...messages, { role: "user", content: text }];
    retryRef.current = newMessages;
    setMessages(newMessages);
    if (!retry) setInput("");
    setLoading(true);
    setChatError("");
    const controller = new AbortController();
    requestRef.current = controller;
    try {
      const res = await fetch("/api/ai/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          messages: newMessages
            .slice(-20)
            .map((message) => ({
              role: message.role,
              content: message.content,
            })),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.reply)
        throw new Error(
          "The travel concierge is unavailable right now. Please try again in a moment.",
        );
      if (!controller.signal.aborted)
        setMessages((previous) => [
          ...previous,
          { role: "assistant", content: data.reply },
        ]);
    } catch {
      if (!controller.signal.aborted)
        setChatError(
          "We couldn't get a response. Check your connection or try again shortly.",
        );
    } finally {
      sendingRef.current = false;
      if (!controller.signal.aborted) setLoading(false);
    }
  };

  const quickPrompts = [
    "What is the baggage limit for JFK to London?",
    "How does the 100% refund cancellation policy work?",
    "What perks do I get with Gold Stratosphere membership?",
    "Which aircraft operates the SFO to Tokyo route?",
  ];

  return (
    <div className="min-h-screen bg-slate-50/70 pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> 24/7 AI Flight Concierge
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            A little help along the way.
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Questions about your next journey? Start a conversation about
            flights, baggage, seats, or your booking.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: AI Concierge Interactive Chat Console */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 shadow-2xs flex flex-col h-[min(700px,85dvh)] min-h-[500px] overflow-hidden">
            {/* Console Header */}
            <div className="p-4 sm:p-5 border-b border-sky-100 bg-sky-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-500 flex items-center justify-center text-white font-bold">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-wide">
                    NextFlight AI Travel Concierge
                  </h3>
                  <div className="flex items-center gap-1.5 text-[10px] text-sky-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Your AI travel assistant</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div
              ref={messagesRef}
              role="log"
              aria-label="Conversation with the travel concierge"
              aria-live="polite"
              className="min-h-0 flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/40"
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 ${
                    m.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      m.role === "user"
                        ? "bg-slate-900 text-white"
                        : "bg-sky-100 text-sky-700 border border-sky-200"
                    }`}
                  >
                    {m.role === "user" ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>

                  <div
                    className={`p-4 rounded-2xl text-sm leading-relaxed max-w-[85%] whitespace-pre-wrap break-words ${
                      m.role === "user"
                        ? "bg-slate-900 text-white rounded-tr-xs"
                        : "bg-white text-slate-800 border border-slate-200/90 shadow-2xs rounded-tl-xs"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-xs text-slate-400 animate-pulse p-2">
                  <Loader2 className="w-4 h-4 animate-spin text-sky-600" />
                  <span>NextFlight is preparing a response…</span>
                </div>
              )}
              {chatError && (
                <div
                  role="alert"
                  className="rounded-xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700"
                >
                  <p>{chatError}</p>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => handleSend(undefined, true)}
                    className="mt-2 font-semibold underline"
                  >
                    Try again
                  </button>
                </div>
              )}
            </div>

            {/* Quick Prompt Suggestions */}
            <div className="p-3 border-t border-slate-100 bg-white flex items-center gap-2 overflow-x-auto">
              <span className="text-[10px] font-bold text-slate-400 uppercase shrink-0">
                Ask:
              </span>
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={loading}
                  onClick={() => handleSend(prompt)}
                  className="px-3 py-1 bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-sky-700 rounded-lg text-xs border border-slate-200/80 whitespace-nowrap transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-4 bg-white border-t border-slate-100 flex items-center gap-2"
            >
              <input
                type="text"
                aria-label="Your message to the travel concierge"
                maxLength={2000}
                placeholder="Ask anything about flights, baggage, seats, refunds, or membership..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-w-0 flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:border-sky-500 outline-hidden transition-all"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="shrink-0 px-3 sm:px-5 py-3 bg-slate-900 hover:bg-sky-600 text-white rounded-xl font-bold text-xs shadow-xs transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Right Column: Knowledge Base Categories */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-4 shadow-2xs">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-sky-600" />
                Frequently Consulted Topics
              </h3>

              <div className="space-y-2.5 text-xs">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() =>
                    handleSend(
                      "What are the baggage size and weight allowances?",
                    )
                  }
                  className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-sky-50 cursor-pointer border border-slate-200/60 transition-colors"
                >
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Luggage className="w-3.5 h-3.5 text-sky-600" /> Baggage
                    Allowance Guide
                  </div>
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    Cabin dimensions, 23kg check-in rules, and excess baggage
                    pricing.
                  </div>
                </button>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() =>
                    handleSend("How do I request a cancellation and refund?")
                  }
                  className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-sky-50 cursor-pointer border border-slate-200/60 transition-colors"
                >
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />{" "}
                    Refunds & Cancellations
                  </div>
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    Self-service automated refund calculation for Flex and
                    Standard tickets.
                  </div>
                </button>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() =>
                    handleSend(
                      "Tell me about the Boeing 787 and Airbus A350 aircraft cabins.",
                    )
                  }
                  className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-sky-50 cursor-pointer border border-slate-200/60 transition-colors"
                >
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Plane className="w-3.5 h-3.5 text-indigo-600" /> Fleet
                    Specs & Lie-Flat Seats
                  </div>
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    Seat pitch, cabin layouts, in-flight WiFi, and OLED
                    entertainment.
                  </div>
                </button>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-sky-50 text-slate-900 space-y-3 shadow-sm border border-sky-100">
              <h4 className="text-sm font-semibold">
                Keep your booking close.
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Find your reservation, ticket details, and available
                cancellation options in My Trips.
              </p>
              <a href="/my-trips" className="text-link !text-xs">
                Go to My Trips →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
