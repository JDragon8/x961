import {
  generateId,
  getArchivedForms,
  saveArchivedForm,
  getArchivedFormById,
  deleteArchivedForm,
  validateFormFields,
  type ArchivedForm,
  type FormField,
} from "@/lib/formArchive";

const STORAGE_KEY = "jsystem_archived_forms";

describe("formArchive", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("generateId", () => {
    it("returns a string starting with form_", () => {
      const id = generateId();
      expect(id).toMatch(/^form_\d+_[a-z0-9]+$/);
    });

    it("returns unique ids", () => {
      const ids = new Set(Array.from({ length: 20 }, () => generateId()));
      expect(ids.size).toBe(20);
    });
  });

  describe("getArchivedForms", () => {
    it("returns empty array when nothing stored", () => {
      expect(getArchivedForms()).toEqual([]);
    });

    it("returns empty array for invalid JSON", () => {
      localStorage.setItem(STORAGE_KEY, "not-json");
      expect(getArchivedForms()).toEqual([]);
    });

    it("returns stored forms", () => {
      const forms: ArchivedForm[] = [
        {
          id: "form_1",
          title: "Test",
          fields: [{ label: "Name", value: "Alice" }],
          submittedAt: "2025-01-01T00:00:00Z",
        },
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(forms));
      expect(getArchivedForms()).toEqual(forms);
    });
  });

  describe("saveArchivedForm", () => {
    it("saves a form to the front of the list", () => {
      const form1: ArchivedForm = {
        id: "form_1",
        title: "First",
        fields: [],
        submittedAt: "2025-01-01T00:00:00Z",
      };
      const form2: ArchivedForm = {
        id: "form_2",
        title: "Second",
        fields: [],
        submittedAt: "2025-01-02T00:00:00Z",
      };
      saveArchivedForm(form1);
      saveArchivedForm(form2);
      const stored = getArchivedForms();
      expect(stored).toHaveLength(2);
      expect(stored[0].id).toBe("form_2");
      expect(stored[1].id).toBe("form_1");
    });
  });

  describe("getArchivedFormById", () => {
    it("returns the form with matching id", () => {
      const form: ArchivedForm = {
        id: "form_abc",
        title: "Found",
        fields: [{ label: "X", value: "Y" }],
        submittedAt: "2025-06-01T00:00:00Z",
      };
      saveArchivedForm(form);
      expect(getArchivedFormById("form_abc")).toEqual(form);
    });

    it("returns undefined for missing id", () => {
      expect(getArchivedFormById("nonexistent")).toBeUndefined();
    });
  });

  describe("deleteArchivedForm", () => {
    it("removes the form with given id", () => {
      saveArchivedForm({
        id: "form_del",
        title: "Delete Me",
        fields: [],
        submittedAt: "2025-01-01T00:00:00Z",
      });
      saveArchivedForm({
        id: "form_keep",
        title: "Keep Me",
        fields: [],
        submittedAt: "2025-01-02T00:00:00Z",
      });
      deleteArchivedForm("form_del");
      const remaining = getArchivedForms();
      expect(remaining).toHaveLength(1);
      expect(remaining[0].id).toBe("form_keep");
    });

    it("does nothing when id not found", () => {
      saveArchivedForm({
        id: "form_x",
        title: "Stay",
        fields: [],
        submittedAt: "2025-01-01T00:00:00Z",
      });
      deleteArchivedForm("form_nope");
      expect(getArchivedForms()).toHaveLength(1);
    });
  });

  describe("validateFormFields", () => {
    it("returns empty object for valid fields", () => {
      const fields: FormField[] = [
        { label: "Name", value: "Alice" },
        { label: "Email", value: "alice@test.com" },
      ];
      expect(validateFormFields(fields)).toEqual({});
    });

    it("errors when label is empty", () => {
      const fields: FormField[] = [{ label: "", value: "Something" }];
      const errors = validateFormFields(fields);
      expect(errors[0]).toBe("Label is required");
    });

    it("errors when label is whitespace only", () => {
      const fields: FormField[] = [{ label: "  ", value: "Something" }];
      const errors = validateFormFields(fields);
      expect(errors[0]).toBe("Label is required");
    });

    it("errors when value is empty", () => {
      const fields: FormField[] = [{ label: "Name", value: "" }];
      const errors = validateFormFields(fields);
      expect(errors[0]).toBe("Value is required");
    });

    it("errors when value is whitespace only", () => {
      const fields: FormField[] = [{ label: "Name", value: "   " }];
      const errors = validateFormFields(fields);
      expect(errors[0]).toBe("Value is required");
    });

    it("reports errors for multiple invalid fields", () => {
      const fields: FormField[] = [
        { label: "", value: "ok" },
        { label: "Good", value: "ok" },
        { label: "Valid", value: "" },
      ];
      const errors = validateFormFields(fields);
      expect(Object.keys(errors)).toHaveLength(2);
      expect(errors[0]).toBe("Label is required");
      expect(errors[2]).toBe("Value is required");
      expect(errors[1]).toBeUndefined();
    });
  });
});
