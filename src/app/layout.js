import localFont from "next/font/local";
import "./globals.css";
import { Provider } from "react-redux";
import store from "./libs/store";
import ReduxProvider from "./libs/Provider";

// Font setup
const figtree = localFont({
  src: "./fonts/Figtree.ttf",
  variable: "--font-figtree",
  weight: "100 900", // Ensure weight matches your font's configuration
});

// Metadata
export const metadata = {
  title: "Material Daily Inventory Report",
  description:
    "Tailored to aid daily inventory of materials on site by storekeepers for easy management by project supervisors and owners",
};

// Root Layout Component
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${figtree.variable} antialiased`}>
        {/* Redux Provider wrapping the app */}
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
