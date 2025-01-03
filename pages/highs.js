import { SITE_TITLE } from '@/utils/constants'
import Head from 'next/head'
import { ProductPageLayout } from '@/components/ProductPageLayout'

export default function HighsPage() {
  return (
    <>
      <Head>
        <title>{SITE_TITLE} - Highs</title>
      </Head>
      <ProductPageLayout
        pageTitle="Highs"
        activePage="highs"
        fetchUrl="/api/products/highs"
      />
    </>
  )
} 