/**
 * Utilities for archiving and retrieving submitted forms.
 * Uses localStorage for persistence.
 */

export interface FormImage {
  id: string;
  name: string;
  data: string; // base64 data URL
}

export interface ArchivedForm {
  id: string;
  title: string;
  fields: FormField[];
  images: FormImage[];
  customHeader: string;
  customFooter: string;
  submittedAt: string;
}

export interface FormField {
  label: string;
  value: string;
}

const STORAGE_KEY = "jsystem_archived_forms";

export function generateId(): string {
  return `form_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function getArchivedForms(): ArchivedForm[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ArchivedForm[];
  } catch {
    return [];
  }
}

export function saveArchivedForm(form: ArchivedForm): void {
  const forms = getArchivedForms();
  forms.unshift(form);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(forms));
}

export function getArchivedFormById(id: string): ArchivedForm | undefined {
  return getArchivedForms().find((f) => f.id === id);
}

export function deleteArchivedForm(id: string): void {
  const forms = getArchivedForms().filter((f) => f.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(forms));
}

export function validateFormFields(
  fields: FormField[]
): Record<number, string> {
  const errors: Record<number, string> = {};
  fields.forEach((field, idx) => {
    if (!field.label.trim()) {
      errors[idx] = "Label is required";
    } else if (!field.value.trim()) {
      errors[idx] = "Value is required";
    }
  });
  return errors;
}
