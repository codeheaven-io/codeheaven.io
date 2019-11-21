import NextjsHead from 'next/head'

const Head = (props) => {
  return (
    <NextjsHead>
      <title>TODO</title>
      <meta name="description" content="{% if page.excerpt %}{{ page.excerpt | strip_html | strip_newlines }}{% else %}{% endif %}" />

      <meta name="language" content="en" />
      <meta name="content-language" content="en" />

      {/* TODO */}
      {/* {% if page.author %}
      <meta name="author" content="{{site.data.authors[page.author].name}}">
      {% else %}
      <meta name="author" content="Marlon Bernardes, Rafael Eyng">
      {% endif %} */}

      {/* <link rel="canonical" href="{{ page.url | replace:'index.html','' | prepend: site.baseurl | prepend: site.url }}"> */}
      {/* <link rel="alternate" type="application/rss+xml" title="{{ site.title }}" href="{{ "/feed.xml" | prepend: site.baseurl | prepend: site.url }}" /> */}

      {/* {% if page.keywords %}
      <meta name="keywords" content="{{ page.keywords }}" />
      {% else %}
      <meta name="keywords" content="html, css, javascript, js, html5, css3, java, ruby, codeheaven, code, heaven, github, node, blog" />
      {% endif %} */}

      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link href="//fonts.googleapis.com/css?family=Merriweather:900,900italic,300,300italic" rel="stylesheet" type="text/css" />

      {/* TODO */}
      {/* {% include google_analytics.html %}   */}
    </NextjsHead>
  )
}

export default Head
