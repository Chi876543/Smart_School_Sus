"use client";
import React from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error";
}

export default function Toast({ message, type = "success" }: ToastProps) {
  return (
    <div
      className={`fixed top-4 right-4 z-50 animate-slide-in px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 text-white z-[10000]
        ${type === "success" ? "bg-green-500" : "bg-red-500"}`}
    >
      <span className="text-xl">
        {type === "success" ? "✔️" : "❌"}
      </span>
      <span>{message}</span>
    </div>
  );
}
