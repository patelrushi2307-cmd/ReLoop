import type { Metadata } from "next";
import { DashboardView } from "@/components/dashboard/DashboardView";

export const metadata: Metadata = {
  title: "Dashboard — ReLoop",
  description:
    "Post surplus packaging for sale or browse listings scored on net carbon impact.",
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const { mode } = await searchParams;
  return <DashboardView initialMode={mode === "buy" ? "buy" : "sell"} />;
}
