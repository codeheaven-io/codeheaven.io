import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import matter from 'gray-matter'
import slugify from 'slugify'
import dateformat from 'dateformat'

import Layout from '../components/Layout'

import authors from '../data/authors'

const Index = ({ posts }) => {
  return (
    <Layout>
      <ul className="post-list">
        {posts.map((post) => {
          const postData = post.document.data

          return (
            <li key={post.slug}>
              <p className="post-meta">
                <time dateTime="TODO">{dateformat(postData.date, 'mmm d, yyyy')}</time> • {authors[postData.author].name}
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
    </Layout>
  )
}

export default Index

// from https://dev.to/tinacms/creating-a-markdown-blog-with-next-js-52hk
const getPosts = (context) => {
  const keys = context.keys()
  const values = keys.map(context)

  return keys.map((key, index) => {
    const value = values[index]
    const document = matter(value.default)
    const slug = slugify(key.replace('./', '')).slice(0, -3)

    return {
      document,
      slug,
    }
  })
    .sort((a, b) => new Date(b.document.data.date) - new Date(a.document.data.date))
}

Index.getInitialProps = async function() {
  const posts = getPosts(require.context('../posts', false, /\.md$/))

  return {
    posts,
  }
}
