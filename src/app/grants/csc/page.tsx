import type { Metadata } from "next";
import { csc } from "@/content/answers/csc";
import { AnswerPage } from "@/components/answer-page";

export const metadata: Metadata = {
  title: { absolute: csc.metaTitle },
  description: csc.metaDescription,
  alternates: { canonical: csc.path },
};

export default function Page() {
  return <AnswerPage a={csc} />;
}
