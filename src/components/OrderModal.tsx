"use client";

import React, { useState } from "react";
import { X, Check, ShieldCheck, Truck, CreditCard } from "lucide-react";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedColorway?: string;
}

export default function OrderModal({
  isOpen,
  onClose,
  selectedColorway = "Matte Obsidian Black",
}: OrderModalProps) {
  const [color, setColor] = useState<string>(selectedColorway);
  const [engraving, setEngraving] = useState<string>("");
  const [warrantySelected, setWarrantySelected] = useState<boolean>(true);
  const [isOrdered, setIsOrdered] = useState<boolean>(false);

  if (!isOpen) return null;

  const basePrice = 429.99;
  const warrantyPrice = warrantySelected ? 49.0 : 0.0;
  const totalPrice = (basePrice + warrantyPrice).toFixed(2);

  const handleConfirm = () => {
    setIsOrdered(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-xl glass-panel rounded-3xl border border-white/10 shadow-2xl p-6 sm:p-8 bg-[#09090d]">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isOrdered ? (
          <div>
            <div className="mb-6">
              <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-[#00D6FF]">
                Official Sony Store Reservation
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
                Pre-order WH-1000XM6
              </h2>
              <p className="text-xs text-white/60 mt-1">
                Ships with hard travel case, USB-C lossless cable, and 3.5mm OFC audio adapter.
              </p>
            </div>

            {/* Color selection */}
            <div className="mb-6">
              <label className="block text-xs font-mono uppercase text-white/50 mb-2">
                Selected Finish: <span className="text-white font-semibold">{color}</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "Matte Obsidian Black",
                  "Platinum Silver",
                  "Midnight Deep Navy",
                  "Smoked Titanium Bronze",
                ].map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`px-3 py-2.5 rounded-xl text-xs font-medium text-left border transition-all ${
                      color === c
                        ? "bg-[#0050FF]/20 border-[#00D6FF] text-white"
                        : "bg-white/[0.02] border-white/[0.06] text-white/60 hover:text-white"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Laser Engraving Option */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono uppercase text-white/50">
                  Complimentary Laser Engraving
                </label>
                <span className="text-[10px] text-[#00D6FF] font-mono">Free</span>
              </div>
              <input
                type="text"
                maxLength={16}
                value={engraving}
                onChange={(e) => setEngraving(e.target.value)}
                placeholder="e.g. S.K. GUPTA or STUDIO-01 (Optional)"
                className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs placeholder-white/30 focus:outline-none focus:border-[#00D6FF]"
              />
            </div>

            {/* Sony Protect Plus */}
            <div className="mb-6 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <ShieldCheck className="w-5 h-5 text-[#00D6FF]" />
                <div>
                  <div className="text-xs font-semibold text-white">
                    Sony Care Protection Plus (2 Years)
                  </div>
                  <div className="text-[11px] text-white/50">
                    Includes accidental drops, liquid spills & battery renewal
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={warrantySelected}
                onChange={(e) => setWarrantySelected(e.target.checked)}
                className="w-4 h-4 rounded text-[#0050FF] focus:ring-0 bg-transparent"
              />
            </div>

            {/* Price Breakdown */}
            <div className="pt-4 border-t border-white/[0.08] mb-6 flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase font-mono text-white/40">Total Amount</div>
                <div className="text-2xl font-bold text-white tracking-tight">${totalPrice}</div>
              </div>
              <div className="text-right text-[11px] text-white/50 space-y-0.5">
                <div className="flex items-center space-x-1 text-emerald-400">
                  <Truck className="w-3.5 h-3.5" />
                  <span>Free Express Global Shipping</span>
                </div>
                <div>30-Day Risk-Free Audition Period</div>
              </div>
            </div>

            {/* CTA Confirm */}
            <button
              onClick={handleConfirm}
              className="w-full py-4 rounded-full bg-gradient-to-r from-[#0050FF] to-[#00D6FF] text-white text-sm font-semibold flex items-center justify-center space-x-2 shadow-lg shadow-[#0050FF]/30 hover:brightness-110 transition-all"
            >
              <CreditCard className="w-4 h-4" />
              <span>Complete Reservation — ${totalPrice}</span>
            </button>
          </div>
        ) : (
          <div className="py-8 text-center space-y-5 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-400">
              <Check className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-bold text-white tracking-tight">
              WH-1000XM6 Reserved
            </h3>

            <p className="text-sm text-white/70 max-w-sm mx-auto leading-relaxed font-light">
              Thank you for reserving the new flagship. You have secured priority
              batch allocation for the <span className="text-[#00D6FF] font-medium">{color}</span> edition.
            </p>

            {engraving && (
              <div className="inline-block px-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-white/80">
                Custom Laser Engraving: <span className="text-[#00D6FF]">&ldquo;{engraving}&rdquo;</span>
              </div>
            )}

            <div className="pt-4 border-t border-white/[0.08] flex justify-center">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-full bg-white/[0.08] hover:bg-white/[0.14] text-xs font-semibold text-white tracking-wide transition-colors"
              >
                Return to Product Experience
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
