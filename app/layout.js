import { AppContextProvider } from "@/context/AppContext";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font--inter",
  subsets: ["latin"],
});



export const metadata = {
  title: "Quick Chat- by Quick.AI",
  description: "personal chat bot",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <AppContextProvider>
    <html lang="en">
      <body
        className={`${inter.className} ${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
    </AppContextProvider>
    </ClerkProvider>
  );
}
