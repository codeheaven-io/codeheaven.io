import matter from 'gray-matter'
import ReactMarkdown from 'react-markdown'

export default function BlogTemplate(props) {
  const markdownBody = props.content
  const frontmatter = props.data
  return (
    <article>
      <h1>{frontmatter.title}</h1>
      <div>
        <ReactMarkdown source={markdownBody} />
      </div>
    </article>
  )
}

BlogTemplate.getInitialProps = async function(context) {
  const content = await import(`../posts/${context.query.slug}.md`)
  const data = matter(content.default)

  return {
    ...data,
  }
}
