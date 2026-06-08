/**
 * Validation utilities for form inputs and data.
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateEmail(email: string): ValidationResult {
  if (!email || email.trim().length === 0) {
    return { valid: false, error: "Email is required" };
  }
  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!pattern.test(email)) {
    return { valid: false, error: "Invalid email format" };
  }
  return { valid: true };
}

export function validateName(name: string): ValidationResult {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: "Name is required" };
  }
  if (name.trim().length < 2) {
    return { valid: false, error: "Name must be at least 2 characters" };
  }
  if (name.trim().length > 100) {
    return { valid: false, error: "Name must be at most 100 characters" };
  }
  return { valid: true };
}

export function validateMessage(message: string): ValidationResult {
  if (!message || message.trim().length === 0) {
    return { valid: false, error: "Message is required" };
  }
  if (message.trim().length < 10) {
    return { valid: false, error: "Message must be at least 10 characters" };
  }
  if (message.trim().length > 2000) {
    return { valid: false, error: "Message must be at most 2000 characters" };
  }
  return { valid: true };
}

export function validateContactForm(data: {
  name: string;
  email: string;
  message: string;
}): Record<string, string> {
  const errors: Record<string, string> = {};
  const nameResult = validateName(data.name);
  if (!nameResult.valid) errors.name = nameResult.error!;
  const emailResult = validateEmail(data.email);
  if (!emailResult.valid) errors.email = emailResult.error!;
  const messageResult = validateMessage(data.message);
  if (!messageResult.valid) errors.message = messageResult.error!;
  return errors;
}
