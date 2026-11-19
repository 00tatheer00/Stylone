'use client';

import { Suspense, useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  MapPin,
  Package,
  Truck,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { formatPKR } from '@/lib/utils';
import { getCustomerOrderAction } from '@/actions/orders';
import type { Order } from '@/types/order';

interface DisplayOrderDetail {
  orderReference: string;
  orderStatus: string;
  createdAt: string;
  paymentMethod: string;
  paymentStatus: string;
  customer: {
    fullName: string;
    phone: string;
    city: string;
    area: string;
    address: string;
    landmark?: string;
  };
  financials: {
    subtotal: number;
    discountAmount: number;
    shippingFee: number;
    total: number;
  };
  items: Array<{
    name: string;
    variantName?: string;
    price: number;
    quantity: number;
    image: string;
    slug?: string;
  }>;
  shipment?: {
    courierName: string;
    trackingNumber: string;
    trackingUrl?: string;
  } | null;
}

function OrderDetailsContent() {
  const params = useParams();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<DisplayOrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadOrder() {
      try {
        const res = await getCustomerOrderAction(orderId);
        if (res.success && res.order && isMounted) {
          const liveOrder: Order = res.order;
          setOrder({
            orderReference: liveOrder.orderNumber,
            orderStatus: liveOrder.orderStatus,
            createdAt: new Date(liveOrder.createdAt).toLocaleDateString('en-PK', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            }),
            paymentMethod: liveOrder.paymentMethod,
            paymentStatus: liveOrder.paymentStatus,
            customer: {
              fullName: liveOrder.customerName,
              phone: liveOrder.customerPhone,
              city: liveOrder.shippingAddress.city,
              area: liveOrder.shippingAddress.area,
              address: liveOrder.shippingAddress.address,
              landmark: liveOrder.shippingAddress.landmark,
            },
            financials: {
              subtotal: liveOrder.subtotal,
              discountAmount: liveOrder.discountAmount,
              shippingFee: liveOrder.shippingAmount,
              total: liveOrder.totalAmount,
            },
            items: liveOrder.items.map((it) => ({
              name: it.productName,
              variantName: it.variantDetails?.name || it.variantDetails?.title,
              price: it.unitPrice,
              quantity: it.quantity,
              image: it.productImage || '/images/products/placeholder.svg',
            })),
            shipment: liveOrder.shipment
              ? {
                  courierName: liveOrder.shipment.courierName,
                  trackingNumber: liveOrder.shipment.trackingNumber,
                  trackingUrl: liveOrder.shipment.trackingUrl,
                }
              : null,
          });
          setIsLoading(false);
          return;
        }

        // Check sessionStorage
        const stored = sessionStorage.getItem('stylone_last_demo_order');
        if (stored && isMounted) {
          const parsed = JSON.parse(stored);
          if (parsed.orderReference === orderId || !orderId) {
            setOrder({
              orderReference: parsed.orderReference,
              orderStatus: 'confirmed',
              createdAt: parsed.createdAt || new Date().toLocaleDateString('en-PK'),
              paymentMethod: parsed.customer?.paymentMethod || 'cod',
              paymentStatus: 'pending',
              customer: {
                fullName: parsed.customer?.fullName || 'Valued Customer',
                phone: parsed.customer?.phone || '',
                city: parsed.customer?.city || '',
                area: parsed.customer?.area || '',
                address: parsed.customer?.address || '',
                landmark: parsed.customer?.landmark || '',
              },
              financials: {
                subtotal: parsed.financials?.subtotal || 0,
                discountAmount: parsed.financials?.discountAmount || 0,
                shippingFee: parsed.financials?.shippingFee || 0,
                total: parsed.financials?.total || 0,
              },
              items: (parsed.items || []).map((it: { name: string; variantName?: string; price: number; quantity: number; image: string; slug?: string }) => ({
                name: it.name,
                variantName: it.variantName,
                price: it.price,
                quantity: it.quantity,
                image: it.image || '/images/products/placeholder.svg',
                slug: it.slug,
              })),
            });
            setIsLoading(false);
            return;
          }
        }

        if (isMounted) setOrder(null);
      } catch {
        if (isMounted) setOrder(null);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadOrder();

    return () => {
      isMounted = false;
    };
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-8 animate-pulse space-y-6">
        <div className="h-6 w-40 bg-[var(--color-bg-secondary)] rounded" />
        <div className="h-20 bg-[var(--color-bg-secondary)] rounded" />
        <div className="h-40 bg-[var(--color-bg-secondary)] rounded" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-10 text-center shadow-xs">
        <div className="w-14 h-14 mx-auto rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
          <AlertCircle size={24} />
        </div>
        <h2 className="font-heading text-xl font-bold text-[var(--color-text-primary)] mb-2">
          Order Not Found
        </h2>
        <p className="text-xs text-[var(--color-text-secondary)] max-w-sm mx-auto mb-6">
          The requested order #{orderId} could not be located in your current order history.
        </p>
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-2 py-2.5 px-5 rounded-[var(--radius-md)] bg-[var(--color-text-primary)] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[var(--color-accent)] transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to All Orders</span>
        </Link>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'processing':
      case 'confirmed':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
            {status}
          </span>
        );
      case 'shipped':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-50 text-sky-800 border border-sky-200">
            Shipped
          </span>
        );
      case 'delivered':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
            Delivered
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-800 border border-rose-200">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-800 border border-stone-200">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar with Back Link */}
      <div className="flex items-center justify-between bg-white p-5 rounded-[var(--radius-lg)] border border-[var(--color-border-light)] shadow-xs">
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Orders</span>
        </Link>
        {getStatusBadge(order.orderStatus)}
      </div>

      {/* Order Header Summary */}
      <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--color-border-light)]">
          <div>
            <h1 className="font-heading text-xl sm:text-2xl font-bold text-[var(--color-text-primary)] font-mono">
              Order #{order.orderReference}
            </h1>
            <div className="flex items-center gap-4 text-xs text-[var(--color-text-secondary)] mt-1">
              <span className="flex items-center gap-1">
                <Calendar size={13} className="text-[var(--color-text-muted)]" />
                <span>Placed on {order.createdAt}</span>
              </span>
              <span className="flex items-center gap-1">
                <CreditCard size={13} className="text-[var(--color-text-muted)]" />
                <span>{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Direct Bank Transfer'}</span>
              </span>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-xs text-[var(--color-text-secondary)]">Total Amount</span>
            <p className="font-heading text-xl font-bold text-[var(--color-text-primary)] font-mono">
              {formatPKR(order.financials.total)}
            </p>
          </div>
        </div>

        {/* Fulfillment Timeline */}
        <div className="pt-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-4">
            Consignment Lifecycle
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-3 rounded-[var(--radius-md)] bg-emerald-50/50 border border-emerald-200/60">
              <div className="flex items-center gap-2 text-emerald-700 text-xs font-semibold mb-1">
                <CheckCircle2 size={14} />
                <span>1. Order Placed</span>
              </div>
              <p className="text-[11px] text-[var(--color-text-muted)]">Verified in boutique system</p>
            </div>
            <div className={`p-3 rounded-[var(--radius-md)] ${['processing', 'packed', 'shipped', 'delivered'].includes(order.orderStatus) ? 'bg-amber-50/50 border border-amber-200/60' : 'bg-[var(--color-bg-primary)] border border-[var(--color-border-light)] opacity-60'}`}>
              <div className="flex items-center gap-2 text-amber-700 text-xs font-semibold mb-1">
                <Clock size={14} />
                <span>2. Quality Check</span>
              </div>
              <p className="text-[11px] text-[var(--color-text-muted)]">Physical inspection at hub</p>
            </div>
            <div className={`p-3 rounded-[var(--radius-md)] ${['shipped', 'delivered'].includes(order.orderStatus) ? 'bg-sky-50/50 border border-sky-200/60' : 'bg-[var(--color-bg-primary)] border border-[var(--color-border-light)] opacity-60'}`}>
              <div className="flex items-center gap-2 text-sky-800 text-xs font-semibold mb-1">
                <Truck size={14} />
                <span>3. Dispatched</span>
              </div>
              <p className="text-[11px] text-[var(--color-text-muted)]">{order.shipment ? `${order.shipment.courierName} (${order.shipment.trackingNumber})` : 'TCS / Leopards courier'}</p>
            </div>
            <div className={`p-3 rounded-[var(--radius-md)] ${order.orderStatus === 'delivered' ? 'bg-emerald-50/50 border border-emerald-200/60' : 'bg-[var(--color-bg-primary)] border border-[var(--color-border-light)] opacity-60'}`}>
              <div className="flex items-center gap-2 text-[var(--color-text-secondary)] text-xs font-semibold mb-1">
                <Package size={14} />
                <span>4. Delivered</span>
              </div>
              <p className="text-[11px] text-[var(--color-text-muted)]">At your doorstep</p>
            </div>
          </div>
        </div>

        {/* Shipment Consignment Box */}
        {order.shipment && (
          <div className="mt-6 p-4 rounded-[var(--radius-md)] bg-sky-50 border border-sky-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-sky-900 uppercase tracking-wider">
                Consignment Dispatched via {order.shipment.courierName}
              </p>
              <p className="text-xs text-sky-700 font-mono mt-0.5">
                Tracking CN: {order.shipment.trackingNumber}
              </p>
            </div>
            {order.shipment.trackingUrl && (
              <a
                href={order.shipment.trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-sm)] bg-sky-600 text-white text-xs font-semibold hover:bg-sky-700 transition-colors w-fit"
              >
                <span>Track on {order.shipment.courierName} Portal</span>
                <ExternalLink size={13} />
              </a>
            )}
          </div>
        )}
      </div>

      {/* Itemized Products */}
      <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-6 shadow-xs">
        <h3 className="font-heading text-lg font-bold text-[var(--color-text-primary)] mb-4 pb-3 border-b border-[var(--color-border-light)]">
          Ordered Items ({order.items.length})
        </h3>
        <div className="divide-y divide-[var(--color-border-light)]">
          {order.items.map((item, idx) => (
            <div key={idx} className="py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="relative w-14 h-16 rounded bg-[var(--color-bg-secondary)] border border-[var(--color-border-light)] overflow-hidden shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-heading text-sm font-semibold text-[var(--color-text-primary)] truncate block">
                    {item.name}
                  </p>
                  {item.variantName && (
                    <p className="text-xs text-[var(--color-text-secondary)]">
                      Variant: {item.variantName}
                    </p>
                  )}
                  <p className="text-xs text-[var(--color-text-muted)] font-mono">
                    Qty: {item.quantity} × {formatPKR(item.price)}
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-semibold text-sm text-[var(--color-text-primary)] font-mono">
                  {formatPKR(item.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Financial Breakdown */}
        <div className="mt-6 pt-4 border-t border-[var(--color-border-light)] space-y-2 text-xs text-[var(--color-text-secondary)]">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-medium text-[var(--color-text-primary)] font-mono">
              {formatPKR(order.financials.subtotal)}
            </span>
          </div>
          {order.financials.discountAmount > 0 && (
            <div className="flex justify-between text-emerald-700">
              <span>Promotional Voucher Discount</span>
              <span className="font-medium font-mono">-{formatPKR(order.financials.discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Nationwide Delivery Fee</span>
            <span className="font-medium text-[var(--color-text-primary)] font-mono">
              {order.financials.shippingFee === 0 ? 'Free' : formatPKR(order.financials.shippingFee)}
            </span>
          </div>
          <div className="flex justify-between text-sm font-bold text-[var(--color-text-primary)] pt-2 border-t border-[var(--color-border-light)]">
            <span>Total Amount</span>
            <span className="font-mono">{formatPKR(order.financials.total)}</span>
          </div>
        </div>
      </div>

      {/* Delivery & Customer Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-5 shadow-xs">
          <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-3">
            <MapPin size={15} className="text-[var(--color-accent)]" />
            <span>Delivery Destination</span>
          </span>
          <div className="text-xs text-[var(--color-text-secondary)] space-y-1">
            <p className="font-bold text-sm text-[var(--color-text-primary)]">{order.customer.fullName}</p>
            <p>{order.customer.address}</p>
            <p>
              {order.customer.area}, {order.customer.city}
            </p>
            {order.customer.landmark && (
              <p className="text-[11px] text-[var(--color-text-muted)] italic">
                Near: {order.customer.landmark}
              </p>
            )}
            <p className="pt-1 text-[var(--color-text-primary)] font-medium font-mono">
              Phone: {order.customer.phone}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-5 shadow-xs">
          <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-3">
            <CreditCard size={15} className="text-[var(--color-accent)]" />
            <span>Payment Mode</span>
          </span>
          <div className="text-xs text-[var(--color-text-secondary)] space-y-1">
            <p className="font-bold text-sm text-[var(--color-text-primary)]">
              {order.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Direct Bank Transfer'}
            </p>
            <p>
              {order.paymentMethod === 'cod'
                ? 'Payable in cash upon physical inspection & receipt by courier.'
                : 'Payment submitted via direct bank transfer to Meezan Bank account.'}
            </p>
            <p className="pt-1 text-[11px] font-semibold uppercase">
              Status: <span className="text-amber-700">{order.paymentStatus}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-stone-500 uppercase tracking-widest">
          Loading order details...
        </div>
      }
    >
      <OrderDetailsContent />
    </Suspense>
  );
}
