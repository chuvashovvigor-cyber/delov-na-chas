'use client';

import { useRef, useState } from 'react';

type Preview = { file: File; url: string; type: 'image'|'video' };

export default function MediaPicker() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<Preview[]>([]);

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const fl = Array.from(e.target.files ?? [])
      .slice(0, 10); // ограничим до 10
    const next = fl.map(f => ({
      file: f,
      url: URL.createObjectURL(f),
      type: f.type.startsWith('image/') ? 'image' : 'video' as const
    }));
    setFiles(prev => [...prev, ...next]);
  }

  function removeAt(i: number) {
    setFiles(prev => {
      const copy = [...prev];
      URL.revokeObjectURL(copy[i].url);
      copy.splice(i, 1);
      return copy;
    });
    // сбрасываем input, чтобы можно было прикрепить тот же файл заново
    if (inputRef.current) inputRef.current.value = '';
  }

  return (
    <div className="grid gap-2">
      {/* реальный input — скрыт, но ИМЕННО он уйдёт на /api/order */}
      <input
        ref={inputRef}
        id="media"
        name="media"
        type="file"
        multiple
        accept="image/*,video/*"
        className="hidden"
        onChange={onPick}
      />

      <label
        htmlFor="media"
        className="cursor-pointer rounded-2xl border border-dashed bg-white px-4 py-3 text-center hover:bg-gray-50"
      >
        <div className="text-sm font-medium">Прикрепить фото/видео</div>
        <div className="text-xs text-gray-500">Можно несколько файлов • до ~20 МБ каждый</div>
      </label>

      {files.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {files.map((p, i) => (
            <div key={i} className="relative group rounded-xl overflow-hidden border bg-black/5">
              {p.type === 'image' ? (
                <img src={p.url} alt="" className="h-28 w-full object-cover" />
              ) : (
                <video src={p.url} className="h-28 w-full object-cover" muted />
              )}
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="absolute top-1 right-1 rounded-md bg-white/90 px-2 py-1 text-xs shadow hover:bg-white"
                aria-label="Удалить"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
