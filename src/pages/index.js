import React from 'react'
import Link from 'next/link'
import dateformat from 'dateformat'

import Layout from '../components/Layout'

import authors from '../data/authors'

import getPosts from '../utils/getPosts'

const Index = ({ posts }) => {
  const main = (
    <ul className="post-list">
      {posts.map((post) => {
        const postData = post.document.data
        const postDate = dateformat(postData.date, 'yyyy-mm-dd')
        const postPrettyDate = dateformat(postData.date, 'mmm d, yyyy')
        const authorName = authors[postData.author].name

        return (
          <li key={post.slug}>
            <p className="post-meta">
              <time dateTime={postDate}>{postPrettyDate}</time> • {authorName}
            </p>
            <Link href="/[slug]" as={`/${post.slug}`}>
              <a className="post-link">
                <h2 className="post-title">{ postData.title }</h2>
                <p className="post-summary">{postData.excerpt}</p>
              </a>
            </Link>
          </li>
        )
      })}
    </ul>
  )

  return (
    <Layout main={main}/>
  )
}

export default Index

Index.getInitialProps = async function() {
  const posts = getPosts()

  return {
    posts,
  }
}
