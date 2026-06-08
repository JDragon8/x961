"use client";

import { useEffect, useState } from "react";
import type { FileEntry } from "@/lib/fileUtils";
import { formatFileSize, getFileIcon, sortFiles, filterFiles } from "@/lib/fileUtils";
import { formatDate } from "@/lib/formatters";

export default function FileViewer() {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "size" | "modified">("name");

  useEffect(() => {
    async function fetchFiles() {
      try {
        setLoading(true);
        const res = await fetch("/api/files");
        if (!res.ok) throw new Error("Failed to fetch files");
        const data = await res.json();
        setFiles(data.files);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }
    fetchFiles();
  }, []);

  const displayFiles = sortFiles(filterFiles(files, searchQuery), sortBy);

  return (
    <section id="files" className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">File Viewer</h2>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Search files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          aria-label="Search files"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "name" | "size" | "modified")}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900"
          aria-label="Sort files"
        >
          <option value="name">Sort by Name</option>
          <option value="size">Sort by Size</option>
          <option value="modified">Sort by Date</option>
        </select>
      </div>

      {/* Content */}
      {loading && <p className="text-gray-500 py-8 text-center">Loading files...</p>}
      {error && <p className="text-red-600 py-8 text-center">{error}</p>}
      {!loading && !error && displayFiles.length === 0 && (
        <p className="text-gray-500 py-8 text-center">No files found.</p>
      )}
      {!loading && !error && displayFiles.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 text-gray-600 text-sm">
                <th className="py-3 pr-4">Name</th>
                <th className="py-3 pr-4">Size</th>
                <th className="py-3">Modified</th>
              </tr>
            </thead>
            <tbody>
              {displayFiles.map((file) => (
                <tr key={file.name} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 pr-4 text-gray-900">
                    <span className="mr-2">{file.type === "directory" ? "📁" : getFileIcon(file.name)}</span>
                    {file.name}
                  </td>
                  <td className="py-3 pr-4 text-gray-600 text-sm">
                    {file.type === "directory" ? "—" : formatFileSize(file.size)}
                  </td>
                  <td className="py-3 text-gray-600 text-sm">{formatDate(file.modified)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
