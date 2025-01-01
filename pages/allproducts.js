import { ProductPageLayout } from '@/components/ProductPageLayout'

export default function AllProductsPage() {
  return (
    <ProductPageLayout
      pageTitle="All Products"
      activePage="allproducts"
      fetchUrl="/api/products/all"
    />
  )
} 