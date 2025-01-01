import { ProductPageLayout } from '@/components/ProductPageLayout'

export default function MidsPage() {
  return (
    <ProductPageLayout
      pageTitle="Mids"
      activePage="mids"
      fetchUrl="/api/products/mids"
    />
  )
} 