import type { UniPhoto } from "@/content/universities";

// Атрибуция фото с Wikimedia Commons: автор, лицензия со ссылкой, страница файла (требование CC BY / CC BY-SA).
export function PhotoCredit({ p }: { p: UniPhoto }) {
  return (
    <span className="font-mono text-[11px] text-muted-foreground">
      Фото: {p.author},{" "}
      {p.licenseUrl ? <a href={p.licenseUrl} rel="noopener license" target="_blank" className="underline underline-offset-2 hover:text-primary">{p.license}</a> : p.license},{" "}
      <a href={p.source} rel="noopener" target="_blank" className="underline underline-offset-2 hover:text-primary">Wikimedia Commons</a>
    </span>
  );
}
