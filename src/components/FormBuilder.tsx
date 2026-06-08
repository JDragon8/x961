"use client";

import { useState } from "react";
import {
  type FormField,
  generateId,
  saveArchivedForm,
  validateFormFields,
} from "@/lib/formArchive";

interface FormBuilderProps {
  onSaved?: () => void;
}

export default function FormBuilder({ onSaved }: FormBuilderProps) {
  const [title, setTitle] = useState("");
  const [fields, setFields] = useState<FormField[]>([
    { label: "Full Name", value: "" },
    { label: "Email", value: "" },
    { label: "Phone", value: "" },
    { label: "Subject", value: "" },
    { label: "Details", value: "" },
  ]);
  const [errors, setErrors] = useState<Record<number, string>>({});
  const [titleError, setTitleError] = useState("");
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");

  const updateField = (
    idx: number,
    key: "label" | "value",
    val: string
  ) => {
    setFields((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [key]: val };
      return next;
    });
    if (errors[idx]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[idx];
        return next;
      });
    }
  };

  const addField = () => {
    setFields((prev) => [...prev, { label: "", value: "" }]);
  };

  const removeField = (idx: number) => {
    if (fields.length <= 1) return;
    setFields((prev) => prev.filter((_, i) => i !== idx));
    setErrors((prev) => {
      const next: Record<number, string> = {};
      Object.entries(prev).forEach(([k, v]) => {
        const num = Number(k);
        if (num < idx) next[num] = v;
        else if (num > idx) next[num - 1] = v;
      });
      return next;
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    window.print();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setTitleError("Form title is required");
      return;
    }
    setTitleError("");

    const fieldErrors = validateFormFields(fields);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    try {
      saveArchivedForm({
        id: generateId(),
        title: title.trim(),
        fields: fields.map((f) => ({
          label: f.label.trim(),
          value: f.value.trim(),
        })),
        submittedAt: new Date().toISOString(),
      });
      setStatus("saved");
      onSaved?.();
    } catch {
      setStatus("error");
    }
  };

  const handleReset = () => {
    setTitle("");
    setFields([
      { label: "Full Name", value: "" },
      { label: "Email", value: "" },
      { label: "Phone", value: "" },
      { label: "Subject", value: "" },
      { label: "Details", value: "" },
    ]);
    setErrors({});
    setTitleError("");
    setStatus("idle");
  };

  return (
    <section className="bg-white rounded-lg shadow-md p-6 print:shadow-none print:p-0">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Form Builder</h2>

      {status === "saved" && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md text-green-800">
          Form saved to archive!{" "}
          <button
            onClick={handleReset}
            className="underline font-medium hover:text-green-900"
          >
            Create another
          </button>
        </div>
      )}
      {status === "error" && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-800">
          Failed to save form. Please try again.
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Form title */}
        <div>
          <label
            htmlFor="form-title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Form Title
          </label>
          <input
            type="text"
            id="form-title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (titleError) setTitleError("");
            }}
            placeholder="e.g. Employee Onboarding Form"
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 ${
              titleError ? "border-red-500" : "border-gray-300"
            }`}
            aria-invalid={!!titleError}
            aria-describedby={titleError ? "title-error" : undefined}
          />
          {titleError && (
            <p id="title-error" className="mt-1 text-sm text-red-600">
              {titleError}
            </p>
          )}
        </div>

        {/* Dynamic fields */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700">Fields</h3>
            <button
              type="button"
              onClick={addField}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium print:hidden"
            >
              + Add Field
            </button>
          </div>

          {fields.map((field, idx) => (
            <div
              key={idx}
              className="flex gap-2 items-start"
            >
              <div className="flex-1">
                <input
                  type="text"
                  value={field.label}
                  onChange={(e) => updateField(idx, "label", e.target.value)}
                  placeholder="Field label"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent print:border-0 print:px-0 print:font-semibold"
                  aria-label={`Field ${idx + 1} label`}
                />
              </div>
              <div className="flex-[2]">
                <input
                  type="text"
                  value={field.value}
                  onChange={(e) => updateField(idx, "value", e.target.value)}
                  placeholder="Enter value"
                  className={`w-full px-3 py-2 border rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent print:border-b print:border-t-0 print:border-l-0 print:border-r-0 print:rounded-none print:px-0 ${
                    errors[idx] ? "border-red-500" : "border-gray-300"
                  }`}
                  aria-label={`Field ${idx + 1} value`}
                  aria-invalid={!!errors[idx]}
                  aria-describedby={
                    errors[idx] ? `field-${idx}-error` : undefined
                  }
                />
                {errors[idx] && (
                  <p
                    id={`field-${idx}-error`}
                    className="mt-1 text-sm text-red-600 print:hidden"
                  >
                    {errors[idx]}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeField(idx)}
                className="mt-2 text-gray-400 hover:text-red-500 transition-colors print:hidden"
                aria-label={`Remove field ${idx + 1}`}
                disabled={fields.length <= 1}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 pt-2 print:hidden">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Save &amp; Archive
          </button>
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
          >
            Download PDF
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
          >
            Print
          </button>
        </div>
      </form>
    </section>
  );
}
