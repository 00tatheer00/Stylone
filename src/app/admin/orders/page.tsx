'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin';
import { adminOrders, AdminOrder } from '@/data/admin-demo';
import { formatPKR } from '@/lib/utils';
import { getAdminOrdersAction } from '@/actions/orders';
import type { Order } from '@/types/order';
import { Search, Eye, Download } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>(adminOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [courierFilter, setCourierFilter] = useState('All');

  useEffect(() => {
    async function loadLiveOrders() {
      try {
        const res = await getAdminOrdersAction();
        if (res.success && res.orders && res.orders.length > 0) {
          const mapped: AdminOrder[] = res.orders.map((ord: Order) => ({
            id: ord.id,
            orderNumber: ord.orderNumber,
            customerName: ord.customerName,
            customerEmail: ord.customerEmail || '',
            customerPhone: ord.customerPhone,
            city: ord.shippingAddress.city,
            area: ord.shippingAddress.area,
            address: ord.shippingAddress.address,
            landmark: ord.shippingAddress.landmark,
            date: ord.createdAt.split('T')[0],
            itemsCount: ord.items.reduce((acc, it) => acc + it.quantity, 0),
            total: ord.totalAmount,
            subtotal: ord.subtotal,
            discount: ord.discountAmount,
            shippingFee: ord.shippingAmount,
            paymentMethod: ord.paymentMethod,
            paymentStatus: ord.paymentStatus === 'paid' ? 'paid' : ord.paymentStatus === 'under_verification' ? 'under_verification' : 'pending',
            orderStatus: (ord.orderStatus as AdminOrder['orderStatus']) || 'pending',
            courier: (ord.shipment?.courierName as AdminOrder['courier']) || undefined,
            trackingNumber: ord.shipment?.trackingNumber || undefined,
            internalNotes: ord.internalNotes,
          }));
          setOrders(mapped);
        }
      } catch {
        // Retain fallback admin demo orders
      }
    }
    loadLiveOrders();
  }, []);

  const filteredOrders = orders.filter((ord) => {
    const matchesSearch =
      ord.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.customerPhone.includes(searchTerm);

    const matchesStatus = statusFilter === 'All' || ord.orderStatus === statusFilter;
    const matchesPayment = paymentFilter === 'All' || ord.paymentMethod === paymentFilter;
    const matchesCourier = courierFilter === 'All' || ord.courier === courierFilter;

    return matchesSearch && matchesStatus && matchesPayment && matchesCourier;
  });

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'shipped':
        return 'bg-sky-50 text-sky-800 border-sky-200';
      case 'processing':
      case 'confirmed':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'cancelled':
      case 'returned':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      default:
        return 'bg-stone-100 text-stone-800 border-stone-200';
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-emerald-50 text-emerald-700';
      case 'under_verification':
        return 'bg-amber-50 text-amber-800';
      default:
        return 'bg-stone-100 text-stone-600';
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Boutique Consignments &amp; Orders"
        subtitle="Track customer orders, courier dispatch dispatches, and COD reconciliation across Pakistan."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Orders' }]}
        actions={
          <button
            onClick={() => alert('Order report CSV export initialized (Demo Mode).')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] border border-[var(--color-border-dark)] bg-white text-xs uppercase tracking-wider font-semibold text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] transition-colors"
          >
            <Download size={14} />
            <span>Export Orders CSV</span>
          </button>
        }
      />

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--color-text-muted)]">
              <Search size={15} />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by order number, client name, city or phone..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-[var(--radius-md)] border border-[var(--color-border-light)] outline-none focus:border-[var(--color-accent)]"
            />
          </div>

          {/* Status Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-[var(--radius-md)] border border-[var(--color-border-light)] bg-white text-[var(--color-text-primary)] outline-none"
            >
              <option value="All">All Order Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="packed">Packed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
              <option value="returned">Returned</option>
            </select>

            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-[var(--radius-md)] border border-[var(--color-border-light)] bg-white text-[var(--color-text-primary)] outline-none"
            >
              <option value="All">All Payment Modes</option>
              <option value="cod">Cash on Delivery (COD)</option>
              <option value="bank_transfer">Direct Bank Transfer</option>
            </select>

            <select
              value={courierFilter}
              onChange={(e) => setCourierFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-[var(--radius-md)] border border-[var(--color-border-light)] bg-white text-[var(--color-text-primary)] outline-none"
            >
              <option value="All">All Couriers</option>
              <option value="TCS">TCS Express</option>
              <option value="Leopards">Leopards Courier</option>
              <option value="Trax">Trax Logistics</option>
            </select>
          </div>
        </div>

        <div className="text-[11px] text-[var(--color-text-muted)] flex items-center justify-between pt-1">
          <span>Showing {filteredOrders.length} of {orders.length} orders</span>
          <span>Courier dispatches synchronized with Pakistan tracking APIs</span>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] shadow-xs overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-[var(--color-bg-primary)] border-b border-[var(--color-border-light)] text-[10px] uppercase font-bold tracking-wider text-[var(--color-text-secondary)]">
              <tr>
                <th className="py-3 px-4">Order Ref</th>
                <th className="py-3 px-4">Customer Details</th>
                <th className="py-3 px-4">City / Area</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Courier</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Total Amount</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-light)]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-[var(--color-text-muted)]">
                    No orders matched your criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[var(--color-bg-primary)]/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[var(--color-text-primary)]">
                      {ord.orderNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-[var(--color-text-primary)]">{ord.customerName}</p>
                      <p className="text-[11px] text-[var(--color-text-muted)]">{ord.customerPhone}</p>
                    </td>
                    <td className="py-3.5 px-4 text-[var(--color-text-secondary)]">
                      {ord.area}, {ord.city}
                    </td>
                    <td className="py-3.5 px-4 text-[var(--color-text-muted)]">{ord.date}</td>
                    <td className="py-3.5 px-4">
                      <span className="capitalize font-medium block">
                        {ord.paymentMethod === 'cod' ? 'COD' : 'Bank Transfer'}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold uppercase ${getPaymentBadge(ord.paymentStatus)}`}>
                        {ord.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[var(--color-text-secondary)] font-mono text-[11px]">
                      {ord.courier ? (
                        <>
                          <span className="font-semibold block">{ord.courier}</span>
                          <span className="text-[10px] text-[var(--color-text-muted)]">{ord.trackingNumber}</span>
                        </>
                      ) : (
                        <span className="text-stone-400">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getOrderStatusBadge(
                          ord.orderStatus
                        )}`}
                      >
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-[var(--color-text-primary)]">
                      {formatPKR(ord.total)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <Link
                        href={`/admin/orders/${ord.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[var(--color-bg-secondary)] hover:bg-[var(--color-text-primary)] hover:text-white text-xs font-semibold transition-colors"
                      >
                        <Eye size={13} />
                        <span>Inspect</span>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
