import {
  formatDate,
  formatDateTime,
  truncateText,
  slugify,
  capitalize,
  pluralize,
} from "@/lib/formatters";

describe("formatDate", () => {
  it("formats a valid ISO date string", () => {
    const result = formatDate("2025-12-10T09:15:00Z");
    expect(result).toContain("2025");
    expect(result).toContain("Dec");
    expect(result).toContain("10");
  });

  it("returns the original string for invalid dates", () => {
    expect(formatDate("not-a-date")).toBe("not-a-date");
  });

  it("returns the original string for empty input", () => {
    expect(formatDate("")).toBe("");
  });
});

describe("formatDateTime", () => {
  it("formats a valid ISO date string with time", () => {
    const result = formatDateTime("2025-12-10T09:15:00Z");
    expect(result).toContain("2025");
    expect(result).toContain("Dec");
  });

  it("returns the original string for invalid dates", () => {
    expect(formatDateTime("invalid")).toBe("invalid");
  });
});

describe("truncateText", () => {
  it("returns the same text if within max length", () => {
    expect(truncateText("hello", 10)).toBe("hello");
  });

  it("truncates and appends ellipsis", () => {
    expect(truncateText("hello world", 8)).toBe("hello...");
  });

  it("uses default max length of 100", () => {
    const short = "a".repeat(50);
    expect(truncateText(short)).toBe(short);
  });

  it("truncates long text at 100 chars by default", () => {
    const long = "a".repeat(150);
    const result = truncateText(long);
    expect(result.length).toBe(100);
    expect(result.endsWith("...")).toBe(true);
  });
});

describe("slugify", () => {
  it("converts text to lowercase slug", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("removes special characters", () => {
    expect(slugify("Hello! World@123")).toBe("hello-world123");
  });

  it("replaces underscores with hyphens", () => {
    expect(slugify("hello_world")).toBe("hello-world");
  });

  it("collapses multiple hyphens", () => {
    expect(slugify("hello---world")).toBe("hello-world");
  });

  it("trims leading and trailing hyphens", () => {
    expect(slugify("-hello-")).toBe("hello");
  });

  it("handles empty string", () => {
    expect(slugify("")).toBe("");
  });
});

describe("capitalize", () => {
  it("capitalizes the first letter", () => {
    expect(capitalize("hello")).toBe("Hello");
  });

  it("returns empty string for empty input", () => {
    expect(capitalize("")).toBe("");
  });

  it("handles single character", () => {
    expect(capitalize("a")).toBe("A");
  });

  it("does not change already capitalized text", () => {
    expect(capitalize("Hello")).toBe("Hello");
  });
});

describe("pluralize", () => {
  it("returns singular for count 1", () => {
    expect(pluralize(1, "file")).toBe("1 file");
  });

  it("returns plural for count 0", () => {
    expect(pluralize(0, "file")).toBe("0 files");
  });

  it("returns plural for count > 1", () => {
    expect(pluralize(5, "file")).toBe("5 files");
  });

  it("uses custom plural form", () => {
    expect(pluralize(2, "person", "people")).toBe("2 people");
  });

  it("uses custom plural for count 0", () => {
    expect(pluralize(0, "child", "children")).toBe("0 children");
  });
});
