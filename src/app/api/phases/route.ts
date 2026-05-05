import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const phases = await prisma.phase.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(phases);
}
