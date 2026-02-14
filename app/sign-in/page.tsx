"use client";

import { SignIn, useUser } from "@stackframe/stack";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignInPage() {
  const router = useRouter();
  const user = useUser(); // ✅ Correct: useUser() directly returns the user

  // Redirect to dashboard immediately after login
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100">
      <div className="max-w-md w-full space-y-8">
        <SignIn />

        <Link href="/" className="text-purple-600 hover:underline text-center block">
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
