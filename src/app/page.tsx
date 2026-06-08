import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FileViewer from "@/components/FileViewer";
import ContactForm from "@/components/ContactForm";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <FileViewer />
          <ContactForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
