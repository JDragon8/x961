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
    const lines: string[] = [];

    if (form.customHeader) {
      lines.push(form.customHeader, "");
    }

    lines.push(
      form.title,
      `Submitted: ${new Date(form.submittedAt).toLocaleString()}`,
      "---",
      ...form.fields.map((f) => `${f.label}: ${f.value}`)
    );

    if (form.images && form.images.length > 0) {
      lines.push("", "--- Images ---");
      form.images.forEach((img) => {
        lines.push(`[Image: ${img.name}]`);
      });
    }

    if (form.customFooter) {
      lines.push("", "---", form.customFooter);
    }

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

    const imagesHtml =
      form.images && form.images.length > 0
        ? `<div class="images">
            <h3>Images</h3>
            <div style="display:flex;flex-wrap:wrap;gap:12px;">
              ${form.images
                .map(
                  (img) =>
                    `<div style="text-align:center;">
                      <img src="${img.data}" alt="${img.name}" style="max-width:200px;max-height:200px;border:1px solid #ddd;border-radius:4px;" />
                      <p style="font-size:12px;color:#666;margin-top:4px;">${img.name}</p>
                    </div>`
                )
                .join("")}
            </div>
          </div>`
        : "";

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${form.title}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; }
          .custom-header { font-size: 18px; color: #333; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 2px solid #333; white-space: pre-wrap; }
          h1 { font-size: 24px; margin-bottom: 8px; }
          .date { color: #666; margin-bottom: 24px; }
          .field { margin-bottom: 12px; }
          .label { font-weight: bold; }
          .images { margin-top: 24px; }
          .images h3 { font-size: 16px; margin-bottom: 12px; }
          .custom-footer { margin-top: 32px; padding-top: 12px; border-top: 1px solid #ccc; color: #666; font-size: 14px; white-space: pre-wrap; }
        </style>
      </head>
      <body>
        ${form.customHeader ? `<div class="custom-header">${form.customHeader}</div>` : ""}
        <h1>${form.title}</h1>
        <p class="date">Submitted: ${new Date(form.submittedAt).toLocaleString()}</p>
        ${form.fields
          .map(
            (f) =>
              `<div class="field"><span class="label">${f.label}:</span> ${f.value}</div>`
          )
          .join("")}
        ${imagesHtml}
        ${form.customFooter ? `<div class="custom-footer">${form.customFooter}</div>` : ""}
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
                <div className="mt-3 pl-4 border-l-2 border-blue-200 space-y-2">
                  {form.customHeader && (
                    <div className="text-sm font-semibold text-gray-800 pb-2 border-b border-gray-200 whitespace-pre-wrap">
                      {form.customHeader}
                    </div>
                  )}

                  {form.fields.map((field, idx) => (
                    <div key={idx} className="text-sm">
                      <span className="font-medium text-gray-700">
                        {field.label}:
                      </span>{" "}
                      <span className="text-gray-600">{field.value}</span>
                    </div>
                  ))}

                  {form.images && form.images.length > 0 && (
                    <div className="pt-2">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Images:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {form.images.map((img) => (
                          <div
                            key={img.id}
                            className="relative border border-gray-200 rounded overflow-hidden"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={img.data}
                              alt={img.name}
                              className="w-16 h-16 object-cover"
                            />
                            <p className="text-[10px] text-gray-500 text-center truncate px-1">
                              {img.name}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {form.customFooter && (
                    <div className="text-sm text-gray-500 pt-2 border-t border-gray-200 whitespace-pre-wrap">
                      {form.customFooter}
                    </div>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
