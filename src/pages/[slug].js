import matter from 'gray-matter'
import ReactMarkdown from 'react-markdown'
// import Layout from '../../components/Layout'

export default function BlogTemplate(props) {
  // data from getInitialProps
  const markdownBody = props.content
  const frontmatter = props.data
  return (
    // <Layout siteTitle={props.siteTitle}>
      <article>
        <h1>{frontmatter.title}</h1>
        <div>
          <ReactMarkdown source={markdownBody} />
        </div>
      </article>
    // </Layout>
  )
}

BlogTemplate.getInitialProps = async function(context) {
  const { slug } = context.query
  const content = await import(`../posts/${slug}.md`)
  const config = await import(`../data/config.json`)
  const data = matter(content.default)

  return {
    siteTitle: config.title,
    ...data,
  }
}
