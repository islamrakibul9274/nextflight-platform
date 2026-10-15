"use client";

import Image from "next/image";
import { useState } from "react";

export function ImageWithFallback({
  src,
  alt,
  className,
  ...props
}: {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-slate-800 to-sky-900 text-white ${className || ""}`}
        role="img"
        aria-label={alt}
      >
        <span className="text-xs font-bold px-4 text-center">{alt}</span>
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
      {...props}
    />
  );
}
