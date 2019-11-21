import Head from './Head'
import Header from './Header'
import './Styles'

const Layout = (props) => {
  return (
    <>
      <Head>
        <title>TODO</title>
      </Head>
      <Header />
      <main className="container single-column">
        {props.children}
      </main>
    </>
  )
}

export default Layout
