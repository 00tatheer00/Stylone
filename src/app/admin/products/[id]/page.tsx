'use client';

import { Suspense } from 'react';
import { useParams } from 'next/navigation';
import { AdminPageHeader } from '@/components/admin';
import { ProductForm } from '@/components/admin/product-form';
import { adminProducts } from '@/data/admin-demo';

function EditProductContent() {
  const params = useParams();
  const id = params?.id as string;

  const product = adminProducts.find((p) => p.id === id) || adminProducts[0];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={`Edit Formulation: ${product.name}`}
        subtitle={`SKU: ${product.sku} • Category: ${product.category} • Current Stock: ${product.stockQuantity} units`}
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Products', href: '/admin/products' },
          { label: product.name },
        ]}
      />

      <ProductForm initialData={product} isEdit={true} />
    </div>
  );
}

export default function EditProductPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-stone-500 uppercase tracking-widest">
          Loading product formulation...
        </div>
      }
    >
      <EditProductContent />
    </Suspense>
  );
}
