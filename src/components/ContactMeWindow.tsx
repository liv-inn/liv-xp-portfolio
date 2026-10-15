import { useState, useRef, type ChangeEvent, type FormEvent } from "react";
import emailjs from "@emailjs/browser";
import { useSettings } from "../context/useSettings";
import { sounds } from "../lib/sounds";

const EMPTY_FORM = { from_email: "", subject: "", message: "" };

function ContactMeWindow() {
  const { t } = useSettings();
  const c = t.contact;
  const formRef = useRef<HTMLFormElement>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setSent(false);
    setError(null);

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey || !formRef.current) {
      console.error("EmailJS environment variables are not set in the .env file.");
      setError(c.missingConfig);
      setIsSending(false);
      sounds.error();
      return;
    }

    try {
      await emailjs.sendForm(serviceId, templateId, formRef.current, publicKey);
      setSent(true);
      setForm(EMPTY_FORM);
      sounds.ding();
    } catch (err) {
      console.error("FAILED...", err);
      setError(c.error);
      sounds.error();
    } finally {
      setIsSending(false);
    }
  };

  const inputClass = "flex-1 min-w-0 bg-white text-xs outline-none px-1 py-0.5 border border-[#7F9DB9]";

  return (
    <div className="w-full font-xp bg-[#ECE9D8] text-sm">
      <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-1 p-2">
        <div className="flex items-center gap-1">
          <label className="w-16 text-gray-600 text-xs">{c.to}</label>
          <input type="text" value="Lívia Neves <livianeves.dev@gmail.com>" disabled className={`${inputClass} text-gray-600`} />
        </div>
        <div className="flex items-center gap-1">
          <label htmlFor="contact-from" className="w-16 text-gray-600 text-xs">
            {c.from}
          </label>
          <input id="contact-from" type="email" name="from_email" placeholder={c.fromPh} value={form.from_email} onChange={handleChange} className={inputClass} required />
        </div>
        <div className="flex items-center gap-1">
          <label htmlFor="contact-subject" className="w-16 text-gray-600 text-xs">
            {c.subject}
          </label>
          <input id="contact-subject" type="text" name="subject" placeholder={c.subjectPh} value={form.subject} onChange={handleChange} className={inputClass} required />
        </div>
        <textarea
          name="message"
          placeholder={c.messagePh}
          aria-label={c.messagePh}
          value={form.message}
          onChange={handleChange}
          className="w-full bg-white text-xs outline-none p-2 min-h-40 resize-y border border-[#7F9DB9] mt-1"
          required
        />
        <div aria-live="polite" className="min-h-5 text-xs">
          {isSending && <span className="text-blue-600 font-semibold">{c.sending}</span>}
          {sent && !isSending && <span className="text-green-700 font-semibold">{c.sent}</span>}
          {error && !isSending && <span className="text-red-600 font-semibold">{error}</span>}
        </div>
        <div className="flex justify-end">
          <button type="submit" disabled={isSending} className="xp-button px-6 disabled:opacity-50 disabled:cursor-not-allowed">
            {isSending ? c.sending : c.send}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ContactMeWindow;
