import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const CONFIG_PATH = join(process.cwd(), "data", "homepage.json");

function readConfig() {
  try {
    return JSON.parse(readFileSync(CONFIG_PATH, "utf-8"));
  } catch {
    return { heroImage: "", instagramImages: [] };
  }
}

function writeConfig(data: Record<string, unknown>) {
  writeFileSync(CONFIG_PATH, JSON.stringify(data, null, 2));
}

export async function GET() {
  return NextResponse.json(readConfig());
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const config = readConfig();

  if (body.heroImage !== undefined) config.heroImage = body.heroImage;
  if (body.instagramImages !== undefined) config.instagramImages = body.instagramImages;

  writeConfig(config);
  return NextResponse.json(config);
}
