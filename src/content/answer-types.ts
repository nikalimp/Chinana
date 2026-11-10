// Модель страницы-ответа (/grants/csc/, /exams/csca/, /exams/hsk/, /cost/).
// Правило: у каждой цифры есть источник — поле src (номер в sources[]).
import type { Faq } from "@/content/programs";

export type Source = { title: string; url: string };

export type AnswerFact = { label: string; value: string; note?: string; src?: number | number[] };

export type AnswerTable = { head: string[]; rows: string[][]; caption?: string; src?: number[] };

export type AnswerSection = {
  id: string;
  eyebrow?: string;
  title: string;
  accent?: string;
  paragraphs?: string[];
  list?: string[];
  steps?: { title: string; text: string }[];
  table?: AnswerTable;
  src?: number[];
};

export type Answer = {
  path: string; // "/wiki/csc/"
  crumb: string; // короткое имя для крошек
  zh: string; // иероглифы фоном первого экрана
  eyebrow: string;
  h1: string;
  h1Accent: string;
  metaTitle: string;
  metaDescription: string;
  answer: string; // прямой ответ, первые 100 слов
  updated: string; // ISO-дата проверки фактов
  facts: AnswerFact[];
  sections: AnswerSection[];
  faq: Faq[];
  sources: Source[];
  related: { href: string; label: string }[];
};
