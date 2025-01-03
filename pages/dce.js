import { SITE_TITLE } from '@/utils/constants'
import Head from 'next/head'
import { ProductPageLayout } from '@/components/ProductPageLayout'

export default function DcePage() {
  return (
    <>
      <Head>
        <title>{SITE_TITLE} - Disposables / Carts / Edibles</title>
      </Head>
      <ProductPageLayout
        pageTitle="Disposables / Carts / Edibles"
        activePage="dce"
        fetchUrl="/api/products/edibles"
      />
    </>
  )
} 