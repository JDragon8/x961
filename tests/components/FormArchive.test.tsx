import { render, screen, fireEvent } from "@testing-library/react";
import FormArchive from "@/components/FormArchive";
import { saveArchivedForm } from "@/lib/formArchive";

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

describe("FormArchive", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  it("shows empty state when no forms archived", () => {
    render(<FormArchive />);
    expect(
      screen.getByText("No archived forms yet. Fill out and save a form to see it here.")
    ).toBeInTheDocument();
  });

  it("renders archived forms", () => {
    saveArchivedForm({
      id: "form_1",
      title: "Test Form",
      fields: [{ label: "Name", value: "Alice" }],
      submittedAt: "2025-06-01T10:30:00Z",
    });
    render(<FormArchive />);
    expect(screen.getByText("Test Form")).toBeInTheDocument();
  });

  it("expands form details on click", () => {
    saveArchivedForm({
      id: "form_expand",
      title: "Expandable",
      fields: [
        { label: "Name", value: "Bob" },
        { label: "Email", value: "bob@test.com" },
      ],
      submittedAt: "2025-06-01T10:30:00Z",
    });
    render(<FormArchive />);
    fireEvent.click(screen.getByText("Expandable"));
    expect(screen.getByText("Name:")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("Email:")).toBeInTheDocument();
  });

  it("collapses form details when clicked again", () => {
    saveArchivedForm({
      id: "form_collapse",
      title: "Collapsible",
      fields: [{ label: "Field", value: "Data" }],
      submittedAt: "2025-06-01T10:30:00Z",
    });
    render(<FormArchive />);
    fireEvent.click(screen.getByText("Collapsible"));
    expect(screen.getByText("Field:")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Collapsible"));
    expect(screen.queryByText("Field:")).not.toBeInTheDocument();
  });

  it("deletes a form", () => {
    saveArchivedForm({
      id: "form_del",
      title: "To Delete",
      fields: [],
      submittedAt: "2025-06-01T10:30:00Z",
    });
    render(<FormArchive />);
    expect(screen.getByText("To Delete")).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Delete To Delete"));
    expect(screen.queryByText("To Delete")).not.toBeInTheDocument();
    expect(
      screen.getByText("No archived forms yet. Fill out and save a form to see it here.")
    ).toBeInTheDocument();
  });

  it("triggers text download for a form", () => {
    const createObjectURL = jest.fn(() => "blob:test");
    const revokeObjectURL = jest.fn();
    global.URL.createObjectURL = createObjectURL;
    global.URL.revokeObjectURL = revokeObjectURL;

    const clickMock = jest.fn();
    const originalCreate = document.createElement.bind(document);
    jest.spyOn(document, "createElement").mockImplementation((tag: string) => {
      const el = originalCreate(tag);
      if (tag === "a") {
        el.click = clickMock;
      }
      return el;
    });

    saveArchivedForm({
      id: "form_dl",
      title: "Download Me",
      fields: [{ label: "Info", value: "Data" }],
      submittedAt: "2025-06-01T10:30:00Z",
    });
    render(<FormArchive />);
    fireEvent.click(screen.getByLabelText("Download Download Me"));
    expect(createObjectURL).toHaveBeenCalled();
    expect(clickMock).toHaveBeenCalled();
    expect(revokeObjectURL).toHaveBeenCalled();
  });

  it("opens print window for a form", () => {
    const mockWrite = jest.fn();
    const mockClose = jest.fn();
    jest.spyOn(window, "open").mockReturnValue({
      document: { write: mockWrite, close: mockClose },
    } as unknown as Window);

    saveArchivedForm({
      id: "form_print",
      title: "Print Me",
      fields: [{ label: "A", value: "B" }],
      submittedAt: "2025-06-01T10:30:00Z",
    });
    render(<FormArchive />);
    fireEvent.click(screen.getByLabelText("Print Print Me"));
    expect(window.open).toHaveBeenCalledWith("", "_blank");
    expect(mockWrite).toHaveBeenCalled();
    expect(mockClose).toHaveBeenCalled();
  });

  it("handles null print window gracefully", () => {
    jest.spyOn(window, "open").mockReturnValue(null);
    saveArchivedForm({
      id: "form_null",
      title: "Null Print",
      fields: [],
      submittedAt: "2025-06-01T10:30:00Z",
    });
    render(<FormArchive />);
    expect(() => {
      fireEvent.click(screen.getByLabelText("Print Null Print"));
    }).not.toThrow();
  });

  it("refreshes list when Refresh is clicked", () => {
    render(<FormArchive />);
    expect(
      screen.getByText("No archived forms yet. Fill out and save a form to see it here.")
    ).toBeInTheDocument();
    // Save form directly to localStorage
    saveArchivedForm({
      id: "form_refresh",
      title: "Refreshed",
      fields: [],
      submittedAt: "2025-06-01T10:30:00Z",
    });
    fireEvent.click(screen.getByLabelText("Refresh archive list"));
    expect(screen.getByText("Refreshed")).toBeInTheDocument();
  });
});
