"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

// Попап заявки (решение Ника 2026-11-10). Открывается по клику на любую ссылку с data-lead —
// это все кнопки «Хочу в Китай» и «Написать менеджеру». Без JavaScript ссылки ведут в Telegram.
// Данные уходят в /api/lead.php на хостинге в РФ; согласие на обработку ПДн — отдельный чекбокс (152-ФЗ, стандарт §8).

type Program = { slug: string; title: string };
type State = { status: "idle" | "sending" | "done" | "error"; id?: number; error?: string };

declare global {
  interface Window { ym?: (id: number, action: string, goal: string) => void }
}

const channels = [
  { v: "telegram", l: "Telegram", ph: "@ник или телефон" },
  { v: "whatsapp", l: "WhatsApp", ph: "+7 900 000-00-00" },
  { v: "phone", l: "Звонок", ph: "+7 900 000-00-00" },
];

export function LeadDialog({ programs, telegram, metrikaId }: { programs: Program[]; telegram: string; metrikaId: number }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [program, setProgram] = useState("");
  const [context, setContext] = useState(""); // вуз или страница, откуда открыли
  const [channel, setChannel] = useState("telegram");
  const [state, setState] = useState<State>({ status: "idle" });
  const goal = (g: string) => metrikaId && window.ym?.(metrikaId, "reachGoal", g);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLElement>("[data-lead]");
      if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      const path = location.pathname;
      const fromPage = programs.find((p) => path.startsWith(`/programs/${p.slug}/`));
      setProgram(a.dataset.leadProgram ?? fromPage?.title ?? "");
      setContext(a.dataset.leadContext ?? (path.startsWith("/universities/") ? document.querySelector("h1")?.textContent?.split(":")[0] ?? "" : ""));
      setState({ status: "idle" });
      ref.current?.showModal();
      goal("lead_open");
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [programs]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setState({ status: "sending" });
    try {
      const r = await fetch("/api/lead.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: f.get("name"), channel, contact: f.get("contact"), program: [f.get("program"), context].filter(Boolean).join(" · "),
          consent: f.get("consent") === "on", website: f.get("website"), page: location.href,
        }),
      });
      const j = await r.json().catch(() => ({ ok: false, error: "Сервер не ответил" }));
      if (!r.ok || !j.ok) throw new Error(j.error || "Не удалось отправить");
      setState({ status: "done", id: j.id });
      goal("lead_sent");
    } catch (err) {
      setState({ status: "error", error: (err as Error).message });
    }
  }

  const field = "mt-1.5 h-12 w-full border border-border bg-background px-3.5 text-base outline-none focus:border-foreground focus-visible:ring-2 focus-visible:ring-primary/40";
  const ch = channels.find((c) => c.v === channel)!;

  return (
    <dialog
      ref={ref}
      aria-labelledby="lead-title"
      onClick={(e) => e.target === ref.current && ref.current?.close()}
      className="m-auto w-[min(520px,calc(100vw-24px))] border border-foreground bg-card p-0 text-foreground backdrop:bg-foreground/50 backdrop:backdrop-blur-[2px]"
    >
      <div className="relative px-[clamp(20px,4vw,32px)] pb-7 pt-8">
        <button type="button" onClick={() => ref.current?.close()} aria-label="Закрыть" className="absolute right-3 top-3 grid size-10 place-items-center hover:text-primary">
          <X className="size-5" />
        </button>

        {state.status === "done" ? (
          <div className="py-6 text-center" role="status">
            <span aria-hidden="true" lang="zh-Hans" className="font-zh text-6xl font-black text-primary">好</span>
            <h2 id="lead-title" className="mt-4 text-[28px]">Заявка <em>принята</em></h2>
            <p className="mt-3 text-muted-foreground">Номер заявки — {state.id}. Менеджер свяжется с вами в течение рабочего дня тем способом, который вы выбрали.</p>
            <button type="button" onClick={() => ref.current?.close()} className="mt-6 h-11 rounded-full border border-foreground px-6 font-semibold hover:bg-foreground hover:text-background">Закрыть</button>
          </div>
        ) : (
          <>
            <p className="font-mono text-xs uppercase text-primary">Бесплатная диагностика</p>
            <h2 id="lead-title" className="mt-2 text-[clamp(24px,4vw,32px)]">Хочу <em>в Китай</em></h2>
            <p className="mt-2 text-[15px] text-muted-foreground">Оставьте контакт — менеджер разберёт цель, возраст и бюджет и подберёт программу, вуз и грант.{context && <> Вы смотрели: <b className="text-foreground">{context}</b>.</>}</p>

            <form onSubmit={submit} className="mt-6 space-y-4" {...{ toolname: "submit_lead", tooldescription: "Оставить заявку на бесплатную диагностику поступления в вуз Китая" }}>
              <label className="block text-sm font-medium">
                Имя
                <input name="name" required minLength={2} maxLength={80} autoComplete="given-name" className={field} {...{ toolparamdescription: "Имя человека" }} />
              </label>

              <fieldset>
                <legend className="text-sm font-medium">Как с вами связаться</legend>
                <div className="mt-1.5 grid grid-cols-3 border border-border">
                  {channels.map((c) => (
                    <label key={c.v} className={`cursor-pointer border-l border-border py-2.5 text-center text-sm first:border-l-0 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary/40 ${channel === c.v ? "bg-foreground text-background" : "hover:bg-secondary"}`}>
                      <input type="radio" name="channel" value={c.v} checked={channel === c.v} onChange={() => setChannel(c.v)} className="sr-only" />
                      {c.l}
                    </label>
                  ))}
                </div>
                <input name="contact" required minLength={3} maxLength={80} placeholder={ch.ph} aria-label={channel === "telegram" ? "Ник в Telegram или телефон" : "Телефон"} autoComplete={channel === "telegram" ? "off" : "tel"} inputMode={channel === "telegram" ? "text" : "tel"} className={field} />
              </fieldset>

              <label className="block text-sm font-medium">
                Программа
                <select name="program" value={program} onChange={(e) => setProgram(e.target.value)} className={field}>
                  <option value="">Пока не знаю — подскажите</option>
                  {programs.map((p) => <option key={p.slug} value={p.title}>{p.title}</option>)}
                </select>
              </label>

              {/* Ловушка для ботов: человек это поле не видит */}
              <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 opacity-0" />

              <label className="flex items-start gap-3 text-sm">
                <input type="checkbox" name="consent" required className="mt-0.5 size-5 shrink-0 accent-[var(--primary)]" />
                <span>Согласен на <Link href="/consent/" target="_blank" className="underline underline-offset-2 hover:text-primary">обработку персональных данных</Link> в соответствии с <Link href="/privacy-policy/" target="_blank" className="underline underline-offset-2 hover:text-primary">политикой</Link></span>
              </label>

              {state.status === "error" && <p role="alert" className="border border-primary bg-primary/5 px-3 py-2 text-sm text-primary">{state.error}</p>}

              <button type="submit" disabled={state.status === "sending"} className="h-12 w-full rounded-full bg-primary font-semibold text-primary-foreground hover:bg-brand disabled:opacity-60">
                {state.status === "sending" ? "Отправляем…" : "Отправить заявку"}
              </button>
              <p className="text-center text-sm text-muted-foreground">или напишите в Telegram <a href={telegram} className="underline underline-offset-2 hover:text-primary">@chinana</a></p>
            </form>
          </>
        )}
      </div>
    </dialog>
  );
}
