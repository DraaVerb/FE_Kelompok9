"use client";

import { useState } from "react";

export default function MenuImage({ src, alt }) {
  const value = typeof src === "string" ? src.trim() : "";
  const imageSrc = !value ? "" : /^(https?:\/\/|\/)/i.test(value)
    ? value
    : value.startsWith("assets/") ? `/${value}` : `/assets/${value}`;

  return <ImageWithFallback key={imageSrc} src={imageSrc} alt={alt} />;
}

function ImageWithFallback({ src, alt }) {
  const [failedSrc, setFailedSrc] = useState("");
  // Foto sementara jika foto Gudeg Original belum tersedia.
  const temporarySrc = src === "/assets/gudeg.jpg" ? "/assets/gudeg-kering.jpg" : "";
  const displaySrc = failedSrc === src && temporarySrc ? temporarySrc : src;

  if (!src || (failedSrc && (failedSrc === temporarySrc || !temporarySrc))) {
    return <div className="placeholder" role="img" aria-label={`Foto ${alt || "menu"} belum tersedia`}>🍲</div>;
  }

  return <img src={displaySrc} alt={displaySrc === temporarySrc ? `${alt} (foto ilustrasi sementara)` : alt} onError={() => setFailedSrc(displaySrc)} />;
}