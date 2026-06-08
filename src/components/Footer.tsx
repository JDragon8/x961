import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white text-lg font-semibold mb-2">JSysTeM</h3>
            <p className="text-sm">A modern file management and collaboration platform.</p>
          </div>
          <div>
            <h3 className="text-white text-lg font-semibold mb-2">Links</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <a href="#files" className="hover:text-white transition-colors">
                  File Viewer
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <Link href="/form" className="hover:text-white transition-colors">
                  Forms
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white text-lg font-semibold mb-2">Contact</h3>
            <p className="text-sm">support@jsystem.dev</p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm">
          <p>&copy; {currentYear} JSysTeM. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
