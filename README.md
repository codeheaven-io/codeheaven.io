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

## Deploying to production

  1. Create a `.env` file in the root folder of your project with the following contents:

  ```yaml
  S3_ID: <Your AWS Access Key ID>
  S3_SECRET: <Your AWS Secret Access Key> 
  ```

  2. Run `rake production`

