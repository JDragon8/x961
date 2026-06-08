import {
  validateEmail,
  validateName,
  validateMessage,
  validateContactForm,
} from "@/lib/validators";

describe("validateEmail", () => {
  it("returns valid for a correct email", () => {
    expect(validateEmail("user@example.com")).toEqual({ valid: true });
  });

  it("returns error for empty email", () => {
    const result = validateEmail("");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Email is required");
  });

  it("returns error for whitespace-only email", () => {
    const result = validateEmail("   ");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Email is required");
  });

  it("returns error for email without @", () => {
    const result = validateEmail("userexample.com");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Invalid email format");
  });

  it("returns error for email without domain", () => {
    const result = validateEmail("user@");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Invalid email format");
  });

  it("returns error for email without TLD", () => {
    const result = validateEmail("user@example");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Invalid email format");
  });

  it("accepts email with subdomains", () => {
    expect(validateEmail("user@mail.example.com")).toEqual({ valid: true });
  });

  it("accepts email with plus addressing", () => {
    expect(validateEmail("user+tag@example.com")).toEqual({ valid: true });
  });
});

describe("validateName", () => {
  it("returns valid for a correct name", () => {
    expect(validateName("John")).toEqual({ valid: true });
  });

  it("returns error for empty name", () => {
    const result = validateName("");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Name is required");
  });

  it("returns error for whitespace-only name", () => {
    const result = validateName("   ");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Name is required");
  });

  it("returns error for single character name", () => {
    const result = validateName("J");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Name must be at least 2 characters");
  });

  it("accepts exactly 2 character name", () => {
    expect(validateName("Jo")).toEqual({ valid: true });
  });

  it("returns error for name over 100 characters", () => {
    const longName = "A".repeat(101);
    const result = validateName(longName);
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Name must be at most 100 characters");
  });

  it("accepts name of exactly 100 characters", () => {
    const name = "A".repeat(100);
    expect(validateName(name)).toEqual({ valid: true });
  });
});

describe("validateMessage", () => {
  it("returns valid for a correct message", () => {
    expect(validateMessage("Hello, I have a question about your service.")).toEqual({
      valid: true,
    });
  });

  it("returns error for empty message", () => {
    const result = validateMessage("");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Message is required");
  });

  it("returns error for whitespace-only message", () => {
    const result = validateMessage("     ");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Message is required");
  });

  it("returns error for message under 10 characters", () => {
    const result = validateMessage("Hi there");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Message must be at least 10 characters");
  });

  it("accepts exactly 10 character message", () => {
    expect(validateMessage("0123456789")).toEqual({ valid: true });
  });

  it("returns error for message over 2000 characters", () => {
    const longMsg = "A".repeat(2001);
    const result = validateMessage(longMsg);
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Message must be at most 2000 characters");
  });

  it("accepts message of exactly 2000 characters", () => {
    const msg = "A".repeat(2000);
    expect(validateMessage(msg)).toEqual({ valid: true });
  });
});

describe("validateContactForm", () => {
  it("returns empty errors for valid form", () => {
    const errors = validateContactForm({
      name: "John Doe",
      email: "john@example.com",
      message: "I would like to learn more about your services.",
    });
    expect(errors).toEqual({});
  });

  it("returns all errors for empty form", () => {
    const errors = validateContactForm({ name: "", email: "", message: "" });
    expect(errors.name).toBeDefined();
    expect(errors.email).toBeDefined();
    expect(errors.message).toBeDefined();
  });

  it("returns only name error when only name is invalid", () => {
    const errors = validateContactForm({
      name: "",
      email: "john@example.com",
      message: "This is a valid message.",
    });
    expect(errors.name).toBeDefined();
    expect(errors.email).toBeUndefined();
    expect(errors.message).toBeUndefined();
  });

  it("returns only email error when only email is invalid", () => {
    const errors = validateContactForm({
      name: "John",
      email: "not-an-email",
      message: "This is a valid message.",
    });
    expect(errors.name).toBeUndefined();
    expect(errors.email).toBeDefined();
    expect(errors.message).toBeUndefined();
  });

  it("returns only message error when only message is invalid", () => {
    const errors = validateContactForm({
      name: "John",
      email: "john@example.com",
      message: "short",
    });
    expect(errors.name).toBeUndefined();
    expect(errors.email).toBeUndefined();
    expect(errors.message).toBeDefined();
  });
});
