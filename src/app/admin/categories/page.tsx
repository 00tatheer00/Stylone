'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin';
import { adminCategories, AdminCategory } from '@/data/admin-demo';
import { createCategoryAction } from '@/actions/categories';
import { Plus, Edit2, Trash2, ExternalLink } from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>(adminCategories);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80',
    sortOrder: 1,
    isActive: true,
  });

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80',
      sortOrder: categories.length + 1,
      isActive: true,
    });
    setEditingId(null);
    setIsFormOpen(false);
  };

  const handleEdit = (cat: AdminCategory) => {
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      image: cat.image,
      sortOrder: cat.sortOrder,
      isActive: cat.isActive,
    });
    setEditingId(cat.id);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to deactivate category "${name}"?`)) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setCategories((prev) =>
        prev.map((c) => (c.id === editingId ? { ...c, ...formData } : c))
      );
    } else {
      const newCat: AdminCategory = {
        id: `cat-${formData.slug || Date.now()}`,
        productCount: 0,
        ...formData,
      };
      setCategories((prev) => [...prev, newCat]);

      try {
        const data = new FormData();
        data.append('name', formData.name);
        data.append('slug', formData.slug);
        data.append('description', formData.description);
        data.append('image', formData.image);
        data.append('sortOrder', String(formData.sortOrder));
        data.append('isActive', String(formData.isActive));
        await createCategoryAction(data);
      } catch {
        // UI already optimistically updated
      }
    }
    resetForm();
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Category Hierarchy &amp; Taxonomies"
        subtitle="Organize beauty collections, visual thumbnails, slugs and boutique storefront presentation."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Categories' }]}
        actions={
          !isFormOpen && (
            <button
              onClick={() => {
                resetForm();
                setIsFormOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] bg-[var(--color-text-primary)] hover:bg-[var(--color-accent)] text-white text-xs uppercase tracking-wider font-semibold transition-colors"
            >
              <Plus size={15} />
              <span>Add New Category</span>
            </button>
          )
        }
      />

      {/* Add / Edit Form Modal / Inline Card */}
      {isFormOpen && (
        <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-6 shadow-xs animate-in fade-in">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--color-border-light)]">
            <h3 className="font-heading text-base font-bold text-[var(--color-text-primary)]">
              {editingId ? 'Edit Beauty Category' : 'Create New Category'}
            </h3>
            <button
              onClick={resetForm}
              className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] underline"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
                  Category Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                    setFormData({ ...formData, name, slug: editingId ? formData.slug : slug });
                  }}
                  placeholder="e.g. Fragrance &amp; Mist"
                  className="w-full px-3.5 py-2 text-xs rounded-[var(--radius-md)] border border-[var(--color-border-light)] outline-none focus:border-[var(--color-accent)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
                  URL Slug <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="fragrance-mist"
                  className="w-full px-3.5 py-2 text-xs font-mono rounded-[var(--radius-md)] border border-[var(--color-border-light)] outline-none focus:border-[var(--color-accent)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
                  Display Sort Order
                </label>
                <input
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 text-xs rounded-[var(--radius-md)] border border-[var(--color-border-light)] outline-none focus:border-[var(--color-accent)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
                Editorial Description
              </label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Curated selection of luxurious beauty essentials..."
                className="w-full px-3.5 py-2 text-xs rounded-[var(--radius-md)] border border-[var(--color-border-light)] outline-none focus:border-[var(--color-accent)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
                Cover Image URL
              </label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://..."
                className="w-full px-3.5 py-2 text-xs rounded-[var(--radius-md)] border border-[var(--color-border-light)] outline-none focus:border-[var(--color-accent)]"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4 rounded accent-[var(--color-accent)]"
                />
                <span className="text-xs text-[var(--color-text-secondary)]">
                  Active (Visible in boutique header and navigation menu)
                </span>
              </label>
            </div>

            <div className="flex items-center gap-3 pt-3">
              <button
                type="submit"
                className="px-5 py-2 rounded-[var(--radius-md)] bg-[var(--color-text-primary)] hover:bg-[var(--color-accent)] text-white text-xs uppercase tracking-wider font-semibold transition-colors"
              >
                {editingId ? 'Update Category' : 'Save Category'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 rounded-[var(--radius-md)] border border-[var(--color-border-dark)] text-xs uppercase tracking-wider font-semibold hover:bg-[var(--color-bg-secondary)]"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Category List Table */}
      <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] shadow-xs overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-[var(--color-bg-primary)] border-b border-[var(--color-border-light)] text-[10px] uppercase font-bold tracking-wider text-[var(--color-text-secondary)]">
              <tr>
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Slug</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4 text-center">Products</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-light)]">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-[var(--color-bg-primary)]/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-stone-500">#{cat.sortOrder}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-9 h-11 rounded bg-[var(--color-bg-secondary)] border border-[var(--color-border-light)] overflow-hidden shrink-0">
                        <Image
                          src={cat.image}
                          alt={cat.name}
                          fill
                          sizes="36px"
                          className="object-cover"
                        />
                      </div>
                      <span className="font-bold text-[var(--color-text-primary)]">{cat.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-[var(--color-text-secondary)]">
                    /category/{cat.slug}
                  </td>
                  <td className="py-3 px-4 text-[var(--color-text-muted)] max-w-xs truncate">
                    {cat.description}
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-[var(--color-text-primary)]">
                    {cat.productCount} SKUs
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        cat.isActive
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      {cat.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => handleEdit(cat)}
                        className="p-1.5 rounded text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]"
                        aria-label={`Edit ${cat.name}`}
                      >
                        <Edit2 size={14} />
                      </button>
                      <Link
                        href={`/category/${cat.slug}`}
                        target="_blank"
                        className="p-1.5 rounded text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]"
                        aria-label={`View live ${cat.name}`}
                      >
                        <ExternalLink size={14} />
                      </Link>
                      <button
                        onClick={() => handleDelete(cat.id, cat.name)}
                        className="p-1.5 rounded text-[var(--color-text-secondary)] hover:text-rose-600 hover:bg-rose-50"
                        aria-label={`Deactivate ${cat.name}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
