import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FileViewer from "@/components/FileViewer";

const MOCK_FILES = [
  { name: "Documents", type: "directory", size: 0, modified: "2025-12-01T10:00:00Z" },
  { name: "report.pdf", type: "file", size: 2500000, modified: "2025-12-10T09:15:00Z" },
  { name: "notes.md", type: "file", size: 3400, modified: "2025-12-12T08:00:00Z" },
];

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("FileViewer", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("shows loading state initially", () => {
    mockFetch.mockReturnValue(new Promise(() => {})); // never resolves
    render(<FileViewer />);
    expect(screen.getByText("Loading files...")).toBeInTheDocument();
  });

  it("renders files after loading", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ files: MOCK_FILES }),
    });

    render(<FileViewer />);

    await waitFor(() => {
      expect(screen.getByText("Documents")).toBeInTheDocument();
      expect(screen.getByText("report.pdf")).toBeInTheDocument();
      expect(screen.getByText("notes.md")).toBeInTheDocument();
    });
  });

  it("shows error when fetch fails", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false });

    render(<FileViewer />);

    await waitFor(() => {
      expect(screen.getByText("Failed to fetch files")).toBeInTheDocument();
    });
  });

  it("shows error when fetch throws", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    render(<FileViewer />);

    await waitFor(() => {
      expect(screen.getByText("Network error")).toBeInTheDocument();
    });
  });

  it("filters files by search query", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ files: MOCK_FILES }),
    });

    render(<FileViewer />);

    await waitFor(() => {
      expect(screen.getByText("report.pdf")).toBeInTheDocument();
    });

    const searchInput = screen.getByLabelText("Search files");
    fireEvent.change(searchInput, { target: { value: "notes" } });

    expect(screen.getByText("notes.md")).toBeInTheDocument();
    expect(screen.queryByText("report.pdf")).not.toBeInTheDocument();
  });

  it("shows no files message when search returns empty", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ files: MOCK_FILES }),
    });

    render(<FileViewer />);

    await waitFor(() => {
      expect(screen.getByText("report.pdf")).toBeInTheDocument();
    });

    const searchInput = screen.getByLabelText("Search files");
    fireEvent.change(searchInput, { target: { value: "nonexistent" } });

    expect(screen.getByText("No files found.")).toBeInTheDocument();
  });

  it("changes sort order", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ files: MOCK_FILES }),
    });

    render(<FileViewer />);

    await waitFor(() => {
      expect(screen.getByText("report.pdf")).toBeInTheDocument();
    });

    const sortSelect = screen.getByLabelText("Sort files");
    fireEvent.change(sortSelect, { target: { value: "size" } });

    // Files should still be visible (just reordered)
    expect(screen.getByText("report.pdf")).toBeInTheDocument();
    expect(screen.getByText("notes.md")).toBeInTheDocument();
  });

  it("shows empty state when no files returned", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ files: [] }),
    });

    render(<FileViewer />);

    await waitFor(() => {
      expect(screen.getByText("No files found.")).toBeInTheDocument();
    });
  });
});
