import { NextResponse } from "next/server";
import type { FileEntry } from "@/lib/fileUtils";

const SAMPLE_FILES: FileEntry[] = [
  { name: "Documents", type: "directory", size: 0, modified: "2025-12-01T10:00:00Z" },
  { name: "Images", type: "directory", size: 0, modified: "2025-11-15T14:30:00Z" },
  { name: "report-2025.pdf", type: "file", size: 2_500_000, modified: "2025-12-10T09:15:00Z" },
  { name: "budget.xlsx", type: "file", size: 150_000, modified: "2025-12-08T16:45:00Z" },
  { name: "presentation.pptx", type: "file", size: 5_200_000, modified: "2025-11-20T11:30:00Z" },
  { name: "notes.md", type: "file", size: 3_400, modified: "2025-12-12T08:00:00Z" },
  { name: "logo.svg", type: "file", size: 12_800, modified: "2025-10-05T13:20:00Z" },
  { name: "backup.zip", type: "file", size: 45_000_000, modified: "2025-12-01T02:00:00Z" },
  { name: "config.json", type: "file", size: 1_200, modified: "2025-12-11T17:30:00Z" },
  { name: "app.ts", type: "file", size: 8_900, modified: "2025-12-12T12:00:00Z" },
];

export async function GET() {
  return NextResponse.json({ files: SAMPLE_FILES });
}
