"use client";
import { ToastContainer } from "react-toastify";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <ToastContainer />
      {children}
    </>
  );
}
