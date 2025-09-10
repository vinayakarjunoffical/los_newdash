"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { CheckCircle2, Circle } from "lucide-react"

function ActiveRadio({ className }) {
  const [active, setActive] = useState(false)

  return (
    <button
      onClick={() => setActive(!active)}
      className={cn(
        "flex items-center gap-2 px-6 py-2 rounded-full border font-medium transition-all duration-300",
        active
          ? "bg-green-600 text-white border-green-700"
          : "bg-gray-200 text-gray-700 border-gray-300",
        className
      )}
    >
      {active ? (
        <>
          <CheckCircle2 className="w-5 h-5" />
          <span>Active</span>
        </>
      ) : (
        <>
          <Circle className="w-5 h-5" />
          <span>Inactive</span>
        </>
      )}
    </button>
  )
}

export default ActiveRadio
