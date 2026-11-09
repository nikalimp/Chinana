import type { Metadata } from "next";
import { hsk } from "@/content/answers/hsk";
import { AnswerPage } from "@/components/answer-page";

export const metadata: Metadata = {
  title: { absolute: hsk.metaTitle },
  description: hsk.metaDescription,
  alternates: { canonical: hsk.path },
};

export default function Page() {
  return <AnswerPage a={hsk} />;
}
