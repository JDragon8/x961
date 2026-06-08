import { render, screen, fireEvent } from "@testing-library/react";
import Header from "@/components/Header";

// Mock next/link
jest.mock("next/link", () => {
  function MockLink({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }
  MockLink.displayName = "MockLink";
  return MockLink;
});

describe("Header", () => {
  it("renders the JSysTeM brand", () => {
    render(<Header />);
    expect(screen.getByText("JSysTeM")).toBeInTheDocument();
  });

  it("renders desktop navigation links", () => {
    render(<Header />);
    const filesLinks = screen.getAllByText("Files");
    expect(filesLinks.length).toBeGreaterThan(0);
    const contactLinks = screen.getAllByText("Contact Us");
    expect(contactLinks.length).toBeGreaterThan(0);
  });

  it("toggles mobile menu on button click", () => {
    render(<Header />);
    const toggleButton = screen.getByLabelText("Toggle menu");
    expect(toggleButton).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveAttribute("aria-expanded", "true");

    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveAttribute("aria-expanded", "false");
  });

  it("closes mobile menu when a link is clicked", () => {
    render(<Header />);
    const toggleButton = screen.getByLabelText("Toggle menu");
    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveAttribute("aria-expanded", "true");

    const mobileNav = screen.getByLabelText("Mobile navigation");
    const mobileFilesLink = mobileNav.querySelector("a");
    if (mobileFilesLink) {
      fireEvent.click(mobileFilesLink);
    }
    expect(toggleButton).toHaveAttribute("aria-expanded", "false");
  });
});
