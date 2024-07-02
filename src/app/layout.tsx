import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import 'react-toastify/dist/ReactToastify.css';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import { Providers } from "./providers";
import dynamic from "next/dynamic";

const ReduxProvider = dynamic(() => import("./store/redux-provider"), {
  ssr: false
});
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Billing Craft",
  description: "Billing management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>

        <ReduxProvider>
          <Providers>
            {children}
          </Providers>
        </ReduxProvider>

      </body>
    </html>

  );
}
