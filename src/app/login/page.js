"use client";

import Image from "next/image";
import dynamic from "next/dynamic";

// Import LoginForm without SSR
const LoginForm = dynamic(() => import("@/components/atoms/LoginForm"), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="flex w-full min-h-screen bg-neutral-light text-neutral-dark">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 h-screen">
        {/* Left Side - Illustration */}
        <div className="relative hidden md:flex items-center justify-center bg-gradient-to-br from-primary to-primary-light">
          <Image
            src="/assets/images/loan2.png"
            alt="Loan illustration"
            width={500}
            height={400}
            className="object-contain drop-shadow-2xl"
            priority
          />
        </div>

        {/* Right Side - Login */}
        <div className="flex flex-col mt-12 md:mt-0 md:justify-center items-center w-full h-full bg-white">
          <div className="w-full max-w-md px-6 md:px-10 py-6 rounded-2xl shadow-xl border border-neutral-gray/20">
            
            {/* Logo */}
            <Image
              src="/assets/images/logo.png"
              alt="Company Logo"
              width={240}
              height={100}
              priority
              className="mx-auto mb-4"
            />

            {/* Heading */}
            <h1 className="text-2xl font-bold text-center text-primary mb-2">
              Sign in to FinTree
            </h1>
            <p className="text-center text-neutral-gray mb-2 text-sm">
              Enter your credentials to access your dashboard
            </p>

            {/* Login Form */}
            <LoginForm />

            {/* Terms & Privacy */}
            <p className="text-xs text-center text-neutral-gray mt-1">
              By signing in, you agree to our{" "}
              <a href="/terms" className="text-primary hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/p" className="text-primary hover:underline">
                Privacy Policy
              </a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
