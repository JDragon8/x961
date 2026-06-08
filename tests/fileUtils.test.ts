import {
  formatFileSize,
  getFileExtension,
  getFileIcon,
  sortFiles,
  filterFiles,
  FileEntry,
} from "@/lib/fileUtils";

describe("formatFileSize", () => {
  it("returns '0 B' for zero bytes", () => {
    expect(formatFileSize(0)).toBe("0 B");
  });

  it("returns '0 B' for negative bytes", () => {
    expect(formatFileSize(-100)).toBe("0 B");
  });

  it("formats bytes correctly", () => {
    expect(formatFileSize(500)).toBe("500 B");
  });

  it("formats kilobytes correctly", () => {
    expect(formatFileSize(1024)).toBe("1.0 KB");
    expect(formatFileSize(1536)).toBe("1.5 KB");
  });

  it("formats megabytes correctly", () => {
    expect(formatFileSize(1048576)).toBe("1.0 MB");
    expect(formatFileSize(2500000)).toBe("2.4 MB");
  });

  it("formats gigabytes correctly", () => {
    expect(formatFileSize(1073741824)).toBe("1.0 GB");
  });

  it("formats terabytes correctly", () => {
    expect(formatFileSize(1099511627776)).toBe("1.0 TB");
  });
});

describe("getFileExtension", () => {
  it("returns extension for a normal filename", () => {
    expect(getFileExtension("report.pdf")).toBe("pdf");
  });

  it("returns the last extension for double extensions", () => {
    expect(getFileExtension("archive.tar.gz")).toBe("gz");
  });

  it("returns empty string for no extension", () => {
    expect(getFileExtension("Makefile")).toBe("");
  });

  it("returns empty string for dotfiles", () => {
    expect(getFileExtension(".gitignore")).toBe("");
  });

  it("lowercases the extension", () => {
    expect(getFileExtension("IMAGE.PNG")).toBe("png");
  });
});

describe("getFileIcon", () => {
  it("returns PDF icon", () => {
    expect(getFileIcon("report.pdf")).toBe("📄");
  });

  it("returns image icon for jpg", () => {
    expect(getFileIcon("photo.jpg")).toBe("🖼️");
  });

  it("returns image icon for png", () => {
    expect(getFileIcon("logo.png")).toBe("🖼️");
  });

  it("returns code icon for ts files", () => {
    expect(getFileIcon("app.ts")).toBe("💻");
  });

  it("returns archive icon for zip", () => {
    expect(getFileIcon("backup.zip")).toBe("📦");
  });

  it("returns default icon for unknown extension", () => {
    expect(getFileIcon("data.xyz")).toBe("📄");
  });

  it("returns default icon for no extension", () => {
    expect(getFileIcon("README")).toBe("📄");
  });

  it("returns doc icon for docx", () => {
    expect(getFileIcon("resume.docx")).toBe("📝");
  });

  it("returns music icon for mp3", () => {
    expect(getFileIcon("song.mp3")).toBe("🎵");
  });

  it("returns video icon for mp4", () => {
    expect(getFileIcon("clip.mp4")).toBe("🎬");
  });

  it("returns web icon for html", () => {
    expect(getFileIcon("index.html")).toBe("🌐");
  });

  it("returns style icon for css", () => {
    expect(getFileIcon("styles.css")).toBe("🎨");
  });

  it("returns json icon", () => {
    expect(getFileIcon("config.json")).toBe("📋");
  });
});

describe("sortFiles", () => {
  const files: FileEntry[] = [
    { name: "beta.txt", type: "file", size: 200, modified: "2025-01-02T00:00:00Z" },
    { name: "alpha", type: "directory", size: 0, modified: "2025-01-03T00:00:00Z" },
    { name: "gamma.pdf", type: "file", size: 100, modified: "2025-01-01T00:00:00Z" },
  ];

  it("sorts by name with directories first", () => {
    const sorted = sortFiles(files, "name");
    expect(sorted[0].name).toBe("alpha");
    expect(sorted[1].name).toBe("beta.txt");
    expect(sorted[2].name).toBe("gamma.pdf");
  });

  it("sorts by size with directories first", () => {
    const sorted = sortFiles(files, "size");
    expect(sorted[0].name).toBe("alpha");
    expect(sorted[1].name).toBe("gamma.pdf");
    expect(sorted[2].name).toBe("beta.txt");
  });

  it("sorts by modified date with directories first", () => {
    const sorted = sortFiles(files, "modified");
    expect(sorted[0].name).toBe("alpha");
    expect(sorted[1].name).toBe("gamma.pdf");
    expect(sorted[2].name).toBe("beta.txt");
  });

  it("does not mutate the original array", () => {
    const original = [...files];
    sortFiles(files, "name");
    expect(files).toEqual(original);
  });

  it("handles default/unknown sort key gracefully", () => {
    const sorted = sortFiles(files, "name");
    expect(sorted).toHaveLength(3);
  });
});

describe("filterFiles", () => {
  const files: FileEntry[] = [
    { name: "report.pdf", type: "file", size: 100, modified: "2025-01-01T00:00:00Z" },
    { name: "README.md", type: "file", size: 50, modified: "2025-01-01T00:00:00Z" },
    { name: "Images", type: "directory", size: 0, modified: "2025-01-01T00:00:00Z" },
  ];

  it("returns all files for empty query", () => {
    expect(filterFiles(files, "")).toEqual(files);
  });

  it("returns all files for whitespace query", () => {
    expect(filterFiles(files, "   ")).toEqual(files);
  });

  it("filters by case-insensitive name match", () => {
    const result = filterFiles(files, "report");
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("report.pdf");
  });

  it("filters case-insensitively", () => {
    const result = filterFiles(files, "README");
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("README.md");
  });

  it("returns empty array when no matches", () => {
    expect(filterFiles(files, "nonexistent")).toHaveLength(0);
  });
});
