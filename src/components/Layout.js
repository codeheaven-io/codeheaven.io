import Head from './Head'
import SiteHeader from './SiteHeader'
import PageHeader from './PageHeader'
import Main from './Main'

import './Styles'

const Layout = ({ title, pageHeader, main }) => {
  return (
    <>
      <Head />
      <SiteHeader />
      {title && <PageHeader title={title}>{pageHeader}</PageHeader>}
      <Main>{main}</Main>
    </>
  )
}

export default Layout
