import React from 'react';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-[450px] bg-surface p-8 rounded-lg border border-background-accent shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-primary text-3xl font-bold mb-2">▶ VideoStream</h1>
          <h2 className="text-surface-text text-xl font-semibold">{title}</h2>
          <p className="text-surface-muted mt-2">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;