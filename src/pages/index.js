import React from 'react'
import Head from 'next/head'
import Link from 'next/link'

const matter = require('gray-matter');
const slugify = require('slugify');


const Index = ({ posts }) => {
  // console.log('Index props:', props)
  return (
    // <Layout pathname="/" siteTitle={props.title} siteDescription={props.description}>
      <section>
        <div>
          {posts.map((post) => (
            <div key={post.slug}>
              <Link href="/[slug]" as={`/${post.slug}`}>
                <a>{post.slug}</a>
              </Link>
            </div>
          ))}
        </div>
      </section>
    // </Layout>
  )
}

export default Index

// from https://dev.to/tinacms/creating-a-markdown-blog-with-next-js-52hk
const listPosts = (context) => {
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
}

Index.getInitialProps = async function() {
  const config = await import(`../data/config.json`)
  const context = require.context('../posts', false, /\.md$/)
  const posts = listPosts(context)
  return {
    posts,
    config,
  }
}
