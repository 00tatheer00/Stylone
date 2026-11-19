'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AdminPageHeader } from '@/components/admin';
import { adminProducts, AdminProduct } from '@/data/admin-demo';
import { formatPKR } from '@/lib/utils';
import { archiveProductAction } from '@/actions/products';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Layers,
} from 'lucide-react';

export default function AdminProductsPage() {
  const [productsList, setProductsList] = useState<AdminProduct[]>(adminProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStock, setSelectedStock] = useState('All');
  const [selectedSource, setSelectedSource] = useState('All');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock'>('name');

  const categories = ['All', 'Skincare', 'Makeup', 'Haircare', 'Beauty Accessories', 'Personal Care'];

  // Filter & Search Logic
  const filteredProducts = productsList.filter((prod) => {
    const matchesSearch =
      prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.brand.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || prod.category === selectedCategory;

    const matchesSource = selectedSource === 'All' || prod.sourceType === selectedSource;

    const matchesStock =
      selectedStock === 'All' ||
      (selectedStock === 'In Stock' && prod.stockQuantity > prod.lowStockThreshold) ||
      (selectedStock === 'Low Stock' &&
        prod.stockQuantity <= prod.lowStockThreshold &&
        prod.stockQuantity > 0) ||
      (selectedStock === 'Out of Stock' && prod.stockQuantity === 0);

    return matchesSearch && matchesCategory && matchesSource && matchesStock;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price') return b.regularPrice - a.regularPrice;
    if (sortBy === 'stock') return b.stockQuantity - a.stockQuantity;
    return a.name.localeCompare(b.name);
  });

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to archive product "${name}"?`)) {
      setProductsList((prev) => prev.filter((p) => p.id !== id));
      try {
        await archiveProductAction(id);
      } catch {
        // Optimistic UI
      }
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Product Catalogue Management"
        subtitle="Manage master formulations, inventory batches, purchase costs and pricing."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Products' }]}
        actions={
          <div className="flex items-center gap-3">
            <Link
              href="/admin/categories"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] border border-[var(--color-border-dark)] bg-white text-xs uppercase tracking-wider font-semibold text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] transition-colors"
            >
              <Layers size={14} />
              <span>Categories</span>
            </Link>
            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] bg-[var(--color-text-primary)] hover:bg-[var(--color-accent)] text-white text-xs uppercase tracking-wider font-semibold transition-colors"
            >
              <Plus size={15} />
              <span>Add New Product</span>
            </Link>
          </div>
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
              placeholder="Search by product name, SKU or brand..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-[var(--radius-md)] border border-[var(--color-border-light)] outline-none focus:border-[var(--color-accent)]"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Category */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 text-xs rounded-[var(--radius-md)] border border-[var(--color-border-light)] bg-white text-[var(--color-text-primary)] outline-none"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? 'All Categories' : c}
                </option>
              ))}
            </select>

            {/* Source */}
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="px-3 py-2 text-xs rounded-[var(--radius-md)] border border-[var(--color-border-light)] bg-white text-[var(--color-text-primary)] outline-none"
            >
              <option value="All">All Sources</option>
              <option value="Own">STYLONE Owned</option>
              <option value="Supplier">Supplier Sourced</option>
            </select>

            {/* Stock status */}
            <select
              value={selectedStock}
              onChange={(e) => setSelectedStock(e.target.value)}
              className="px-3 py-2 text-xs rounded-[var(--radius-md)] border border-[var(--color-border-light)] bg-white text-[var(--color-text-primary)] outline-none"
            >
              <option value="All">All Stock Levels</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'stock')}
              className="px-3 py-2 text-xs rounded-[var(--radius-md)] border border-[var(--color-border-light)] bg-white text-[var(--color-text-primary)] outline-none"
            >
              <option value="name">Sort: Name (A-Z)</option>
              <option value="price">Sort: Price (High-Low)</option>
              <option value="stock">Sort: Stock Volume</option>
            </select>
          </div>
        </div>

        <div className="text-[11px] text-[var(--color-text-muted)] flex items-center justify-between pt-1">
          <span>Showing {sortedProducts.length} of {productsList.length} items</span>
          <span>Confidential Purchase Costs displayed for authorized admin review</span>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] shadow-xs overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-[var(--color-bg-primary)] border-b border-[var(--color-border-light)] text-[10px] uppercase font-bold tracking-wider text-[var(--color-text-secondary)]">
              <tr>
                <th className="py-3 px-4">Product Details</th>
                <th className="py-3 px-4">SKU / Batch</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Source Type</th>
                <th className="py-3 px-4 text-right">Retail Price</th>
                <th className="py-3 px-4 text-right">Purchase Cost</th>
                <th className="py-3 px-4 text-center">Stock</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-light)]">
              {sortedProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-[var(--color-text-muted)]">
                    No products matched your search or filter criteria.
                  </td>
                </tr>
              ) : (
                sortedProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-[var(--color-bg-primary)]/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-12 rounded bg-[var(--color-bg-secondary)] border border-[var(--color-border-light)] overflow-hidden shrink-0">
                          <Image
                            src={prod.image}
                            alt={prod.name}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors">
                            {prod.name}
                          </p>
                          <p className="text-[11px] text-[var(--color-text-muted)]">{prod.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-[var(--color-text-secondary)]">
                      <p>{prod.sku}</p>
                      <p className="text-[10px] text-[var(--color-text-muted)]">{prod.batchNumber || 'N/A'}</p>
                    </td>
                    <td className="py-3 px-4 text-[var(--color-text-secondary)]">{prod.category}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                          prod.sourceType === 'Own'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {prod.sourceType}
                      </span>
                      {prod.supplierName && (
                        <p className="text-[10px] text-[var(--color-text-muted)] truncate max-w-[120px]">
                          {prod.supplierName}
                        </p>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-[var(--color-text-primary)]">
                      {formatPKR(prod.regularPrice)}
                      {prod.salePrice && (
                        <span className="block text-[10px] text-rose-600 font-normal">
                          Sale: {formatPKR(prod.salePrice)}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-stone-600">
                      {formatPKR(prod.costPrice)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          prod.stockQuantity === 0
                            ? 'bg-rose-50 text-rose-700'
                            : prod.stockQuantity <= prod.lowStockThreshold
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        {prod.stockQuantity} units
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700">
                        {prod.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <Link
                          href={`/admin/products/${prod.id}`}
                          className="p-1.5 rounded text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]"
                          aria-label={`Edit ${prod.name}`}
                        >
                          <Edit2 size={14} />
                        </Link>
                        <Link
                          href={`/product/${prod.slug}`}
                          target="_blank"
                          className="p-1.5 rounded text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]"
                          aria-label={`View live ${prod.name}`}
                        >
                          <ExternalLink size={14} />
                        </Link>
                        <button
                          onClick={() => handleDelete(prod.id, prod.name)}
                          className="p-1.5 rounded text-[var(--color-text-secondary)] hover:text-rose-600 hover:bg-rose-50"
                          aria-label={`Delete ${prod.name}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination UI */}
        <div className="p-4 border-t border-[var(--color-border-light)] flex items-center justify-between text-xs text-[var(--color-text-secondary)]">
          <span>Page 1 of 1</span>
          <div className="flex items-center gap-1">
            <button disabled className="px-3 py-1.5 rounded border border-[var(--color-border-light)] text-stone-400 cursor-not-allowed">
              Previous
            </button>
            <button className="px-3 py-1.5 rounded bg-[var(--color-text-primary)] text-white font-bold">
              1
            </button>
            <button disabled className="px-3 py-1.5 rounded border border-[var(--color-border-light)] text-stone-400 cursor-not-allowed">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
