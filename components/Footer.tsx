"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import Logo from "./Logo";

export default function Footer() {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const body = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch("/api/inquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  const field = "w-full rounded-md border border-line bg-black px-4 py-3 text-sand placeholder:text-sand/40 focus:border-gold";

  return (
    <footer id="preorder" className="border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-2 md:px-8">
        <div>
          <h2 className="text-3xl font-bold md:text-4xl">Pre-order</h2>
          <p className="mt-3 max-w-md text-sand/70">Tell us which car you drive and we will send pricing and lead time.</p>
          <a href="/divina-s58-spec-sheet.pdf" download className="mt-6 inline-flex items-center gap-2 rounded-full border border-gold px-5 py-2.5 text-sm font-bold text-gold transition hover:bg-gold hover:text-black">
            <Download size={16} /> Download spec sheet (PDF)
          </a>
        </div>

        <form onSubmit={onSubmit} className="grid gap-4">
          <input name="name" required placeholder="Name" aria-label="Name" className={field} />
          <input name="email" type="email" required placeholder="Email" aria-label="Email" className={field} />
          <select name="car" aria-label="Car" defaultValue="M3 G80" className={field}>
            <option>M3 G80</option>
            <option>M4 G82</option>
          </select>
          <textarea name="message" rows={3} placeholder="Message (optional)" aria-label="Message" className={field} />
          <button disabled={status === "sending"} className="rounded-full bg-gold px-6 py-3 text-sm font-bold text-black transition hover:bg-sand disabled:opacity-60">
            {status === "sending" ? "Sending" : "Send inquiry"}
          </button>
          <p aria-live="polite" className="min-h-5 text-sm text-sand/70">
            {status === "done" && "Thanks. We will reply by email."}
            {status === "error" && "Could not send. Check your details and try again."}
          </p>
        </form>
      </div>
      <div className="border-t border-line py-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 md:px-8">
          <Logo size={28} />
          <p className="text-xs text-sand/50">© {new Date().getFullYear()} Divina</p>
        </div>
      </div>
    </footer>
  );
}
