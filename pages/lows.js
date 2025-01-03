import { SITE_TITLE } from '@/utils/constants'
import Head from 'next/head'
import { ProductPageLayout } from '@/components/ProductPageLayout'

export default function LowsPage() {
  return (
    <>
      <Head>
        <title>{SITE_TITLE} - Lows</title>
      </Head>
      <ProductPageLayout
        pageTitle="Lows"
        activePage="lows"
        fetchUrl="/api/products/lows"
      />
    </>
  )
} 