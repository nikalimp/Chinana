import type { Metadata } from "next";
import { csca } from "@/content/answers/csca";
import { AnswerPage } from "@/components/answer-page";

export const metadata: Metadata = {
  title: { absolute: csca.metaTitle },
  description: csca.metaDescription,
  alternates: { canonical: csca.path },
};

export default function Page() {
  return <AnswerPage a={csca} />;
}
