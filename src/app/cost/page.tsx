import type { Metadata } from "next";
import { cost } from "@/content/answers/cost";
import { AnswerPage } from "@/components/answer-page";

export const metadata: Metadata = {
  title: { absolute: cost.metaTitle },
  description: cost.metaDescription,
  alternates: { canonical: cost.path },
};

export default function Page() {
  return <AnswerPage a={cost} />;
}
