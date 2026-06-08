import { render, screen } from "@testing-library/react";
import Footer from "@/components/Footer";

describe("Footer", () => {
  it("renders the JSysTeM brand name", () => {
    render(<Footer />);
    expect(screen.getByText("JSysTeM")).toBeInTheDocument();
  });

  it("renders the current year in copyright", () => {
    render(<Footer />);
    const year = new Date().getFullYear();
    expect(screen.getByText(new RegExp(String(year)))).toBeInTheDocument();
  });

  it("renders navigation links", () => {
    render(<Footer />);
    expect(screen.getByText("File Viewer")).toBeInTheDocument();
    expect(screen.getByText("Contact Us")).toBeInTheDocument();
  });

  it("renders contact email", () => {
    render(<Footer />);
    expect(screen.getByText("support@jsystem.dev")).toBeInTheDocument();
  });

  it("renders section headings", () => {
    render(<Footer />);
    expect(screen.getByText("Links")).toBeInTheDocument();
    expect(screen.getByText("Contact")).toBeInTheDocument();
  });
});
