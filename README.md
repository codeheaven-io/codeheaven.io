# CodeHeaven.io


## Requirements

Make sure you have rvm installed, and run:

```shell
rvm install ruby-2.1.2
```

## Installation

```shell
gem install s3_website
git clone https://github.com/codeheaven-io/codeheaven.io.git
cd codeheaven.io
bundle install
jekyll serve
```

## Create a post
```shell
octopress new post 'How to codez'
```

## Create a multilingual a post

We use [Octopress Multilingual](https://github.com/octopress/multilingual) for this.
Our default language is English. Please follow this standard when creating a multilingual post:

* language definition: if your post is in English, don't use the `lang` attribute. If your post is in another language, use it like this: `lang: pt`.

* post title: create translations with the same name of your original English post. If you create create your English post with `octopress new post 'My Awesome Post'`, create the translation as `octopress new post 'My Awesome Post pt'`. You can edit the post title manually after this, we're just interested in that `-pt` in the end of the file name.

* once you've created your original post and its translations, create the link between the translated posts:

```bash
$ octopress id _posts/my_awesome_post.markdown _posts/my_awesome_post-pt.markdown [other posts...]
```

## Deploying to production

  1. Create a `.env` file in the root folder of your project with the following contents:

  ```yaml
  S3_ID: <Your AWS Access Key ID>
  S3_SECRET: <Your AWS Secret Access Key> 
  ```

  2. Run `rake production`
