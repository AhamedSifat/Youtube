'use client';

import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useQueryState } from 'nuqs';

import { trpc } from '@/trpc/client';
import { FilterCarousel } from '@/components/filter-carousel';

interface CategoriesSectionProps {
  categoryId?: string;
}

export const CategoriesSection = ({ categoryId }: CategoriesSectionProps) => {
  return (
    <Suspense fallback={<CategoriesSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <CategoriesSectionSuspense categoryId={categoryId} />
      </ErrorBoundary>
    </Suspense>
  );
};

export const CategoriesSectionSkeleton = () => {
  return <FilterCarousel isLoading data={[]} onSelect={() => {}} />;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CategoriesSectionSuspense = ({ categoryId }: CategoriesSectionProps) => {
  const [categories] = trpc.categories.getMany.useSuspenseQuery();

  const data = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));
  const [selectedCategoryId, setCategoryId] = useQueryState('categoryId');

  const onSelect = (value: string | null) => {
    setCategoryId(value); // `nuqs` handles URL update
  };

  return (
    <FilterCarousel
      onSelect={onSelect}
      value={selectedCategoryId}
      data={data}
    />
  );
};
