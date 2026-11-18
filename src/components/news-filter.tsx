"use client";
import { useEffect, useState } from "react";

// Фильтр ленты новостей: весь список уже в HTML, фильтр только прячет карточки (прогрессивное улучшение, без JS видно всё)
export function NewsFilter({ unis, topics }: { unis: { slug: string; name: string }[]; topics: { id: string; label: string }[] }) {
  const [uni, setUni] = useState("");
  const [topic, setTopic] = useState("");
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    setUni(q.get("uni") ?? "");
    setTopic(q.get("topic") ?? "");
  }, []);
  useEffect(() => {
    let shown = 0;
    document.querySelectorAll<HTMLElement>("[data-news-list] > li").forEach((li) => {
      const ok = (!uni || li.dataset.uni?.split(" ").includes(uni)) && (!topic || li.dataset.topic === topic);
      li.hidden = !ok;
      if (ok) shown++;
    });
    const empty = document.getElementById("news-empty");
    if (empty) empty.hidden = shown > 0;
    const q = new URLSearchParams();
    if (uni) q.set("uni", uni);
    if (topic) q.set("topic", topic);
    history.replaceState(null, "", q.size ? `?${q}` : location.pathname);
  }, [uni, topic]);
  const sel = "h-11 w-full border border-border bg-card px-3 text-[15px]";
  return (
    <div className="mb-6 grid gap-3 sm:grid-cols-2">
      <label className="block">
        <span className="mb-1 block font-mono text-xs uppercase text-muted-foreground">Вуз</span>
        <select value={uni} onChange={(e) => setUni(e.target.value)} className={sel}>
          <option value="">Все вузы</option>
          {unis.map((u) => <option key={u.slug} value={u.slug}>{u.name}</option>)}
        </select>
      </label>
      <label className="block">
        <span className="mb-1 block font-mono text-xs uppercase text-muted-foreground">Тема</span>
        <select value={topic} onChange={(e) => setTopic(e.target.value)} className={sel}>
          <option value="">Все темы</option>
          {topics.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
        </select>
      </label>
    </div>
  );
}
