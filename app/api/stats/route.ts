import { NextResponse } from "next/server";
import { getStats } from "@/server/store";

export const runtime = "nodejs";

export async function GET() {
  try {
    const stats = await getStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Failed to compute stats", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
