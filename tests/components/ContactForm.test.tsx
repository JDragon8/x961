import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ContactForm from "@/components/ContactForm";

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("ContactForm", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("renders the form with all fields", () => {
    render(<ContactForm />);
    expect(screen.getByText("Contact Us")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Message")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send message/i })).toBeInTheDocument();
  });

  it("shows validation errors on empty submit", async () => {
    render(<ContactForm />);
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText("Name is required")).toBeInTheDocument();
      expect(screen.getByText("Email is required")).toBeInTheDocument();
      expect(screen.getByText("Message is required")).toBeInTheDocument();
    });

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("clears field error when user types", async () => {
    render(<ContactForm />);
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText("Name is required")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "John", name: "name" } });

    await waitFor(() => {
      expect(screen.queryByText("Name is required")).not.toBeInTheDocument();
    });
  });

  it("submits successfully with valid data", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) });

    render(<ContactForm />);
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "John Doe", name: "name" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "john@example.com", name: "email" },
    });
    fireEvent.change(screen.getByLabelText("Message"), {
      target: { value: "I would like more information about your services.", name: "message" },
    });
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText(/thank you/i)).toBeInTheDocument();
    });

    expect(mockFetch).toHaveBeenCalledWith("/api/contact", expect.objectContaining({
      method: "POST",
    }));
  });

  it("shows error message when submission fails", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false });

    render(<ContactForm />);
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "John Doe", name: "name" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "john@example.com", name: "email" },
    });
    fireEvent.change(screen.getByLabelText("Message"), {
      target: { value: "I would like more information about your services.", name: "message" },
    });
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });

  it("shows error message when fetch throws", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    render(<ContactForm />);
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "John Doe", name: "name" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "john@example.com", name: "email" },
    });
    fireEvent.change(screen.getByLabelText("Message"), {
      target: { value: "I would like more information about your services.", name: "message" },
    });
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });
});
