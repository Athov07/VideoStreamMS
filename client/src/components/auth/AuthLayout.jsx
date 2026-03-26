import React from "react";
import { PlaySquare } from "lucide-react";

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 my-10">
      <div className="w-full max-w-[450px] bg-surface p-6 rounded-lg border border-background-accent shadow-xl">
            <div className="flex items-center justify-center mb-2"><PlaySquare className="text-primary" size={38} /></div>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            <span className="text-blue-500">
              Video<span className="text-primary">Stream</span>
            </span>
          </h1>
          <h2 className="text-surface-text text-xl font-semibold">{title}</h2>
          <p className="text-surface-muted mt-2">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
