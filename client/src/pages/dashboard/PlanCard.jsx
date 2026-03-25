import React from "react";
import {
  Check,
  ShieldCheck,
  Zap,
  BadgeIndianRupee,
  Loader2,
} from "lucide-react";

const PlanCard = ({ plan, onBuy }) => {
  const isPremium = plan.price > 500 || plan.name.toLowerCase().includes("pro");

  return (
    <div
      className={`group relative bg-surface border ${isPremium ? "border-primary/50" : "border-background-accent"} p-8 rounded-3xl shadow-2xl transition-all duration-300 hover:scale-[1.02] flex flex-col overflow-hidden`}
    >
      {/* Visual Accent Top Bar */}
      <div
        className={`absolute top-0 left-0 w-full h-1 ${isPremium ? "bg-primary" : "bg-background-accent"}`}
      ></div>

      {/* Plan Icon & Header */}
      <div className="flex justify-between items-start mb-6">
        <div
          className={`p-3 rounded-2xl ${isPremium ? "bg-primary/20 text-primary" : "bg-background-accent/50 text-surface-muted"}`}
        >
          {isPremium ? <ShieldCheck size={28} /> : <Zap size={28} />}
        </div>
        {isPremium && (
          <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-primary text-white px-3 py-1 rounded-full shadow-lg shadow-primary/20">
            Most Popular
          </span>
        )}
      </div>

      <h3 className="text-2xl font-black text-surface-text mb-2 tracking-tight">
        {plan.name}
      </h3>

      <p className="text-surface-muted text-sm leading-relaxed mb-6 h-10 line-clamp-2">
        {plan.description}
      </p>

      {/* Pricing Section */}
      <div className="flex items-baseline gap-1 mb-1">
        <span className="text-4xl font-black text-surface-text tracking-tighter">
          ₹{plan.price}
        </span>
        <span className="text-surface-muted text-xs font-bold uppercase tracking-widest">
          
        </span>
      </div>

      <div className="flex items-center gap-2 text-[11px] font-bold text-primary uppercase tracking-wider mb-8">
        <BadgeIndianRupee size={14} />
        Valid for {plan.durationInDays} Days
      </div>

      {/* Features List (Static placeholders to match the UI style) */}
      <div className="space-y-3 mb-8 flex-1">
        <div className="flex items-center gap-3 text-sm text-surface-muted">
          <Check size={16} className="text-primary" />{" "}
          <span>Ad-free streaming</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-surface-muted">
          <Check size={16} className="text-primary" />{" "}
          <span>4K Ultra HD Quality</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-surface-muted">
          <Check size={16} className="text-primary" />{" "}
          <span>Exclusive Premium Content</span>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={() => onBuy(plan._id)}
        className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-all active:scale-[0.98] shadow-xl ${
          isPremium
            ? "bg-primary text-white hover:bg-blue-600 shadow-primary/20"
            : "bg-background-accent text-surface-text hover:bg-zinc-700 shadow-black/40"
        }`}
      >
        Buy Now
      </button>

      {/* Background Decorative Element */}
      {isPremium && (
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      )}
    </div>
  );
};

export default PlanCard;
