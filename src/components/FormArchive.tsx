"use client";

import { useState, useCallback } from "react";
import {
  type ArchivedForm,
  getArchivedForms,
  deleteArchivedForm,
} from "@/lib/formArchive";

export default function FormArchive() {
  const [forms, setForms] = useState<ArchivedForm[]>(() => getArchivedForms());
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setForms(getArchivedForms());
  }, []);

  const handleDelete = (id: string) => {
    deleteArchivedForm(id);
    if (expandedId === id) setExpandedId(null);
    refresh();
  };

  const handleDownload = (form: ArchivedForm) => {
    const lines = [
      form.title,
      `Submitted: ${new Date(form.submittedAt).toLocaleString()}`,
      "---",
      ...form.fields.map((f) => `${f.label}: ${f.value}`),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${form.title.replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrintSingle = (form: ArchivedForm) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${form.title}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; }
          h1 { font-size: 24px; margin-bottom: 8px; }
          .date { color: #666; margin-bottom: 24px; }
          .field { margin-bottom: 12px; }
          .label { font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>${form.title}</h1>
        <p class="date">Submitted: ${new Date(form.submittedAt).toLocaleString()}</p>
        ${form.fields
          .map(
            (f) =>
              `<div class="field"><span class="label">${f.label}:</span> ${f.value}</div>`
          )
          .join("")}
        <script>window.print(); window.close();</script>
      </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return iso;
    }
  };

  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Archived Forms</h2>
        <button
          onClick={refresh}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          aria-label="Refresh archive list"
        >
          Refresh
        </button>
      </div>

      {forms.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No archived forms yet. Fill out and save a form to see it here.
        </p>
      ) : (
        <ul className="divide-y divide-gray-200" role="list">
          {forms.map((form) => (
            <li key={form.id} className="py-3">
              <div className="flex items-center justify-between">
                <button
                  onClick={() =>
                    setExpandedId(expandedId === form.id ? null : form.id)
                  }
                  className="flex-1 text-left"
                  aria-expanded={expandedId === form.id}
                >
                  <p className="font-medium text-gray-900">{form.title}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(form.submittedAt)}
                  </p>
                </button>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleDownload(form)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    aria-label={`Download ${form.title}`}
                  >
                    Download
                  </button>
                  <button
                    onClick={() => handlePrintSingle(form)}
                    className="text-sm text-gray-600 hover:text-gray-800 font-medium"
                    aria-label={`Print ${form.title}`}
                  >
                    Print
                  </button>
                  <button
                    onClick={() => handleDelete(form.id)}
                    className="text-sm text-red-600 hover:text-red-800 font-medium"
                    aria-label={`Delete ${form.title}`}
                  >
                    Delete
                  </button>
                </div>
              </div>

              {expandedId === form.id && (
                <div className="mt-3 pl-4 border-l-2 border-blue-200 space-y-1">
                  {form.fields.map((field, idx) => (
                    <div key={idx} className="text-sm">
                      <span className="font-medium text-gray-700">
                        {field.label}:
                      </span>{" "}
                      <span className="text-gray-600">{field.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
