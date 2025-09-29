import { NextResponse } from "next/server";

export async function GET() {
  try {
    await fetch("https://chat-app-8ns1.onrender.com", { method: "GET" });
    return NextResponse.json({ status: "Pinged successfully" });
  } catch (error) {
    return NextResponse.json({ status: "Ping failed", error: String(error) }, { status: 500 });
  }
}