import { useState, useRef } from "react";
import emailjs from '@emailjs/browser';

function ContactMeWindow() {
  const formRef = useRef();
  const [form, setForm] = useState({ from_email: "", subject: "", message: "" });
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setSent(false);
    setError(null);

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      console.error("environment variables are not set in the .env file.");
      setError("Email configuration is missing");
      setIsSending(false);
      return;
    }

    try {
      await emailjs.sendForm(
        serviceId,
        templateId,
        formRef.current, 
        publicKey
      );
      setSent(true);
      setForm({ from_email: "", subject: "", message: "" });
    } catch (err) {
      console.error('FAILED...', err.text || err);
      setError('Oops! Something went wrong. Please try again later.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-0 w-full max-w-2xl font-xp bg-[#ECE9D8] text-sm">
      <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-0 p-2">
        <div className="flex items-center border-b border-gray-300">
          <label className="w-16 text-gray-500">To:</label>
          <input
            type="text"
            value="Lívia Neves <livianeves.dev@gmail.com>"
            disabled
            className="flex-1 bg-white text-xs outline-none px-1 py-0.5 border-l border-gray-400"
          />
        </div>
        <div className="flex items-center border-b border-gray-300">
          <label className="w-16 text-gray-500">From:</label>
          <input
            type="email"
            name="from_email"
            placeholder="Your email address"
            value={form.from_email}
            onChange={handleChange}
            className="flex-1 bg-white text-xs outline-none px-1 py-0.5 border-l border-gray-400"
            required
          />
        </div>
        <div className="flex items-center border-b-2 border-gray-400">
          <label className="w-16 text-gray-500">Subject:</label>
          <input
            type="text"
            name="subject"
            placeholder="Subject of your message"
            value={form.subject}
            onChange={handleChange}
            className="flex-1 bg-white text-xs outline-none px-1 py-0.5 border-l border-gray-400"
            required
          />
        </div>
        <textarea
          name="message"
          placeholder="Write your message here"
          value={form.message}
          onChange={handleChange}
          className="w-full bg-white text-xs outline-none p-2 min-h-40 resize-y border-2 border-inset border-t-black border-l-black border-r-white border-b-white mt-1"
          required
        />
        {isSending && <div className="text-blue-600 font-semibold mt-2">Sending...</div>}
        {sent && !isSending && <div className="text-green-600 font-semibold mt-2">Message sent! Thank you :)</div>}
        {error && !isSending && <div className="text-red-600 font-semibold mt-2">{error}</div>}
        <div className="flex justify-end mt-4">
          <button type="submit" disabled={isSending} className="px-6 py-1 bg-[#ECE9D8] border-2 border-outset border-t-white border-l-white border-r-black border-b-black focus:border-inset disabled:opacity-50 disabled:cursor-not-allowed">
            {isSending ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ContactMeWindow;
