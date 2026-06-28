"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { uploadEventCoverAction } from "@/lib/events/event.actions";

interface CoverImageUploaderProps {
  value: string | undefined;
  onChange: (url: string | undefined) => void;
}

export function CoverImageUploader({
  value,
  onChange,
}: CoverImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("파일 크기는 5MB 이하여야 합니다");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);
    const result = await uploadEventCoverAction(formData);
    setIsUploading(false);

    if (result.error) {
      toast.error(result.error);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    onChange(result.data?.url);
  }

  function handleRemove() {
    onChange(undefined);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="flex flex-col gap-2">
      {value ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border">
          <Image
            src={value}
            alt="커버 이미지 미리보기"
            fill
            className="object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-7 w-7"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="flex aspect-video w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-border transition-colors hover:border-primary/50 hover:bg-accent/30 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isUploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          ) : (
            <>
              <ImagePlus className="h-8 w-8 text-muted-foreground" />
              <span className="mt-2 text-sm text-muted-foreground">
                클릭하여 커버 이미지 업로드
              </span>
              <span className="text-xs text-muted-foreground/70">
                JPG, PNG, WebP, GIF · 최대 5MB
              </span>
            </>
          )}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
