'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Package, ArrowRight, ShoppingBag, Eye, Calendar, CreditCard } from 'lucide-react';
import { formatPKR } from '@/lib/utils';
import { getCustomerOrdersAction } from '@/actions/orders';
import type { Order } from '@/types/order';

interface DisplayOrder {
  id: string;
  orderNumber: string;
  status: string;
  createdAt: string;
  paymentMethod: string;
  total: number;
  items: Array<{
    name: string;
    image: string;
    quantity: number;
  }>;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<DisplayOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadOrders() {
      try {
        const res = await getCustomerOrdersAction();
        if (res.success && res.orders && res.orders.length > 0) {
          const mapped: DisplayOrder[] = res.orders.map((o: Order) => ({
            id: o.id,
            orderNumber: o.orderNumber,
            status: o.orderStatus,
            createdAt: new Date(o.createdAt).toLocaleDateString('en-PK', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            }),
            paymentMethod: o.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Direct Bank Transfer',
            total: o.totalAmount,
            items: o.items.map((it) => ({
              name: it.productName,
              image: it.productImage || '/images/products/placeholder.svg',
              quantity: it.quantity,
            })),
          }));

          if (isMounted) {
            setOrders(mapped);
            setIsLoading(false);
            return;
          }
        }

        // Check sessionStorage for last checkout order
        const stored = sessionStorage.getItem('stylone_last_demo_order');
        if (stored && isMounted) {
          const parsed = JSON.parse(stored);
          const mapped: DisplayOrder = {
            id: parsed.orderReference || 'ord-demo',
            orderNumber: parsed.orderReference || 'STY-2026-DEMO',
            status: 'confirmed',
            createdAt: parsed.createdAt || new Date().toLocaleDateString('en-PK'),
            paymentMethod: parsed.customer?.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Direct Bank Transfer',
            total: parsed.financials?.total || 0,
            items: (parsed.items || []).map((it: { name: string; image: string; quantity: number }) => ({
              name: it.name,
              image: it.image || '/images/products/placeholder.svg',
              quantity: it.quantity,
            })),
          };
          setOrders([mapped]);
        } else if (isMounted) {
          setOrders([]);
        }
      } catch {
        if (isMounted) setOrders([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadOrders();

    return () => {
      isMounted = false;
    };
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'processing':
      case 'confirmed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
            {status}
          </span>
        );
      case 'shipped':
      case 'dispatched':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-50 text-sky-800 border border-sky-200">
            Shipped
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
            Delivered
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-800 border border-rose-200">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-800">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-[var(--radius-lg)] border border-[var(--color-border-light)] shadow-xs">
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-[var(--color-text-primary)]">
          My Order History
        </h2>
        <p className="text-xs text-[var(--color-text-secondary)] mt-1">
          Review your purchase orders, shipment dispatches and delivery statuses across Pakistan
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="h-32 bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] animate-pulse" />
          <div className="h-32 bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] animate-pulse" />
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-10 sm:p-14 text-center shadow-xs">
          <div className="w-14 h-14 mx-auto rounded-full bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)] flex items-center justify-center mb-5">
            <Package size={26} />
          </div>
          <h3 className="font-heading text-xl font-bold text-[var(--color-text-primary)] mb-2">
            No Orders Placed Yet
          </h3>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] max-w-md mx-auto mb-6 leading-relaxed">
            You haven&apos;t placed any orders with STYLONE yet. Explore our luxury collection of skincare, makeup, haircare and accessories.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-[var(--radius-md)] bg-[var(--color-text-primary)] hover:bg-[var(--color-accent)] text-white text-xs uppercase tracking-widest font-semibold transition-colors"
          >
            <ShoppingBag size={14} />
            <span>Discover Products</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.orderNumber}
              className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-5 sm:p-6 shadow-xs hover:border-[var(--color-border-dark)] transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--color-border-light)]">
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-heading text-base font-bold text-[var(--color-text-primary)] font-mono">
                      Order #{order.orderNumber}
                    </span>
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-[var(--color-text-secondary)] mt-1">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-[var(--color-text-muted)]" />
                      <span>{order.createdAt}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CreditCard size={13} className="text-[var(--color-text-muted)]" />
                      <span>{order.paymentMethod}</span>
                    </span>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <p className="text-xs text-[var(--color-text-secondary)]">Total Amount</p>
                  <p className="font-bold text-sm text-[var(--color-text-primary)] font-mono">
                    {formatPKR(order.total)}
                  </p>
                </div>
              </div>

              {/* Items Preview */}
              <div className="py-4 flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3 overflow-hidden">
                  {order.items.slice(0, 4).map((item, idx) => (
                    <div
                      key={idx}
                      className="relative w-12 h-14 rounded bg-[var(--color-bg-secondary)] border border-[var(--color-border-light)] overflow-hidden shrink-0"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                  {order.items.length > 4 && (
                    <div className="w-12 h-14 rounded bg-[var(--color-bg-secondary)] border border-[var(--color-border-light)] flex items-center justify-center text-xs font-bold text-[var(--color-text-muted)] shrink-0">
                      +{order.items.length - 4}
                    </div>
                  )}
                  <span className="text-xs text-[var(--color-text-secondary)] pl-2">
                    {order.items.reduce((acc, it) => acc + it.quantity, 0)} items
                  </span>
                </div>

                <Link
                  href={`/account/orders/${order.orderNumber}`}
                  className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors"
                >
                  <Eye size={14} />
                  <span>View Details</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
