import { ProductPageLayout } from '@/components/ProductPageLayout'

export default function LowsPage() {
  return (
    <ProductPageLayout
      pageTitle="Lows"
      activePage="lows"
      fetchUrl="/api/products/lows"
    />
  )
} 