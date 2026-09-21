"use client";

import { Volume2 } from "lucide-react";

/**
 * Phát âm bằng speechSynthesis có sẵn của trình duyệt — không cần file âm thanh
 * hay dịch vụ ngoài nào. Máy không hỗ trợ thì nút đơn giản là không làm gì.
 */
export function PronounceButton({ word }: { word: string }) {
  function speak() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  return (
    <button
      type="button"
      onClick={speak}
      aria-label={`Phát âm "${word}"`}
      className="bg-secondary hover:bg-brand grid size-10 flex-none place-items-center rounded-full transition-colors hover:text-white"
    >
      <Volume2 className="size-4" />
    </button>
  );
}
