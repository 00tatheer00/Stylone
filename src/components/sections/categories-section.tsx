import { getActiveCategories, type CategoryItem } from '@/services/category-service';
import { CategoriesClient } from './categories-client';

async function CategoriesSection({
  initialCategories,
}: {
  initialCategories?: CategoryItem[];
} = {}) {
  const categories = initialCategories || (await getActiveCategories());
  return <CategoriesClient categories={categories} />;
}

export { CategoriesSection };
