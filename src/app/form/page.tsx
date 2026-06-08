"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FormBuilder from "@/components/FormBuilder";
import FormArchive from "@/components/FormArchive";

export default function FormPage() {
  const [archiveKey, setArchiveKey] = useState(0);

  return (
    <>
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <FormBuilder onSaved={() => setArchiveKey((k) => k + 1)} />
          <FormArchive key={archiveKey} />
        </div>
      </main>
      <Footer />
    </>
  );
}
