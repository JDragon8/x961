import { NextRequest, NextResponse } from "next/server";
import { validateContactForm } from "@/lib/validators";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const errors = validateContactForm(body);

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    // In production this would send an email, write to a database, etc.
    console.log("Contact form submission:", {
      name: body.name,
      email: body.email,
      message: body.message,
    });

    return NextResponse.json({ success: true, message: "Message received" });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
