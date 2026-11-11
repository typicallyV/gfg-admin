import dbConnect from "@/lib/db";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET() {
  try {
    await dbConnect();
    const connectionState = mongoose.connection.readyState;
    const isHealthy = connectionState === 1;
    return NextResponse.json(
      { success: isHealthy, status: isHealthy ? "ok" : "degraded", connectionState },
      {
        status: isHealthy ? 200 : 503,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error: unknown) {
    console.error('Health check connection failed:', error);
    return NextResponse.json(
      { success: false, status: "error", error: "Database connection failed" },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  }
}

