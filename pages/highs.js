import { ProductPageLayout } from '@/components/ProductPageLayout'

export default function HighsPage() {
  return (
    <ProductPageLayout
      pageTitle="Highs"
      activePage="highs"
      fetchUrl="/api/products/highs"
    />
  )
} 