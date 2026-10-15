"use client";

import React from "react";

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallbackTitle?: string },
  { hasError: boolean; message: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: "" };
  }
  static getDerivedStateFromError(err: Error) {
    return { hasError: true, message: err.message };
  }
  componentDidCatch(err: Error) {
    console.error("UI error boundary:", err);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center" role="alert">
          <h2 className="text-lg font-bold text-slate-900">
            {this.props.fallbackTitle || "Something went wrong"}
          </h2>
          <p className="text-xs text-slate-500 mt-2">
            {process.env.NODE_ENV === "production"
              ? "Try refreshing the page. If the problem continues, contact support."
              : this.state.message}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, message: "" })}
            className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
