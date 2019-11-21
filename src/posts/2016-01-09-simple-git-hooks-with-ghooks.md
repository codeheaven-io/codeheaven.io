---
layout: post
title: "Simple Git Hooks With Ghooks"
date: 2016-01-09T22:18:59-02:00
keywords: git, hooks, workflow
author: rafaeleyng
excerpt: >
  Learn how to use git hooks easily to leverage best practices in your workflow.
translation_id: 6c1babcd20a7f22e79eb0ed2fb75c0a4
---

## git hooks

git provides a way to *hook* some git actions (like commit, push) to run custom scripts. These hooks run at different moments of the actions, and you can use them to improve your workflow in several ways. Some examples are preventing a commit to happen if a test fails, or running some kind of build tool before pushing.

When you create a git project, you'll have a bunch of hook samples inside `.git/hooks`. None of these are actually run because they have the `.sample` extension. Remove that extension and the hook starts to get called.

## What's wrong with git hooks

Your git hooks stay inside the `.git` folder. Since this folder contains your local project versioning history, it is not versioned. The problem is that even if you create a hook file, you can't commit this file and push it to your remote, so this file won't exist for the rest of your team.

## ghooks to the rescue!

Start by installing ghooks:

```sh
npm i -D ghooks
```

When you do that, ghooks will create a whole lot of files inside your `.git/hooks` dir. But that is not a problem anymore, because everybody that clones your project will also have those files created when they run `npm install`. And all those hook files are identical: they simply require ghooks and call it passing the hook file's own name. So supposing we are to run a commit, git calls the hook, but the hook calls ghooks, saying "hey, git are running the pre-commit hook, handle it at your will".

ghooks will then look for how you want to handle that hook. The way to go is define this is in your `package.json`:

```js
"config": {
  "ghooks": {
    "pre-commit": "npm run test"
  }
}
```

Even though your git hooks (auto generated by ghooks) are still buried inside `.git` folder, the actual code they will execute is not. Now you can keep this code versioned and consistent across your team.

### A little bit of shell scripting

Programs are called, run, and exit. The program exits with a code number that tells whether it ran successfully or not. `0` is success. Any other code is an error.

Some git hooks have the power to actually prevent the git action to be performed. *pre-commit* is one of them. If your hook exits non-zero, the commit won't happen. This way, you can run your linter or tests before commiting, and if they fail, the task runner will exit non-zero and the commit won't happen.

### A gotcha with exit codes

You can actually run more than one command in your hook. For instance, you could run `npm run test; npm run build`.

You have to be aware that, for git, it only matters the exit code of the last program of your hook. So even if `npm run test` fails, `npm run build` could succeed and the commit will happen.

I ran into this myself. I was in a situation where I had to commit a bundled JavaScript file in my project. Before commiting, I wanted my hook to run my linter, my tests and to bundle the file with production configuration. But the bundled file would need to be added to my git index, so I needed to run `git add dist/bundle.js`. I created a `pre-commit` npm script that would call my appropriate Gulp tasks and ended up with a pre-commit ghook like `npm run pre-commit; git add dist/bundle.js`.

You see the problem? Even if my linter or tests failed, or even if my bundler (Webpack) failed to bundle my file, `git add dist/bundle.js` would succeed and exit with `0`. My commit **would** happen, and it **shouldn't**.

The solution was to use a shell script `if` (if you don't know how a shell script `if` works, I warn you that is not like you expect from other programming languages):

```javascript
  "pre-commit": "if npm run pre-commit; then git add dist/bundle.js; else printf 'pre-commit error: fix the test and/or lint errors and commit again'; (exit 1); fi"
```

See the `(exit 1)` there? That will make my hook exit non-zero and make my commit not happen.

### Skipping hooks

Let's say you added a line to your README. You don't need to run lint/tests/build. Just use:

```sh
git commit -m 'message' --no-verify
```

## List of git hooks

Check the [docs](https://git-scm.com/docs/githooks).