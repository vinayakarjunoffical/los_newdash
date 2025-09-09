"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";

export function ExcelUploadPopup({ docName = "Upload Excel", onUpload }) {
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && (file.name.endsWith(".xlsx") || file.name.endsWith(".xls"))) {
      setFileName(file.name);
      if (onUpload) onUpload(file); // Pass file to parent
    } else {
      alert("Please upload only Excel files (.xlsx, .xls)");
    }
  };

  const handleRemove = () => {
    setFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept=".xlsx,.xls"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {!fileName ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex h-32 cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 hover:bg-muted transition-colors"
        >
          <Upload className="h-6 w-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Click or drag & drop Excel file</p>
        </div>
      ) : (
        <div className="flex items-center justify-between rounded-md border p-3 bg-muted">
          <span className="text-sm font-medium truncate">{fileName}</span>
          <button
            onClick={handleRemove}
            className="ml-2 rounded-full p-1 hover:bg-red-100 dark:hover:bg-red-800"
          >
            <X className="h-4 w-4 text-red-500" />
          </button>
        </div>
      )}
    </div>
  );
}
