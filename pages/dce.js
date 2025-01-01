import { ProductPageLayout } from '@/components/ProductPageLayout'

export default function DcePage() {
  return (
    <ProductPageLayout
      pageTitle="Disposables / Carts / Edibles"
      activePage="dce"
      fetchUrl="/api/products/edibles"
    />
  )
} 