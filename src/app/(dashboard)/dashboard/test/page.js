"use client";
import { useState } from "react";

export default function Page() {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    const res = await fetch("/api/generate-url", { method: "POST" });
    const data = await res.json();
    setLoading(false);

    if (data.finalUrl) {
      window.open(data.finalUrl, "_blank"); // opens in new tab
    } else {
      alert("Error: " + data.error);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="px-4 py-2 bg-purple-600 text-white rounded-lg"
    >
      {loading ? "Loading..." : "Open SDK"}
    </button>
  );
}
