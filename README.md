# Liv XP

A personal portfolio with a nostalgic Windows XP-style interface, built with React, TypeScript, Vite, and Tailwind CSS.

**Live:** [liv-xp-portfolio.vercel.app](https://liv-xp-portfolio.vercel.app)

## ✨ Features

- Boot screen, login screen, log off and shut down
- Draggable windows (mouse and touch) that remember their position between visits
- Resume with PDF download, projects explorer, about me, contact form
- Apps: Command Prompt, Paint (send your drawing to me!), Minesweeper, Winamp with original chiptunes, Recycle Bin
- Clipster, a friendly paperclip assistant
- XP-style sound effects synthesized with the Web Audio API (mute in the taskbar)
- English / Portuguese (toggle in the taskbar)

## 🚀 Getting Started

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/liv-inn/liv-xp-portfolio.git
    ```
2.  **Install dependencies:**
    ```sh
    npm install
    ```
3.  **Configure EmailJS** in a `.env` file (used by the contact form and Paint):
    ```sh
    VITE_EMAILJS_SERVICE_ID=...
    VITE_EMAILJS_TEMPLATE_ID=...
    VITE_EMAILJS_PUBLIC_KEY=...
    # Optional: separate template for Paint drawings. The drawing is sent as a
    # base64 JPEG in the `drawing` variable — add a "Variable Attachment"
    # named `drawing` to the template to receive it as an image.
    VITE_EMAILJS_PAINT_TEMPLATE_ID=...
    ```
4.  **Run the development server:**
    ```sh
    npm run dev
    ```

Other scripts: `npm run build` (type-check + production build), `npm run typecheck`, `npm run lint`.

## 📫 Contact

Lívia Neves - [livianeves.dev@gmail.com](mailto:livianeves.dev@gmail.com) · [LinkedIn](https://linkedin.com/in/livia-a-neves) · [GitHub](https://github.com/liv-inn)
