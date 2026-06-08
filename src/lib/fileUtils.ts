/**
 * File utility functions for the file viewer.
 */

export interface FileEntry {
  name: string;
  type: "file" | "directory";
  size: number;
  modified: string;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 0) return "0 B";
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const size = bytes / Math.pow(1024, i);
  return `${size.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf(".");
  if (lastDot === -1 || lastDot === 0) return "";
  return filename.slice(lastDot + 1).toLowerCase();
}

export function getFileIcon(filename: string): string {
  const ext = getFileExtension(filename);
  const iconMap: Record<string, string> = {
    pdf: "📄",
    doc: "📝",
    docx: "📝",
    txt: "📃",
    md: "📃",
    jpg: "🖼️",
    jpeg: "🖼️",
    png: "🖼️",
    gif: "🖼️",
    svg: "🖼️",
    mp4: "🎬",
    mp3: "🎵",
    zip: "📦",
    tar: "📦",
    gz: "📦",
    js: "💻",
    ts: "💻",
    py: "💻",
    html: "🌐",
    css: "🎨",
    json: "📋",
  };
  return iconMap[ext] || "📄";
}

export function sortFiles(files: FileEntry[], sortBy: "name" | "size" | "modified"): FileEntry[] {
  const sorted = [...files];
  sorted.sort((a, b) => {
    // Directories always first
    if (a.type !== b.type) {
      return a.type === "directory" ? -1 : 1;
    }
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "size":
        return a.size - b.size;
      case "modified":
        return new Date(a.modified).getTime() - new Date(b.modified).getTime();
      default:
        return 0;
    }
  });
  return sorted;
}

export function filterFiles(files: FileEntry[], query: string): FileEntry[] {
  if (!query || query.trim().length === 0) return files;
  const lowerQuery = query.toLowerCase();
  return files.filter((file) => file.name.toLowerCase().includes(lowerQuery));
}
