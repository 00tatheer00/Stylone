import { AdminPageHeader } from '@/components/admin';
import { ProductForm } from '@/components/admin/product-form';

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Add New Cosmetic Product"
        subtitle="Introduce a new formulation or beauty accessory to the STYLONE master catalogue."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Products', href: '/admin/products' },
          { label: 'New Product' },
        ]}
      />

      <ProductForm isEdit={false} />
    </div>
  );
}
