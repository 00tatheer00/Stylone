'use client';

import { useState } from 'react';
import { AdminPageHeader } from '@/components/admin';
import { adminInventory, AdminInventoryItem, adminSuppliers } from '@/data/admin-demo';
import { formatPKR } from '@/lib/utils';
import { receiveStockAction, adjustStockAction } from '@/actions/inventory';
import {
  Plus,
  Minus,
  CheckCircle2,
  Search,
  PackagePlus,
  ShieldCheck,
  X,
} from 'lucide-react';

export default function AdminInventoryPage() {
  const [inventoryList, setInventoryList] = useState<AdminInventoryItem[]>(adminInventory);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAdjustOpen, setIsAdjustOpen] = useState(false);
  const [isReceiveOpen, setIsReceiveOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AdminInventoryItem | null>(null);

  // Stock Adjustment State
  const [adjustData, setAdjustData] = useState({
    reason: 'Physical Count Reconciliation',
    quantity: 5,
    type: 'add' as 'add' | 'subtract',
    notes: 'Weekly warehouse physical inventory audit verification.',
  });

  // Stock Receiving State
  const [receiveData, setReceiveData] = useState({
    productId: inventoryList[0]?.productId || 'prod-01',
    supplierId: adminSuppliers[0]?.id || 'sup-01',
    quantity: 50,
    batchNumber: 'STY-2026-B9',
    expiryDate: '2028-12-31',
    notes: 'Physical intake inspection completed at STYLONE Lahore central facility.',
  });

  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Summary Metrics
  const totalUnits = inventoryList.reduce((acc, it) => acc + it.currentStock, 0);
  const totalValuation = inventoryList.reduce((acc, it) => acc + it.currentStock * it.costPrice, 0);
  const lowStockCount = inventoryList.filter((it) => it.status === 'low_stock').length;
  const outOfStockCount = inventoryList.filter((it) => it.status === 'out_of_stock').length;

  const filteredItems = inventoryList.filter((it) => {
    const matchesSearch =
      it.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      it.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      it.batchNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || it.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const openAdjustment = (item: AdminInventoryItem) => {
    setSelectedItem(item);
    setAdjustData({
      reason: 'Physical Count Reconciliation',
      quantity: 5,
      type: 'add',
      notes: `Adjustment for batch ${item.batchNumber}`,
    });
    setIsAdjustOpen(true);
  };

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    const diff = adjustData.type === 'add' ? adjustData.quantity : -adjustData.quantity;
    const newStock = Math.max(0, selectedItem.currentStock + diff);

    setInventoryList((prev) =>
      prev.map((it) => {
        if (it.id === selectedItem.id) {
          const newStatus =
            newStock === 0
              ? 'out_of_stock'
              : newStock <= it.lowStockThreshold
              ? 'low_stock'
              : 'in_stock';
          return {
            ...it,
            currentStock: newStock,
            status: newStatus,
            lastMovement: `Adjusted (${diff > 0 ? '+' : ''}${diff} units: ${adjustData.reason})`,
          };
        }
        return it;
      })
    );

    // Call server action
    try {
      const fd = new FormData();
      fd.append('productId', selectedItem.productId);
      fd.append('quantityChange', String(diff));
      fd.append('movementType', diff < 0 ? 'damaged' : 'stock_adjustment');
      fd.append('notes', adjustData.notes);
      const res = await adjustStockAction(fd);
      setFeedbackMsg(
        res.message ||
        res.error ||
        `Inventory adjusted: ${selectedItem.productName} updated by ${diff > 0 ? '+' : ''}${diff} units.`
      );
    } catch {
      setFeedbackMsg(
        `Inventory adjusted: ${selectedItem.productName} updated by ${diff > 0 ? '+' : ''}${diff} units (Demo State).`
      );
    }

    setTimeout(() => setFeedbackMsg(null), 3500);
    setIsAdjustOpen(false);
  };

  const handleReceiveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetItem = inventoryList.find((it) => it.productId === receiveData.productId) || inventoryList[0];

    // Optimistic UI update
    setInventoryList((prev) =>
      prev.map((it) => {
        if (it.productId === targetItem.productId) {
          const newStock = it.currentStock + receiveData.quantity;
          return {
            ...it,
            currentStock: newStock,
            batchNumber: receiveData.batchNumber,
            expiryDate: receiveData.expiryDate,
            status: 'in_stock',
            lastMovement: `Received (+${receiveData.quantity} units, Batch: ${receiveData.batchNumber})`,
          };
        }
        return it;
      })
    );

    try {
      const fd = new FormData();
      fd.append('productId', receiveData.productId);
      fd.append('supplierId', receiveData.supplierId);
      fd.append('quantity', String(receiveData.quantity));
      fd.append('batchNumber', receiveData.batchNumber);
      fd.append('expiryDate', receiveData.expiryDate);
      fd.append('notes', receiveData.notes);
      const res = await receiveStockAction(fd);
      setFeedbackMsg(
        res.message ||
        res.error ||
        `Consignment received: ${receiveData.quantity} units added.`
      );
    } catch {
      setFeedbackMsg(
        `Consignment received: ${receiveData.quantity} units added to ${targetItem.productName} (Batch: ${receiveData.batchNumber}).`
      );
    }

    setTimeout(() => setFeedbackMsg(null), 4000);
    setIsReceiveOpen(false);
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Central Inventory &amp; Stock Control"
        subtitle="STYLONE central distribution hub inventory levels, batch expiration and quality control tracking."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Inventory' }]}
        actions={
          <button
            onClick={() => setIsReceiveOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-[var(--radius-md)] bg-[var(--color-text-primary)] hover:bg-[var(--color-accent)] text-white transition-colors"
          >
            <PackagePlus size={15} />
            <span>Receive Consignment</span>
          </button>
        }
      />

      {feedbackMsg && (
        <div className="p-4 rounded-[var(--radius-md)] bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{feedbackMsg}</p>
        </div>
      )}

      {/* 4 Inventory Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-[var(--radius-lg)] border border-[var(--color-border-light)] shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
            Total Inventory Units
          </span>
          <p className="font-heading text-2xl font-bold text-[var(--color-text-primary)] mt-1">
            {totalUnits} Units
          </p>
          <p className="text-[11px] text-[var(--color-text-muted)] mt-1">Across master catalogue SKUs</p>
        </div>

        <div className="bg-white p-5 rounded-[var(--radius-lg)] border border-[var(--color-border-light)] shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
            Inventory Valuation (At Cost)
          </span>
          <p className="font-heading text-2xl font-bold text-[var(--color-text-primary)] mt-1">
            {formatPKR(totalValuation)}
          </p>
          <p className="text-[11px] text-[var(--color-text-muted)] mt-1">Confidential internal purchase valuation</p>
        </div>

        <div className="bg-white p-5 rounded-[var(--radius-lg)] border border-[var(--color-border-light)] shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
            Low Stock SKUs
          </span>
          <p className="font-heading text-2xl font-bold text-amber-700 mt-1">
            {lowStockCount} Items
          </p>
          <p className="text-[11px] text-[var(--color-text-muted)] mt-1">At or below reorder threshold</p>
        </div>

        <div className="bg-white p-5 rounded-[var(--radius-lg)] border border-[var(--color-border-light)] shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
            Stock Out Warnings
          </span>
          <p className="font-heading text-2xl font-bold text-rose-700 mt-1">
            {outOfStockCount} Items
          </p>
          <p className="text-[11px] text-[var(--color-text-muted)] mt-1">Zero units remaining in distribution hub</p>
        </div>
      </div>

      {/* Strict Quality Inspection Advisory */}
      <div className="p-4 rounded-[var(--radius-lg)] bg-stone-900 text-white text-xs flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-start md:items-center gap-3">
          <ShieldCheck size={20} className="text-[var(--color-accent)] shrink-0 mt-0.5 md:mt-0" />
          <p className="leading-relaxed">
            <strong className="text-[var(--color-accent)] font-semibold uppercase tracking-wide">STYLONE Intake Mandate:</strong>{' '}
            All supplier consignments must be physically received, unboxed, batch-authenticated and shelf-life verified before stock becomes active. No drop-shipping allowed.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <input
            type="text"
            placeholder="Search SKU, batch, product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-[var(--radius-md)] border border-[var(--color-border-light)] outline-none focus:border-[var(--color-accent)]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-[var(--color-text-secondary)]">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-[var(--radius-md)] border border-[var(--color-border-light)] bg-white outline-none"
          >
            <option value="All">All Inventory</option>
            <option value="in_stock">In Stock</option>
            <option value="low_stock">Low Stock (Reorder)</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[var(--color-text-secondary)]">
            <thead className="bg-[var(--color-bg-secondary)]/50 text-[var(--color-text-primary)] font-semibold uppercase tracking-wider text-[10px] border-b border-[var(--color-border-light)]">
              <tr>
                <th className="py-3 px-4">Cosmetic Item</th>
                <th className="py-3 px-4">SKU / Batch</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Unit Cost</th>
                <th className="py-3 px-4 text-center">Current Stock</th>
                <th className="py-3 px-4 text-center">Batch Expiry</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-light)] font-normal">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-[var(--color-bg-primary)]/40 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-semibold text-[var(--color-text-primary)]">{item.productName}</p>
                    <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">{item.lastMovement}</p>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px]">
                    <span className="text-stone-900 font-medium">{item.sku}</span>
                    <span className="block text-[10px] text-[var(--color-text-muted)]">Batch: {item.batchNumber}</span>
                  </td>
                  <td className="py-3 px-4">{item.category}</td>
                  <td className="py-3 px-4 text-right font-medium text-stone-900">
                    {formatPKR(item.costPrice)}
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-stone-900">
                    {item.currentStock}
                  </td>
                  <td className="py-3 px-4 text-center text-[11px] text-stone-700">
                    {item.expiryDate}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        item.status === 'in_stock'
                          ? 'bg-emerald-50 text-emerald-800'
                          : item.status === 'low_stock'
                          ? 'bg-amber-50 text-amber-800'
                          : 'bg-rose-50 text-rose-800'
                      }`}
                    >
                      {item.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => openAdjustment(item)}
                      className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded border border-[var(--color-border-dark)] bg-white hover:bg-[var(--color-bg-secondary)]"
                    >
                      Adjust
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Physical Stock Receiving Consignment */}
      {isReceiveOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] shadow-lg max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border-light)]">
              <div>
                <h3 className="font-heading text-base font-bold text-[var(--color-text-primary)]">
                  Receive Stock Consignment
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  Physical warehouse intake &amp; QC verification protocol
                </p>
              </div>
              <button
                onClick={() => setIsReceiveOpen(false)}
                className="p-1 rounded text-stone-400 hover:text-stone-700"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleReceiveSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
                  Product Formulation
                </label>
                <select
                  value={receiveData.productId}
                  onChange={(e) => setReceiveData({ ...receiveData, productId: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-[var(--radius-md)] border border-[var(--color-border-light)] bg-white outline-none"
                >
                  {inventoryList.map((it) => (
                    <option key={it.productId} value={it.productId}>
                      {it.productName} ({it.sku})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
                    Approved Supplier
                  </label>
                  <select
                    value={receiveData.supplierId}
                    onChange={(e) => setReceiveData({ ...receiveData, supplierId: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-[var(--radius-md)] border border-[var(--color-border-light)] bg-white outline-none"
                  >
                    {adminSuppliers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
                    Quantity Received
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={receiveData.quantity}
                    onChange={(e) => setReceiveData({ ...receiveData, quantity: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 text-xs font-bold rounded-[var(--radius-md)] border border-[var(--color-border-light)] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
                    Batch Number
                  </label>
                  <input
                    type="text"
                    required
                    value={receiveData.batchNumber}
                    onChange={(e) => setReceiveData({ ...receiveData, batchNumber: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-[var(--radius-md)] border border-[var(--color-border-light)] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
                    Shelf Life / Expiry Date
                  </label>
                  <input
                    type="date"
                    required
                    value={receiveData.expiryDate}
                    onChange={(e) => setReceiveData({ ...receiveData, expiryDate: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-[var(--radius-md)] border border-[var(--color-border-light)] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
                  Intake QC &amp; Physical Verification Notes
                </label>
                <input
                  type="text"
                  value={receiveData.notes}
                  onChange={(e) => setReceiveData({ ...receiveData, notes: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-[var(--radius-md)] border border-[var(--color-border-light)] outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--color-border-light)]">
                <button
                  type="button"
                  onClick={() => setIsReceiveOpen(false)}
                  className="px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-[var(--radius-md)] border border-[var(--color-border-dark)] hover:bg-[var(--color-bg-secondary)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded-[var(--radius-md)] bg-[var(--color-text-primary)] hover:bg-[var(--color-accent)] text-white transition-colors"
                >
                  Confirm Physical Intake
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Physical Stock Adjustment */}
      {isAdjustOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] shadow-lg max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border-light)]">
              <div>
                <h3 className="font-heading text-base font-bold text-[var(--color-text-primary)]">
                  Adjust Inventory
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  {selectedItem.productName} ({selectedItem.sku})
                </p>
              </div>
              <button
                onClick={() => setIsAdjustOpen(false)}
                className="p-1 rounded text-stone-400 hover:text-stone-700"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAdjustSubmit} className="space-y-4 text-xs">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setAdjustData({ ...adjustData, type: 'add' })}
                  className={`flex-1 py-2 rounded text-xs font-semibold flex items-center justify-center gap-1.5 border ${
                    adjustData.type === 'add'
                      ? 'border-[var(--color-accent)] bg-stone-900 text-[var(--color-accent)]'
                      : 'border-[var(--color-border-light)] bg-white text-stone-700'
                  }`}
                >
                  <Plus size={14} />
                  <span>Increase (+)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAdjustData({ ...adjustData, type: 'subtract' })}
                  className={`flex-1 py-2 rounded text-xs font-semibold flex items-center justify-center gap-1.5 border ${
                    adjustData.type === 'subtract'
                      ? 'border-rose-600 bg-rose-50 text-rose-800'
                      : 'border-[var(--color-border-light)] bg-white text-stone-700'
                  }`}
                >
                  <Minus size={14} />
                  <span>Decrease / Damage (-)</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
                  Quantity Adjustment
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  value={adjustData.quantity}
                  onChange={(e) => setAdjustData({ ...adjustData, quantity: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 text-xs font-bold rounded-[var(--radius-md)] border border-[var(--color-border-light)] outline-none focus:border-[var(--color-accent)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
                  Reason for Adjustment
                </label>
                <select
                  value={adjustData.reason}
                  onChange={(e) => setAdjustData({ ...adjustData, reason: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-[var(--radius-md)] border border-[var(--color-border-light)] bg-white outline-none"
                >
                  <option value="Physical Count Reconciliation">Physical Count Reconciliation</option>
                  <option value="Supplier Receiving Verification">Supplier Receiving Verification</option>
                  <option value="Damaged / Inspection Rejection">Damaged / Inspection Rejection</option>
                  <option value="Expired Batch Removal">Expired Batch Removal</option>
                  <option value="Customer Return Restock">Customer Return Restock</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
                  Auditor Notes
                </label>
                <input
                  type="text"
                  value={adjustData.notes}
                  onChange={(e) => setAdjustData({ ...adjustData, notes: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-[var(--radius-md)] border border-[var(--color-border-light)] outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--color-border-light)]">
                <button
                  type="button"
                  onClick={() => setIsAdjustOpen(false)}
                  className="px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-[var(--radius-md)] border border-[var(--color-border-dark)] hover:bg-[var(--color-bg-secondary)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded-[var(--radius-md)] bg-[var(--color-text-primary)] hover:bg-[var(--color-accent)] text-white transition-colors"
                >
                  Apply Reconciliation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
