import site from '../data/site'

const Header = () => {
  return (
    <div className="container">
      <header className="site-header single-column">
        <a className="blog-title" href={site.baseurl}>{site.title}</a>
        <nav className="blog-menu" >
          <a href={`${site.baseurl}/authors`}>Authors</a>
          <a href="https://github.com/codeheaven-io/codeheaven.io" target="_blank">Github</a>
        </nav>
      </header>
    </div>
  )
}

export default Header
