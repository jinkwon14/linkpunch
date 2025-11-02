import { NextResponse } from "next/server";
import { z } from "zod";
import { appendEvent } from "@/server/store";

export const runtime = "nodejs";

const pageViewSchema = z.object({
  type: z.literal("page_view"),
  visitorId: z.string().min(1),
  referrer: z.string().optional(),
  device: z.string().optional()
});

const bannerClickSchema = z.object({
  type: z.literal("banner_click"),
  bannerId: z.string().min(1),
  visitorId: z.string().min(1),
  referrer: z.string().optional(),
  device: z.string().optional()
});

const eventSchema = z.union([pageViewSchema, bannerClickSchema]);

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = eventSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    await appendEvent(parsed.data);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to append event", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
