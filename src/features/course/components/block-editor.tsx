"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ApiError, type ApiErrorBody } from "@/lib/api/client";

import { BLOCK_STEP, STEP_TITLES } from "../lesson-steps";
import type { LessonBlock, LessonBlockKind } from "../types";

const KIND_LABELS: Record<LessonBlockKind, string> = {
  note: "Giải thích",
  example: "Câu mẫu",
  dialogue: "Hội thoại",
};

/** Khối rỗng của từng dạng. Trường thừa phải là chuỗi rỗng, không phải undefined. */
function emptyBlock(kind: LessonBlockKind): LessonBlock {
  return { kind, body: "", text_en: "", text_vi: "", speaker: "" };
}

/**
 * Soạn nội dung bài. Gửi cả danh sách trong một lần lưu, đúng như API nhận —
 * không có trạng thái "đã sửa khối 2, chưa sửa khối 3" nào tồn tại giữa chừng.
 */
export function BlockEditor({
  lessonId,
  initialBlocks,
}: {
  lessonId: string;
  initialBlocks: LessonBlock[];
}) {
  const [blocks, setBlocks] = useState(initialBlocks);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function update(index: number, patch: Partial<LessonBlock>) {
    setSaved(false);
    setBlocks((current) =>
      current.map((block, i) => (i === index ? { ...block, ...patch } : block)),
    );
  }

  function move(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= blocks.length) {
      return;
    }
    setSaved(false);
    setBlocks((current) => {
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  async function save() {
    setSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/lessons/${lessonId}/blocks`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        // id chỉ có khi đọc; API thay cả danh sách nên nó bị bỏ qua.
        body: JSON.stringify({
          blocks: blocks.map(({ kind, body, text_en, text_vi, speaker }) => ({
            kind,
            body,
            text_en,
            text_vi,
            speaker,
          })),
        }),
      });

      if (!response.ok) {
        const parsed = (await response.json().catch(() => null)) as ApiErrorBody | null;
        throw new ApiError(response.status, parsed ?? undefined);
      }
      setSaved(true);
    } catch (cause) {
      // details của API chỉ tên đúng khối sai, ví dụ blocks[2].speaker.
      const detail =
        cause instanceof ApiError ? Object.entries(cause.details)[0] : undefined;
      setError(
        detail
          ? `${detail[0]}: ${detail[1]}`
          : cause instanceof Error
            ? cause.message
            : "Không lưu được.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {blocks.map((block, index) => (
        <div
          key={index}
          className="border-border bg-card rounded-card flex flex-col gap-3 border p-4"
        >
          <div className="flex items-center gap-2">
            <select
              value={block.kind}
              onChange={(event) =>
                // Đổi dạng thì dựng lại khối rỗng: giữ lại trường của dạng cũ
                // sẽ vi phạm ràng buộc hình dạng ở server.
                update(index, emptyBlock(event.target.value as LessonBlockKind))
              }
              aria-label={`Dạng khối ${index + 1}`}
              className="border-input h-8 rounded-lg border bg-transparent px-2 text-sm"
            >
              {Object.entries(KIND_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>

            <span className="text-muted-foreground flex-1 text-xs">
              #{index + 1} · hiện ở bước {STEP_TITLES[BLOCK_STEP[block.kind]]}
            </span>

            <IconButton label="Lên" onClick={() => move(index, -1)} disabled={index === 0}>
              <ArrowUp className="size-4" />
            </IconButton>
            <IconButton
              label="Xuống"
              onClick={() => move(index, 1)}
              disabled={index === blocks.length - 1}
            >
              <ArrowDown className="size-4" />
            </IconButton>
            <IconButton
              label="Xoá"
              onClick={() => {
                setSaved(false);
                setBlocks((current) => current.filter((_, i) => i !== index));
              }}
            >
              <Trash2 className="size-4" />
            </IconButton>
          </div>

          {block.kind === "note" ? (
            <Textarea
              value={block.body}
              onChange={(event) => update(index, { body: event.target.value })}
              placeholder="Đoạn giải thích bằng tiếng Việt"
              aria-label={`Nội dung khối ${index + 1}`}
              rows={3}
            />
          ) : (
            <div className="flex flex-col gap-2">
              {block.kind === "dialogue" ? (
                <Input
                  value={block.speaker}
                  onChange={(event) => update(index, { speaker: event.target.value })}
                  placeholder="Tên người nói"
                  aria-label={`Người nói khối ${index + 1}`}
                />
              ) : null}
              <Input
                value={block.text_en}
                onChange={(event) => update(index, { text_en: event.target.value })}
                placeholder="Câu tiếng Anh"
                aria-label={`Câu tiếng Anh khối ${index + 1}`}
              />
              <Input
                value={block.text_vi}
                onChange={(event) => update(index, { text_vi: event.target.value })}
                placeholder="Bản dịch tiếng Việt"
                aria-label={`Bản dịch khối ${index + 1}`}
              />
            </div>
          )}
        </div>
      ))}

      <div className="flex flex-wrap gap-2">
        {(Object.keys(KIND_LABELS) as LessonBlockKind[]).map((kind) => (
          <Button
            key={kind}
            variant="outline"
            size="sm"
            onClick={() => {
              setSaved(false);
              setBlocks((current) => [...current, emptyBlock(kind)]);
            }}
          >
            <Plus className="size-4" />
            {KIND_LABELS[kind]}
          </Button>
        ))}
      </div>

      {error ? (
        <p className="bg-danger-soft text-danger rounded-xl px-4 py-3 text-sm">
          {error}
        </p>
      ) : null}

      <div className="flex items-center gap-3">
        <Button onClick={() => void save()} disabled={saving}>
          {saving ? "Đang lưu…" : "Lưu nội dung"}
        </Button>
        {saved ? (
          <span className="text-success text-sm font-medium">Đã lưu</span>
        ) : null}
        {blocks.length === 0 ? (
          <span className="text-muted-foreground text-sm">
            Lưu danh sách rỗng sẽ xoá hết nội dung bài.
          </span>
        ) : null}
      </div>
    </div>
  );
}

function IconButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="border-border text-muted-foreground hover:text-foreground grid size-8 place-items-center rounded-lg border transition-colors disabled:opacity-40"
    >
      {children}
    </button>
  );
}
