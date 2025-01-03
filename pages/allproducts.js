import { SITE_TITLE } from '@/utils/constants'
import Head from 'next/head'
import { ProductPageLayout } from '@/components/ProductPageLayout'

export default function AllProductsPage() {
  return (
    <>
      <Head>
        <title>{SITE_TITLE} - All Products</title>
      </Head>
      <ProductPageLayout
        pageTitle="All Products"
        activePage="allproducts"
        fetchUrl="/api/products/all"
      />
    </>
  )
} 