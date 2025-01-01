import { ProductPageLayout } from '@/components/ProductPageLayout'

export default function ExoticsPage() {
  return (
    <ProductPageLayout
      pageTitle="Exotics"
      activePage="exotics"
      fetchUrl="/api/products/exotics"
    />
  )
} 