import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FormBuilder from "@/components/FormBuilder";

jest.mock("next/link", () => {
  const MockLink = ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a {...props}>{children}</a>;
  MockLink.displayName = "MockLink";
  return { __esModule: true, default: MockLink };
});

describe("FormBuilder", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  it("renders with default fields", () => {
    render(<FormBuilder />);
    expect(screen.getByText("Form Builder")).toBeInTheDocument();
    expect(screen.getByLabelText("Field 1 label")).toHaveValue("Full Name");
    expect(screen.getByLabelText("Field 2 label")).toHaveValue("Email");
    expect(screen.getByLabelText("Field 3 label")).toHaveValue("Phone");
    expect(screen.getByLabelText("Field 4 label")).toHaveValue("Subject");
    expect(screen.getByLabelText("Field 5 label")).toHaveValue("Details");
  });

  it("shows title error when submitting without a title", async () => {
    render(<FormBuilder />);
    // Fill all field values so only title is missing
    const valueInputs = screen.getAllByPlaceholderText("Enter value");
    for (const input of valueInputs) {
      await userEvent.type(input, "test");
    }
    fireEvent.click(screen.getByText("Save & Archive"));
    expect(screen.getByText("Form title is required")).toBeInTheDocument();
  });

  it("shows field errors when values are empty", async () => {
    render(<FormBuilder />);
    await userEvent.type(screen.getByPlaceholderText("e.g. Employee Onboarding Form"), "My Form");
    fireEvent.click(screen.getByText("Save & Archive"));
    const errors = screen.getAllByText("Value is required");
    expect(errors.length).toBe(5);
  });

  it("clears title error when typing", async () => {
    render(<FormBuilder />);
    fireEvent.click(screen.getByText("Save & Archive"));
    expect(screen.getByText("Form title is required")).toBeInTheDocument();
    await userEvent.type(screen.getByPlaceholderText("e.g. Employee Onboarding Form"), "A");
    expect(screen.queryByText("Form title is required")).not.toBeInTheDocument();
  });

  it("clears field error when typing in value", async () => {
    render(<FormBuilder />);
    await userEvent.type(screen.getByPlaceholderText("e.g. Employee Onboarding Form"), "Test");
    fireEvent.click(screen.getByText("Save & Archive"));
    expect(screen.getAllByText("Value is required").length).toBeGreaterThan(0);
    await userEvent.type(screen.getByLabelText("Field 1 value"), "John");
    // One fewer error
    const remaining = screen.getAllByText("Value is required");
    expect(remaining.length).toBe(4);
  });

  it("adds a new field when clicking + Add Field", async () => {
    render(<FormBuilder />);
    expect(screen.getAllByPlaceholderText("Field label")).toHaveLength(5);
    fireEvent.click(screen.getByText("+ Add Field"));
    expect(screen.getAllByPlaceholderText("Field label")).toHaveLength(6);
  });

  it("removes a field when clicking remove button", () => {
    render(<FormBuilder />);
    expect(screen.getAllByPlaceholderText("Field label")).toHaveLength(5);
    const removeButtons = screen.getAllByLabelText(/Remove field/);
    fireEvent.click(removeButtons[0]);
    expect(screen.getAllByPlaceholderText("Field label")).toHaveLength(4);
  });

  it("cannot remove the last field", () => {
    render(<FormBuilder />);
    // Remove until 1 left
    for (let i = 0; i < 4; i++) {
      const btns = screen.getAllByLabelText(/Remove field/);
      fireEvent.click(btns[0]);
    }
    expect(screen.getAllByPlaceholderText("Field label")).toHaveLength(1);
    const lastRemove = screen.getByLabelText("Remove field 1");
    expect(lastRemove).toBeDisabled();
  });

  it("saves form to localStorage and shows success", async () => {
    const onSaved = jest.fn();
    render(<FormBuilder onSaved={onSaved} />);

    await userEvent.type(
      screen.getByPlaceholderText("e.g. Employee Onboarding Form"),
      "Test Form"
    );

    const valueInputs = screen.getAllByPlaceholderText("Enter value");
    const values = ["John Doe", "john@test.com", "555-1234", "Inquiry", "Details here"];
    for (let i = 0; i < valueInputs.length; i++) {
      await userEvent.type(valueInputs[i], values[i]);
    }

    fireEvent.click(screen.getByText("Save & Archive"));
    expect(screen.getByText(/Form saved to archive!/)).toBeInTheDocument();
    expect(onSaved).toHaveBeenCalled();

    const stored = JSON.parse(localStorage.getItem("jsystem_archived_forms") || "[]");
    expect(stored).toHaveLength(1);
    expect(stored[0].title).toBe("Test Form");
  });

  it("resets form when clicking Create another", async () => {
    render(<FormBuilder />);

    await userEvent.type(
      screen.getByPlaceholderText("e.g. Employee Onboarding Form"),
      "Reset Test"
    );
    const valueInputs = screen.getAllByPlaceholderText("Enter value");
    for (const input of valueInputs) {
      await userEvent.type(input, "data");
    }
    fireEvent.click(screen.getByText("Save & Archive"));
    fireEvent.click(screen.getByText("Create another"));

    expect(screen.getByPlaceholderText("e.g. Employee Onboarding Form")).toHaveValue("");
    expect(screen.queryByText(/Form saved/)).not.toBeInTheDocument();
  });

  it("calls window.print for Print button", () => {
    const printSpy = jest.spyOn(window, "print").mockImplementation(() => {});
    render(<FormBuilder />);
    fireEvent.click(screen.getByText("Print"));
    expect(printSpy).toHaveBeenCalled();
  });

  it("calls window.print for Download PDF button", () => {
    const printSpy = jest.spyOn(window, "print").mockImplementation(() => {});
    render(<FormBuilder />);
    fireEvent.click(screen.getByText("Download PDF"));
    expect(printSpy).toHaveBeenCalled();
  });

  it("shows error when localStorage throws", async () => {
    render(<FormBuilder />);

    await userEvent.type(
      screen.getByPlaceholderText("e.g. Employee Onboarding Form"),
      "Err Form"
    );
    const valueInputs = screen.getAllByPlaceholderText("Enter value");
    for (const input of valueInputs) {
      await userEvent.type(input, "data");
    }

    jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota exceeded");
    });

    fireEvent.click(screen.getByText("Save & Archive"));
    expect(screen.getByText("Failed to save form. Please try again.")).toBeInTheDocument();
  });
});
