import "./globals.css";
import SiteHeader from "@/components/SiteHeader";

export const metadata = {
  title: {
    default: "Architecture & Backend Field Guide",
    template: "%s · Architecture Field Guide",
  },
  description:
    "A self-paced guide to software architecture and system design: learning paths, hands-on tutorials, a searchable glossary and a reference library.",
};

const themeScript = `(function(){try{var t=localStorage.getItem("fieldguide-theme");if(t!=="dark"&&t!=="light"){t=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}document.documentElement.setAttribute("data-theme",t);}catch(e){document.documentElement.setAttribute("data-theme","light");}})();`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light dark" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <SiteHeader />
        <main className="wrap" id="view">
          {children}
        </main>
        <footer className="site-footer">
          <div className="wrap">
            <p>
              Reference modules are extracted from the PDFs in this folder. Tutorials, paths and the glossary are
              original to this guide. Progress and answers are saved in this browser only.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
