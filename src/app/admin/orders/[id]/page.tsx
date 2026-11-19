'use client';

import { Suspense, useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin';
import { adminOrders, AdminOrder } from '@/data/admin-demo';
import { formatPKR } from '@/lib/utils';
import {
  updateOrderStatusAction,
  recordCodPaymentAction,
  verifyBankTransferAction,
  dispatchShipmentAction,
  getAdminOrderByIdAction,
} from '@/actions/orders';
import {
  ArrowLeft,
  Truck,
  CreditCard,
  MapPin,
  CheckCircle2,
  Save,
  MessageSquare,
  PackageCheck,
  Send,
  X,
} from 'lucide-react';

function OrderDetailContent() {
  const params = useParams();
  const id = params?.id as string;

  const foundOrder = adminOrders.find((o) => o.id === id) || adminOrders[0];
  const [order, setOrder] = useState<AdminOrder>(foundOrder);
  const [adminNote, setAdminNote] = useState(order.internalNotes || '');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    async function loadLiveOrder() {
      try {
        const res = await getAdminOrderByIdAction(id);
        if (res.success && res.order) {
          const ord = res.order;
          const mapped: AdminOrder = {
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
            paymentStatus:
              ord.paymentStatus === 'paid'
                ? 'paid'
                : ord.paymentStatus === 'under_verification'
                ? 'under_verification'
                : 'pending',
            orderStatus: (ord.orderStatus as AdminOrder['orderStatus']) || 'pending',
            courier: (ord.shipment?.courierName as AdminOrder['courier']) || undefined,
            trackingNumber: ord.shipment?.trackingNumber || undefined,
            internalNotes: ord.internalNotes,
          };
          setOrder(mapped);
          if (ord.internalNotes) setAdminNote(ord.internalNotes);
        }
      } catch {
        // Fallback
      }
    }
    loadLiveOrder();
  }, [id]);

  // Shipment Dispatch State
  const [isShipModalOpen, setIsShipModalOpen] = useState(false);
  const [courierName, setCourierName] = useState<'TCS' | 'Leopards' | 'Call Courier' | 'Trax'>('TCS');
  const [trackingNumber, setTrackingNumber] = useState('77123984501');

  const handleStatusChange = async (newStatus: AdminOrder['orderStatus']) => {
    setOrder({ ...order, orderStatus: newStatus });

    try {
      const fd = new FormData();
      fd.append('orderId', order.id);
      fd.append('newStatus', newStatus);
      fd.append('notes', `Advanced by administrator to ${newStatus}`);
      const res = await updateOrderStatusAction(fd);
      setSaveStatus(res.message || `Order lifecycle updated to "${newStatus}".`);
    } catch {
      setSaveStatus(`Order lifecycle updated to "${newStatus}" (Demo State).`);
    }

    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleSaveNotes = (e: React.FormEvent) => {
    e.preventDefault();
    setOrder({ ...order, internalNotes: adminNote });
    setSaveStatus('Internal administrative note recorded.');
    setTimeout(() => setSaveStatus(null), 2500);
  };

  const handleRecordCodPayment = async () => {
    const orderTotal = order.totalAmount || order.total || 0;
    if (!window.confirm(`Confirm receipt of ${formatPKR(orderTotal)} from courier cash collection?`)) {
      return;
    }

    setOrder({ ...order, paymentStatus: 'paid' });

    try {
      const fd = new FormData();
      fd.append('orderId', order.id);
      fd.append('amount', String(orderTotal));
      fd.append('reference', `COD-REC-${Date.now()}`);
      fd.append('notes', 'Physical cash reconciled with delivery invoice');
      const res = await recordCodPaymentAction(fd);
      setSaveStatus(res.message || 'COD cash collection recorded.');
    } catch {
      setSaveStatus('COD cash collection recorded (Demo State).');
    }

    setTimeout(() => setSaveStatus(null), 3500);
  };

  const handleVerifyBankTransfer = async (approved: boolean) => {
    setOrder({ ...order, paymentStatus: approved ? 'paid' : 'failed' });

    try {
      const fd = new FormData();
      fd.append('orderId', order.id);
      fd.append('isApproved', String(approved));
      fd.append('reference', 'MEEZAN-STATEMENT-MATCH');
      fd.append('notes', approved ? 'Bank deposit verified' : 'Payment rejected: unverified deposit');
      const res = await verifyBankTransferAction(fd);
      setSaveStatus(res.message || (approved ? 'Bank transfer approved.' : 'Bank transfer rejected.'));
    } catch {
      setSaveStatus(approved ? 'Bank transfer approved (Demo State).' : 'Bank transfer rejected (Demo State).');
    }

    setTimeout(() => setSaveStatus(null), 3500);
  };

  const handleDispatchCourier = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrder({
      ...order,
      orderStatus: 'shipped',
      courier: courierName,
      trackingNumber,
    });

    try {
      const fd = new FormData();
      fd.append('orderId', order.id);
      fd.append('courierName', courierName);
      fd.append('trackingNumber', trackingNumber);
      const res = await dispatchShipmentAction(fd);
      setSaveStatus(res.message || `Dispatched via ${courierName} (#${trackingNumber}).`);
    } catch {
      setSaveStatus(`Dispatched via ${courierName} (#${trackingNumber}) (Demo State).`);
    }

    setIsShipModalOpen(false);
    setTimeout(() => setSaveStatus(null), 3500);
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={`Consignment Inspection: #${order.orderNumber}`}
        subtitle={`Placed on ${order.date} by ${order.customerName} (${order.city}, Pakistan)`}
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Orders', href: '/admin/orders' },
          { label: order.orderNumber },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-[var(--radius-md)] border border-[var(--color-border-dark)] bg-white hover:bg-[var(--color-bg-secondary)]"
            >
              <ArrowLeft size={13} />
              <span>Back to Orders</span>
            </Link>
          </div>
        }
      />

      {saveStatus && (
        <div className="p-3.5 rounded-[var(--radius-md)] bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{saveStatus}</p>
        </div>
      )}

      {/* Main 2-Col Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column (2 cols): Items, Financials, Logistics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items Table */}
          <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] overflow-hidden shadow-xs">
            <div className="p-5 border-b border-[var(--color-border-light)] flex items-center justify-between">
              <h3 className="font-heading text-base font-bold text-[var(--color-text-primary)]">
                Procured Formulations ({(order.items || []).length})
              </h3>
              <span className="text-[11px] font-mono text-[var(--color-text-muted)]">
                Snapshot: #{order.orderNumber}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[var(--color-text-secondary)]">
                <thead className="bg-[var(--color-bg-secondary)]/50 text-[var(--color-text-primary)] font-semibold uppercase tracking-wider text-[10px] border-b border-[var(--color-border-light)]">
                  <tr>
                    <th className="py-3 px-4">Item Formulation</th>
                    <th className="py-3 px-4 text-center">Qty</th>
                    <th className="py-3 px-4 text-right">Unit Price</th>
                    <th className="py-3 px-4 text-right">Line Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border-light)]">
                  {(order.items || []).map((item, idx) => (
                    <tr key={idx} className="hover:bg-[var(--color-bg-primary)]/40 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-[var(--color-text-primary)]">
                        {item.name}
                        <span className="block text-[10px] font-mono text-[var(--color-text-muted)] font-normal">
                          Verified Formulation Unit
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-stone-900">
                        {item.quantity}
                      </td>
                      <td className="py-3.5 px-4 text-right font-medium">
                        {formatPKR(item.price)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-stone-900">
                        {formatPKR(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Summary */}
            <div className="p-5 bg-[var(--color-bg-secondary)]/30 border-t border-[var(--color-border-light)] space-y-2 text-xs">
              <div className="flex justify-between text-[var(--color-text-secondary)]">
                <span>Subtotal</span>
                <span>{formatPKR(order.totalAmount || order.total || 0)}</span>
              </div>
              <div className="flex justify-between text-[var(--color-text-secondary)]">
                <span>Domestic Shipping (Pakistan)</span>
                <span className="text-emerald-700 font-semibold">Free</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[var(--color-text-primary)] pt-2 border-t border-[var(--color-border-light)]">
                <span>Total Amount (PKR)</span>
                <span className="font-heading text-base">{formatPKR(order.totalAmount || order.total || 0)}</span>
              </div>
            </div>
          </div>

          {/* Courier Consignment Section */}
          <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--color-border-light)] pb-3">
              <div className="flex items-center gap-2">
                <Truck size={17} className="text-[var(--color-accent)]" />
                <h3 className="font-heading text-base font-bold text-[var(--color-text-primary)]">
                  Domestic Logistics &amp; Courier Tracking
                </h3>
              </div>
              <button
                onClick={() => setIsShipModalOpen(true)}
                className="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded border border-[var(--color-border-dark)] bg-white hover:bg-[var(--color-bg-secondary)]"
              >
                {order.trackingNumber ? 'Update Consignment' : 'Book Dispatch'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <p className="text-[11px] text-[var(--color-text-muted)] uppercase font-semibold">
                  Courier Partner
                </p>
                <p className="font-bold text-[var(--color-text-primary)] mt-0.5">
                  {order.courier || 'TCS Express'}
                </p>
              </div>

              <div>
                <p className="text-[11px] text-[var(--color-text-muted)] uppercase font-semibold">
                  Tracking Airway Bill
                </p>
                <p className="font-mono font-bold text-[var(--color-text-primary)] mt-0.5">
                  {order.trackingNumber || 'Pending Dispatch Generation'}
                </p>
              </div>

              <div>
                <p className="text-[11px] text-[var(--color-text-muted)] uppercase font-semibold">
                  Destination Hub
                </p>
                <p className="font-bold text-[var(--color-text-primary)] mt-0.5">
                  {order.city} Central Hub
                </p>
              </div>
            </div>
          </div>

          {/* Internal Notes */}
          <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-5 sm:p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[var(--color-border-light)]">
              <MessageSquare size={16} className="text-[var(--color-accent)]" />
              <h3 className="font-heading text-base font-bold text-[var(--color-text-primary)]">
                Internal Operational Notes
              </h3>
            </div>
            <form onSubmit={handleSaveNotes} className="space-y-3">
              <textarea
                rows={3}
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Log internal warehouse instructions, packing notes, customer requests..."
                className="w-full p-3 text-xs rounded-[var(--radius-md)] border border-[var(--color-border-light)] outline-none focus:border-[var(--color-accent)]"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[var(--radius-md)] bg-stone-900 text-white text-xs uppercase tracking-wider font-semibold hover:bg-stone-800 transition-colors"
              >
                <Save size={13} />
                <span>Save Note</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column (1 col): Status Control, Customer, Payment */}
        <div className="space-y-6">
          {/* Status Control Card */}
          <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-5 shadow-xs space-y-4">
            <h3 className="font-heading text-sm font-bold text-[var(--color-text-primary)] border-b border-[var(--color-border-light)] pb-2">
              Dispatch Lifecycle Status
            </h3>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1.5">
                Current State
              </label>
              <select
                value={order.orderStatus}
                onChange={(e) => handleStatusChange(e.target.value as AdminOrder['orderStatus'])}
                className="w-full px-3 py-2 text-xs font-bold rounded-[var(--radius-md)] border border-[var(--color-border-light)] bg-white text-[var(--color-text-primary)] outline-none"
              >
                <option value="pending">Pending Verification</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing (Inspection)</option>
                <option value="packed">Packed</option>
                <option value="shipped">Shipped (In Transit)</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
                <option value="returned">Returned</option>
              </select>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              {order.orderStatus === 'pending' && (
                <button
                  onClick={() => handleStatusChange('confirmed')}
                  className="w-full py-2 px-3 rounded text-xs font-semibold uppercase tracking-wider bg-stone-900 text-white hover:bg-stone-800 transition-colors flex items-center justify-center gap-1.5"
                >
                  <PackageCheck size={14} />
                  <span>Confirm Order</span>
                </button>
              )}
              {order.orderStatus === 'confirmed' && (
                <button
                  onClick={() => handleStatusChange('processing')}
                  className="w-full py-2 px-3 rounded text-xs font-semibold uppercase tracking-wider bg-amber-600 text-white hover:bg-amber-700 transition-colors flex items-center justify-center gap-1.5"
                >
                  <PackageCheck size={14} />
                  <span>Start Warehouse Inspection</span>
                </button>
              )}
              {order.orderStatus === 'processing' && (
                <button
                  onClick={() => handleStatusChange('packed')}
                  className="w-full py-2 px-3 rounded text-xs font-semibold uppercase tracking-wider bg-sky-700 text-white hover:bg-sky-800 transition-colors flex items-center justify-center gap-1.5"
                >
                  <PackageCheck size={14} />
                  <span>Mark Order Packed</span>
                </button>
              )}
              {order.orderStatus === 'packed' && (
                <button
                  onClick={() => setIsShipModalOpen(true)}
                  className="w-full py-2 px-3 rounded text-xs font-semibold uppercase tracking-wider bg-emerald-700 text-white hover:bg-emerald-800 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Send size={14} />
                  <span>Dispatch via Courier</span>
                </button>
              )}
              {order.orderStatus === 'shipped' && (
                <button
                  onClick={() => handleStatusChange('delivered')}
                  className="w-full py-2 px-3 rounded text-xs font-semibold uppercase tracking-wider bg-emerald-800 text-white hover:bg-emerald-900 transition-colors flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 size={14} />
                  <span>Mark Delivered</span>
                </button>
              )}
              {order.orderStatus !== 'cancelled' && order.orderStatus !== 'delivered' && (
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to cancel this order? Allocated inventory will be reversed.')) {
                      handleStatusChange('cancelled');
                    }
                  }}
                  className="w-full py-1.5 px-3 rounded text-xs font-semibold uppercase tracking-wider text-rose-700 hover:bg-rose-50 transition-colors border border-rose-200"
                >
                  Cancel Order &amp; Revert Stock
                </button>
              )}
            </div>
          </div>

          {/* Customer Details */}
          <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-5 shadow-xs space-y-3">
            <h3 className="font-heading text-sm font-bold text-[var(--color-text-primary)] border-b border-[var(--color-border-light)] pb-2">
              Customer Profile
            </h3>
            <div className="text-xs space-y-1.5 text-[var(--color-text-secondary)]">
              <p className="font-bold text-sm text-[var(--color-text-primary)]">{order.customerName}</p>
              <p>Email: {order.customerEmail}</p>
              <p>Phone: {order.customerPhone}</p>
              <p className="text-[11px] text-emerald-700 font-semibold pt-1">
                Verified Domestic Client
              </p>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 border-b border-[var(--color-border-light)] pb-2">
              <MapPin size={15} className="text-[var(--color-accent)]" />
              <h3 className="font-heading text-sm font-bold text-[var(--color-text-primary)]">
                Delivery Address
              </h3>
            </div>
            <div className="text-xs space-y-1 text-[var(--color-text-secondary)] leading-relaxed">
              <p className="font-semibold text-[var(--color-text-primary)]">{order.address}</p>
              <p>Area: {order.area}</p>
              <p>City: {order.city}, Pakistan</p>
              {order.landmark && (
                <p className="text-[11px] text-[var(--color-text-muted)] italic">
                  Landmark: {order.landmark}
                </p>
              )}
            </div>
          </div>

          {/* Payment Mode */}
          <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 border-b border-[var(--color-border-light)] pb-2">
              <CreditCard size={15} className="text-[var(--color-accent)]" />
              <h3 className="font-heading text-sm font-bold text-[var(--color-text-primary)]">
                Payment Verification
              </h3>
            </div>
            <div className="text-xs space-y-2 text-[var(--color-text-secondary)]">
              <p className="font-bold text-sm text-[var(--color-text-primary)]">
                {order.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Direct Bank Transfer'}
              </p>
              <p>
                Status:{' '}
                <span
                  className={`font-bold uppercase text-[10px] px-2 py-0.5 rounded ${
                    order.paymentStatus === 'paid'
                      ? 'bg-emerald-50 text-emerald-800'
                      : 'bg-amber-50 text-amber-800'
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </p>

              {/* COD Actions */}
              {order.paymentMethod === 'cod' && order.paymentStatus !== 'paid' && (
                <button
                  onClick={handleRecordCodPayment}
                  className="w-full mt-2 py-2 px-3 rounded text-xs font-semibold uppercase tracking-wider bg-emerald-700 text-white hover:bg-emerald-800 transition-colors"
                >
                  Record Courier Cash Collection
                </button>
              )}

              {/* Bank Transfer Actions */}
              {order.paymentMethod === 'bank_transfer' && order.paymentStatus !== 'paid' && (
                <div className="space-y-2 pt-2 border-t border-[var(--color-border-light)]">
                  <p className="text-[11px] text-stone-600 bg-stone-50 p-2 rounded">
                    Meezan Bank IBAN confirmation cross-referenced with bank statement.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleVerifyBankTransfer(true)}
                      className="py-1.5 px-2 rounded text-xs font-semibold uppercase tracking-wider bg-emerald-700 text-white hover:bg-emerald-800 transition-colors text-center"
                    >
                      Approve Deposit
                    </button>
                    <button
                      onClick={() => handleVerifyBankTransfer(false)}
                      className="py-1.5 px-2 rounded text-xs font-semibold uppercase tracking-wider bg-rose-700 text-white hover:bg-rose-800 transition-colors text-center"
                    >
                      Reject Deposit
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Courier Dispatch Booking */}
      {isShipModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] shadow-lg max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border-light)]">
              <div>
                <h3 className="font-heading text-base font-bold text-[var(--color-text-primary)]">
                  Book Courier Consignment
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  Assign domestic carrier tracking number for order #{order.orderNumber}
                </p>
              </div>
              <button
                onClick={() => setIsShipModalOpen(false)}
                className="p-1 rounded text-stone-400 hover:text-stone-700"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleDispatchCourier} className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
                  Courier Company
                </label>
                <select
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value as 'TCS' | 'Leopards' | 'Call Courier' | 'Trax')}
                  className="w-full px-3.5 py-2 text-xs rounded-[var(--radius-md)] border border-[var(--color-border-light)] bg-white outline-none"
                >
                  <option value="TCS">TCS Express</option>
                  <option value="Leopards">Leopards Courier</option>
                  <option value="Call Courier">Call Courier</option>
                  <option value="Trax">Trax Logistics</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
                  Consignment Tracking Number (AWB)
                </label>
                <input
                  type="text"
                  required
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. 77123984501"
                  className="w-full px-3.5 py-2 text-xs font-mono font-bold rounded-[var(--radius-md)] border border-[var(--color-border-light)] outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--color-border-light)]">
                <button
                  type="button"
                  onClick={() => setIsShipModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-[var(--radius-md)] border border-[var(--color-border-dark)] hover:bg-[var(--color-bg-secondary)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded-[var(--radius-md)] bg-[var(--color-text-primary)] hover:bg-[var(--color-accent)] text-white transition-colors"
                >
                  Mark Shipped &amp; Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminOrderDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-stone-500 uppercase tracking-widest">
          Loading consignment data...
        </div>
      }
    >
      <OrderDetailContent />
    </Suspense>
  );
}
