import localFont from "next/font/local";
import "./globals.css";

const figtree = localFont({
  src: "./fonts/Figtree.ttf",
  variable: "--font-figtree",
  weight: "100 900",
});


export const metadata = {
  title: "Material daily Inventory Report",
  description: "Tailored to aid daily inventory of materials on site by store keepers for easy management by project supervisors and owner",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${figtree.variable}  antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
