'use client'

import { Check, Copy, CopyCheck } from "lucide-react";
import { useState } from "react";

// Code block component with copy functionality
export default function CodeBlock({ children, className }: any) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = children?.props?.children || "";
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group mb-6">
      <button
        onClick={handleCopy}
        className="absolute right-3 top-3 p-2 bg-gray-700 hover:bg-gray-600 rounded text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        title="Copy code"
      >
        {copied ? (
          <Check size={18} className="text-green-400" />
        ) : (
          <Copy size={18} />
        )}
      </button>
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
        {children}
      </pre>
    </div>
  );
}