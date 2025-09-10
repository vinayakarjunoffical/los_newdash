"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { FileText, X, Upload, Trash2, File } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useImageUpload } from "@/components/atoms/useImageUpload";

export function DocumentUpload({ docName, onUpload }) {
  const {
    previewUrl,
    fileName,
    fileInputRef,
    handleThumbnailClick,
    handleFileChange,
    handleRemove,
  } = useImageUpload({
    onUpload,
  });

  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const file = e.dataTransfer.files?.[0];
      if (file) {
        const fakeEvent = {
          target: {
            files: [file],
          },
        };
        handleFileChange(fakeEvent);
      }
    },
    [handleFileChange]
  );

  // ✅ Detect file type
  const isImage = fileName && fileName.match(/\.(jpg|jpeg|png|gif)$/i);
  const isPDF = fileName && fileName.match(/\.pdf$/i);

  return (
    <div className="w-full space-y-2">
      <p className="text-sm font-medium">Upload {docName}</p>

      {/* Hidden input: allow images + docs + pdf */}
      <input
        type="file"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.gif"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {!previewUrl ? (
        <div
          onClick={handleThumbnailClick}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "flex h-32 cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:bg-muted",
            isDragging && "border-primary/50 bg-primary/5"
          )}
        >
          <FileText className="h-6 w-6 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">
            Click or drag & drop document
          </p>
        </div>
      ) : (
        <div className="relative">
          {/* ✅ If image → show thumbnail */}
          {isImage ? (
            <div className="group relative h-32 overflow-hidden rounded-lg border">
              <Image
                src={previewUrl}
                alt="Preview"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 transition-opacity group-hover:opacity-100 bg-black/30">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleThumbnailClick}
                  className="h-8 w-8 p-0"
                >
                  <Upload className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleRemove}
                  className="h-8 w-8 p-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex h-20 items-center justify-between rounded-lg border px-3 bg-muted/30">
              <div className="flex gap-2">
                {isPDF ? (
                <FileText className="h-5 w-5 text-red-500" />
              ) : (
                <File className="h-5 w-5 text-muted-foreground" />
              )}
              <span className="text-sm truncate">{fileName}</span>
              </div>
              <button
                onClick={handleRemove}
                className="ml-2 rounded-full p-1 hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
