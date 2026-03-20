import React from 'react';

const AuthInput = ({ label, type = "text", value, onChange, placeholder, required = true }) => {
  return (
    <div className="mb-4">
      <label className="block text-surface-text text-sm font-medium mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full bg-background border border-background-accent text-surface-text px-4 py-2 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-surface-muted/50"
      />
    </div>
  );
};

export default AuthInput;