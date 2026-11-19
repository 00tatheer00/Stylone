'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AdminProduct } from '@/data/admin-demo';
import { ArrowLeft, Save, CheckCircle2 } from 'lucide-react';
import { formatPKR } from '@/lib/utils';
import { createProductAction } from '@/actions/products';

interface ProductFormProps {
  initialData?: AdminProduct;
  isEdit?: boolean;
}

export function ProductForm({ initialData, isEdit = false }: ProductFormProps) {

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    sku: initialData?.sku || 'STY-SKN-',
    brand: initialData?.brand || 'LUMIÈRE',
    category: initialData?.category || 'Skincare',
    description: 'A luxurious active formulation designed for radiance and deep hydration in the Pakistani climate.',
    regularPrice: initialData?.regularPrice || 3500,
    salePrice: initialData?.salePrice || 0,
    costPrice: initialData?.costPrice || 1600,
    stockQuantity: initialData?.stockQuantity || 25,
    lowStockThreshold: initialData?.lowStockThreshold || 10,
    sourceType: initialData?.sourceType || 'Own',
    supplierName: initialData?.supplierName || '',
    status: initialData?.status || 'active',
    image: initialData?.image || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80',
    batchNumber: initialData?.batchNumber || 'STY-2026-B1',
    expiryDate: initialData?.expiryDate || '2028-12-31',
    skinType: 'All Skin Types, particularly dehydrated skin',
    ingredients: 'Aqua, Ascorbic Acid (15%), Hyaluronic Acid, Tocopherol, Ferulic Acid, Botanical Extracts.',
    usageInstructions: 'Apply 3-4 drops morning and night on clean face and neck before moisturizer.',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Profit Margin preview
  const estimatedProfit = formData.regularPrice - formData.costPrice;
  const marginPercent =
    formData.regularPrice > 0 ? Math.round((estimatedProfit / formData.regularPrice) * 100) : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('slug', formData.slug);
      data.append('sku', formData.sku);
      data.append('brand', formData.brand);
      data.append('regularPrice', String(formData.regularPrice));
      data.append('costPrice', String(formData.costPrice));
      if (formData.salePrice) data.append('salePrice', String(formData.salePrice));
      data.append('stockQuantity', String(formData.stockQuantity));
      data.append('sourceType', formData.sourceType);
      data.append('status', formData.status);
      data.append('description', formData.description);
      data.append('image', formData.image);
      data.append('batchNumber', formData.batchNumber);
      data.append('expiryDate', formData.expiryDate);

      const res = await createProductAction(data);
      if (res.success) {
        setSuccessMsg(res.message || (isEdit ? 'Product updated.' : 'Product created.'));
      } else {
        setSuccessMsg(res.error || 'Failed to save product.');
      }
    } catch (err: unknown) {
      setSuccessMsg((err as Error).message || 'An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Top action header */}
      <div className="flex items-center justify-between pb-4 border-b border-[var(--color-border-light)]">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Product List</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-[var(--radius-md)] border border-[var(--color-border-dark)] hover:bg-[var(--color-bg-secondary)]"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-[var(--radius-md)] bg-[var(--color-text-primary)] hover:bg-[var(--color-accent)] text-white text-xs uppercase tracking-wider font-semibold transition-colors disabled:opacity-50"
          >
            <Save size={14} />
            <span>{isSubmitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Product'}</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-[var(--radius-md)] bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{successMsg}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Master Information (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Essential Details */}
          <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-6 shadow-xs space-y-4">
            <h3 className="font-heading text-base font-bold text-[var(--color-text-primary)] border-b border-[var(--color-border-light)] pb-2">
              Master Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
                  Product Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Vitamin C Brightening Serum"
                  className="w-full px-3.5 py-2 text-xs rounded-[var(--radius-md)] border border-[var(--color-border-light)] outline-none focus:border-[var(--color-accent)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
                  Brand / Maison <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  placeholder="e.g. LUMIÈRE"
                  className="w-full px-3.5 py-2 text-xs rounded-[var(--radius-md)] border border-[var(--color-border-light)] outline-none focus:border-[var(--color-accent)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
                  SKU Code <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  placeholder="STY-SKN-001"
                  className="w-full px-3.5 py-2 text-xs font-mono rounded-[var(--radius-md)] border border-[var(--color-border-light)] outline-none focus:border-[var(--color-accent)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-[var(--radius-md)] border border-[var(--color-border-light)] bg-white outline-none focus:border-[var(--color-accent)]"
                >
                  <option value="Skincare">Skincare</option>
                  <option value="Makeup">Makeup</option>
                  <option value="Haircare">Haircare</option>
                  <option value="Beauty Accessories">Beauty Accessories</option>
                  <option value="Personal Care">Personal Care</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
                Editorial Description
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-[var(--radius-md)] border border-[var(--color-border-light)] outline-none focus:border-[var(--color-accent)] leading-relaxed"
              />
            </div>
          </div>

          {/* Card 2: Cosmetics & Formulation Attributes */}
          <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-6 shadow-xs space-y-4">
            <h3 className="font-heading text-base font-bold text-[var(--color-text-primary)] border-b border-[var(--color-border-light)] pb-2">
              Formulation &amp; Ingredients Details
            </h3>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
                Skin Type Compatibility
              </label>
              <input
                type="text"
                value={formData.skinType}
                onChange={(e) => setFormData({ ...formData, skinType: e.target.value })}
                placeholder="e.g. Sensitive, All Skin Types"
                className="w-full px-3.5 py-2 text-xs rounded-[var(--radius-md)] border border-[var(--color-border-light)] outline-none focus:border-[var(--color-accent)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
                Ingredients (INCI List)
              </label>
              <textarea
                rows={3}
                value={formData.ingredients}
                onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-[var(--radius-md)] border border-[var(--color-border-light)] outline-none focus:border-[var(--color-accent)] font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
                Usage Instructions
              </label>
              <input
                type="text"
                value={formData.usageInstructions}
                onChange={(e) => setFormData({ ...formData, usageInstructions: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-[var(--radius-md)] border border-[var(--color-border-light)] outline-none focus:border-[var(--color-accent)]"
              />
            </div>
          </div>

          {/* Card 3: Batch & Expiry Tracking */}
          <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-6 shadow-xs space-y-4">
            <h3 className="font-heading text-base font-bold text-[var(--color-text-primary)] border-b border-[var(--color-border-light)] pb-2">
              Quality Assurance &amp; Expiry
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
                  Inspection Batch Number
                </label>
                <input
                  type="text"
                  value={formData.batchNumber}
                  onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                  placeholder="LUM-2026-B1"
                  className="w-full px-3.5 py-2 text-xs font-mono rounded-[var(--radius-md)] border border-[var(--color-border-light)] outline-none focus:border-[var(--color-accent)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
                  Expiration Date
                </label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-[var(--radius-md)] border border-[var(--color-border-light)] outline-none focus:border-[var(--color-accent)]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing, Inventory & Sourcing (1 col) */}
        <div className="space-y-6">
          {/* Status card */}
          <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-5 shadow-xs space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)]">
              Catalogue Visibility
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'draft' | 'archived' })}
              className="w-full px-3.5 py-2 text-xs font-semibold rounded-[var(--radius-md)] border border-[var(--color-border-light)] bg-white text-[var(--color-text-primary)] outline-none"
            >
              <option value="active">Active (Visible in Boutique)</option>
              <option value="draft">Draft (Hidden)</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Pricing Card (strictly internal purchase cost) */}
          <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--color-border-light)] pb-2">
              <h3 className="font-heading text-sm font-bold text-[var(--color-text-primary)]">
                Pricing &amp; Margins (PKR)
              </h3>
              <span className="text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded font-semibold">
                Confidential
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
                Retail Price (PKR) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                value={formData.regularPrice}
                onChange={(e) => setFormData({ ...formData, regularPrice: Number(e.target.value) })}
                className="w-full px-3.5 py-2 text-xs font-bold rounded-[var(--radius-md)] border border-[var(--color-border-light)] outline-none focus:border-[var(--color-accent)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
                Sale Price (Optional)
              </label>
              <input
                type="number"
                value={formData.salePrice || ''}
                onChange={(e) => setFormData({ ...formData, salePrice: Number(e.target.value) })}
                placeholder="Leave blank for regular price"
                className="w-full px-3.5 py-2 text-xs rounded-[var(--radius-md)] border border-[var(--color-border-light)] outline-none focus:border-[var(--color-accent)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
                Purchase Cost (Cost of Goods)
              </label>
              <input
                type="number"
                required
                value={formData.costPrice}
                onChange={(e) => setFormData({ ...formData, costPrice: Number(e.target.value) })}
                className="w-full px-3.5 py-2 text-xs font-mono rounded-[var(--radius-md)] border border-[var(--color-border-light)] outline-none focus:border-[var(--color-accent)]"
              />
              <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">
                Strictly internal. Never exposed to clients.
              </p>
            </div>

            <div className="p-3 rounded-[var(--radius-md)] bg-[var(--color-bg-primary)] text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Gross Margin:</span>
                <span className="font-bold text-emerald-700">{formatPKR(estimatedProfit)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Margin %:</span>
                <span className="font-bold text-emerald-700">{marginPercent}%</span>
              </div>
            </div>
          </div>

          {/* Sourcing & Procurement */}
          <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-5 shadow-xs space-y-4">
            <h3 className="font-heading text-sm font-bold text-[var(--color-text-primary)] border-b border-[var(--color-border-light)] pb-2">
              Sourcing &amp; Supplier
            </h3>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
                Source Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, sourceType: 'Own' })}
                  className={`py-2 text-xs font-semibold rounded-[var(--radius-md)] border transition-colors ${
                    formData.sourceType === 'Own'
                      ? 'border-[var(--color-text-primary)] bg-[var(--color-text-primary)] text-white'
                      : 'border-[var(--color-border-light)] bg-white text-[var(--color-text-secondary)]'
                  }`}
                >
                  STYLONE Owned
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, sourceType: 'Supplier' })}
                  className={`py-2 text-xs font-semibold rounded-[var(--radius-md)] border transition-colors ${
                    formData.sourceType === 'Supplier'
                      ? 'border-[var(--color-text-primary)] bg-[var(--color-text-primary)] text-white'
                      : 'border-[var(--color-border-light)] bg-white text-[var(--color-text-secondary)]'
                  }`}
                >
                  Supplier Sourced
                </button>
              </div>
            </div>

            {formData.sourceType === 'Supplier' && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
                  Assigned Supplier
                </label>
                <select
                  value={formData.supplierName}
                  onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-[var(--radius-md)] border border-[var(--color-border-light)] bg-white outline-none"
                >
                  <option value="">Select Supplier</option>
                  <option value="DermaCos Pak Ltd">DermaCos Pak Ltd (Lahore)</option>
                  <option value="PureHerb Botanicals Lahore">PureHerb Botanicals (Lahore)</option>
                  <option value="Glamour Imports Karachi">Glamour Imports (Karachi)</option>
                  <option value="Luxe Precision Brushes Sialkot">Luxe Precision (Sialkot)</option>
                </select>
                <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">
                  All supplier items must be physically inspected at STYLONE hub prior to dispatch.
                </p>
              </div>
            )}
          </div>

          {/* Stock Levels */}
          <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-5 shadow-xs space-y-4">
            <h3 className="font-heading text-sm font-bold text-[var(--color-text-primary)] border-b border-[var(--color-border-light)] pb-2">
              Stock Parameters
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
                  In Stock Units
                </label>
                <input
                  type="number"
                  value={formData.stockQuantity}
                  onChange={(e) => setFormData({ ...formData, stockQuantity: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 text-xs rounded-[var(--radius-md)] border border-[var(--color-border-light)] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
                  Alert Level
                </label>
                <input
                  type="number"
                  value={formData.lowStockThreshold}
                  onChange={(e) => setFormData({ ...formData, lowStockThreshold: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 text-xs rounded-[var(--radius-md)] border border-[var(--color-border-light)] outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
