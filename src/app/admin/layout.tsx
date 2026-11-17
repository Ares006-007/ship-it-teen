"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user && pathname !== "/admin/login") {
        router.push("/admin/login");
      } else if (user) {
        const userEmail = user.email?.toLowerCase();
        if (!userEmail || !userEmail.endsWith("@gmail.com")) {
          await auth.signOut();
          if (pathname !== "/admin/login") {
            router.push("/admin/login");
          }
        } else if (pathname === "/admin/login") {
          router.push("/admin");
        } else {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white relative">
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        <div className="bg-[#F5F474] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 text-center z-10">
          <div className="w-12 h-12 border-4 border-black border-t-[#2DDFFF] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-sora font-black uppercase text-xl">Loading System...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
