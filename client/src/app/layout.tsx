import { ReactNode } from "react";
import "./global.css";
export const metadata = { title: "sumo-talk" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='ja'>
      <body className='bg-[#083776] font-semibold font-mono text-white '>{children}</body>
    </html>
  );
}
