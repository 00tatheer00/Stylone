'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { Container } from '@/components/ui';
import { formatPrice } from '@/lib/utils';
import { trackPublicOrderAction } from '@/actions/orders';

export default function TrackOrderPage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any | null>(null);
  const [searched, setSearched] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      const res = await trackPublicOrderAction(query);
      if (res.success && res.order) {
        setOrder(res.order);
      } else {
        setOrder(null);
      }
    } catch {
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 'placed', label: 'Order Placed', desc: 'Received & logged' },
    { id: 'confirmed', label: 'Confirmed', desc: 'Verified by team' },
    { id: 'shipped', label: 'Dispatched via Courier', desc: 'In transit with TCS' },
    { id: 'delivered', label: 'Delivered', desc: 'Payment collected' },
  ];

  return (
    <div className="py-12 sm:py-20 bg-gradient-to-b from-[#f6faf7] via-white to-white min-h-[75vh]">
      <Container>
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black tracking-wide">
              <Truck size={14} className="text-emerald-700" />
              <span>LIVE CONSIGNMENT TRACKING</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Track Your STYLONE Order
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Enter your Order Number (e.g. <code className="text-emerald-800 font-bold">STY-2026-8816</code>) or your Pakistani Mobile Number (e.g. <code className="text-emerald-800 font-bold">03001234567</code>)
            </p>
          </div>

          {/* Search Box */}
          <form onSubmit={handleTrack} className="flex gap-2 p-2 rounded-2xl bg-white border-2 border-emerald-800/20 shadow-md">
            <div className="flex-1 flex items-center gap-2.5 px-3">
              <Search size={18} className="text-slate-400 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter Order ID or 03XXXXXXXXX..."
                className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-black text-xs sm:text-sm shadow-sm transition-all active:scale-95 cursor-pointer whitespace-nowrap"
            >
              {loading ? 'Searching...' : 'Track Order'}
            </button>
          </form>

          {/* Quick Demo Pre-fills */}
          <div className="text-center">
            <p className="text-[11px] text-slate-500 font-semibold">
              Instant test examples:{' '}
              <button
                type="button"
                onClick={() => setQuery('STY-2026-8816')}
                className="text-emerald-800 font-bold underline hover:text-emerald-950 cursor-pointer ml-1"
              >
                STY-2026-8816
              </button>{' '}
              or{' '}
              <button
                type="button"
                onClick={() => setQuery('03001234567')}
                className="text-emerald-800 font-bold underline hover:text-emerald-950 cursor-pointer"
              >
                03001234567
              </button>
            </p>
          </div>

          {/* Results Card */}
          {searched && order && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6 animate-in fade-in duration-300">
              {/* Order Meta Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Order Reference</span>
                  <p className="font-heading font-black text-xl text-slate-900">{order.orderNumber}</p>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black uppercase">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  <span>Status: {order.orderStatus}</span>
                </div>
              </div>

              {/* Visual Timeline */}
              <div className="py-2">
                <div className="grid grid-cols-4 gap-2 text-center relative">
                  <div className="flex flex-col items-center space-y-1.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      ✓
                    </div>
                    <p className="text-[11px] font-black text-slate-900 leading-tight">Order Placed</p>
                  </div>

                  <div className="flex flex-col items-center space-y-1.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      ✓
                    </div>
                    <p className="text-[11px] font-black text-slate-900 leading-tight">Confirmed</p>
                  </div>

                  <div className="flex flex-col items-center space-y-1.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs ring-4 ring-emerald-100">
                      <Truck size={14} />
                    </div>
                    <p className="text-[11px] font-black text-emerald-800 leading-tight">In Transit</p>
                  </div>

                  <div className="flex flex-col items-center space-y-1.5 opacity-40">
                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs">
                      4
                    </div>
                    <p className="text-[11px] font-bold text-slate-600 leading-tight">Delivered</p>
                  </div>
                </div>
              </div>

              {/* Courier Consignment Box */}
              {order.trackingNumber && (
                <div className="p-4 rounded-2xl bg-[#f6faf7] border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800">
                      Courier Partner
                    </span>
                    <p className="font-heading font-black text-base text-slate-900">
                      {order.shippingCourier || 'TCS Express'}
                    </p>
                    <p className="text-xs text-slate-600 font-mono mt-0.5">
                      Consignment #: <strong>{order.trackingNumber}</strong>
                    </p>
                  </div>

                  {order.trackingUrl && (
                    <a
                      href={order.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-white border border-emerald-800 text-emerald-900 hover:bg-emerald-800 hover:text-white font-extrabold text-xs transition-colors flex items-center gap-1.5 shadow-2xs"
                    >
                      <span>Track on TCS Portal</span>
                      <ExternalLink size={13} />
                    </a>
                  )}
                </div>
              )}

              {/* Delivery Details */}
              <div className="grid grid-cols-2 gap-4 text-xs pt-1">
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-400 block">Deliver To</span>
                  <p className="font-bold text-slate-900 mt-0.5">{order.customer?.fullName}</p>
                  <p className="text-slate-600">{order.customer?.city}, Pakistan</p>
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-400 block">Payment Method</span>
                  <p className="font-bold text-slate-900 mt-0.5 uppercase">
                    {order.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Direct Bank Transfer'}
                  </p>
                  <p className="text-emerald-800 font-black">
                    Amount: {formatPrice(order.financials?.total || 3950)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
