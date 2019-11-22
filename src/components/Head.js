import NextjsHead from 'next/head'
import site from '../data/site'

const Head = ({ pageData = {} }) => {
  return (
    <NextjsHead>
      <title>{pageData.title || site.title}</title>

      <link rel="canonical" href={`${site.url}${pageData.url || ''}`} />
      {/* TODO feed XML */}
      {/* <link rel="alternate" type="application/rss+xml" title="{{ site.title }}" href="{{ "/feed.xml" | prepend: site.baseurl | prepend: site.url }}" /> */}

      <link href="//fonts.googleapis.com/css?family=Merriweather:900,900italic,300,300italic" rel="stylesheet" type="text/css" />

      <meta name="description" content={pageData.excerpt || ''} />
      <meta name="language" content="en" />
      <meta name="content-language" content="en" />
      <meta name="author" content={pageData.author || 'Marlon Bernardes, Rafael Eyng'} />
      <meta name="keywords" content={pageData.keywords || 'software, development, javascript, js, java, ruby, codeheaven, code, heaven, github, node, docker, blog'} />
      <meta name="author" content={pageData.author || 'Marlon Bernardes, Rafael Eyng'} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* TODO */}
      {/* {% include google_analytics.html %}   */}
    </NextjsHead>
  )
}

export default Head
