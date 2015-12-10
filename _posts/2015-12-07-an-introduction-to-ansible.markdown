---
layout: post
title: "An Introduction to Ansible: Installing Jenkins on your server"
date: 2015-12-07T10:52:25-02:00
keywords: ansible, devops, jenkins, vagrant, centos, ubuntu
excerpt: >
  Ansible is an infrastructure automation platform that makes it easy
  to manage and configure your servers.
  In this Introduction to Ansible we'll be using it to automate the installation
  of Jenkins CI.
---

## Introduction

*Ansible* is an infrastructure automation platform that makes it easy to manage and configure your servers.
*Vagrant* allows us to create reproducible environments, making it really easy to work with virtual machines.
We'll use Ansible to automate the installation of Jenkins CI in a fresh CentOS image, created by Vagrant.

## Requirements

Before we start, make sure you have `vagrant` and `ansible` installed. Installing it through homebrew  should be really straightforward:

- `brew install ansible && ansible --version`
- `brew cask install vagrant && vagrant -v`

Alternatively follow this links for installation instructions:
- [Ansible](http://docs.ansible.com/ansible/intro_installation.html)
- [Vagrant](https://docs.vagrantup.com/v2/installation/)

## Setting up our environment

Run the command `vagrant init centos/7` or manually create a file named `Vagrantfile` (no extension) with the following content:

```
Vagrant.configure(2) do |config|
  config.vm.box = "centos/7"
end
```

To spin up this VM, simply run the command `vagrant up` in your terminal in the same directory the Vagrantfile was created. This could take some minutes in the first time it is run, since Vagrant needs to download your CentOS image. You should see output that includes:

```
Bringing machine 'default' up with 'virtualbox' provider...
==> default: Importing base box 'centos/7'...
[...]
==> default: Forwarding ports...
    default: 22 => 2222 (adapter 1)
==> default: Booting VM...
==> default: Waiting for machine to boot. This may take a few minutes...
    default: SSH address: 127.0.0.1:2222
    default: SSH username: vagrant
    default: SSH auth method: private key
[...]
==> default: Machine booted and ready!
```

Ok, so far so good. At this stage we haven't even touched Ansible - we only created a VM with a fresh CentOS image.

## Writing your first playbook

Ansible uses the term *playbook* to describe it's configuration management scripts. Playbooks are `.yml` files where you specify everything that will be run on the server.

Our first playbook (I named it `configure-ci-server.yml`) could be something like this:

```
---
- name: Configure CI server
  hosts: ci-server
  sudo: True
  tasks:
    - name: install git only if it is not already installed
      yum:
        name=git
        state=present
```   

The playbook above installs Git using yum. Really easy to understand, right?

The tasks tell Ansible **WHAT** should be executed on the target and the `hosts` part tell Ansible **WHERE** it should be run.

We can run it using the `ansible-playbook` command in our terminal, but first we need to
tell Ansible how to reach the `ci-server` host (the name specified in the playbook). We do this by creating an inventory file (I named it `hosts`), in the same directory as our playbook with the following content:

```
[ci-server]
ci-server ansible_ssh_host=127.0.0.1 ansible_ssh_port=2222 ansible_ssh_user=vagrant ansible_ssh_private_key_file=.vagrant/machines/default/virtualbox/private_key
```   

Now, if you run the command below it should install git in your CI server:

```
ansible-playbook configure-ci-server.yml -i hosts
```

If an error occurs due to ssh host key checking, you could disable it. To do that, create a file named `ansible.cfg`:

```
[ssh_connection]
ssh_args = -o StrictHostKeyChecking=no
```

I do not recommend that you disable host key checking when you connect to a production server, since it adds a layer of protection against Man-in-the-middle attacks. Disabling it while connecting to a self-hosted VM is fine, though.

Anyway, now you should have git installed on your server. One of the best thing of most ansible modules (such as yum) is that they are **idempotent**, that is, they can be run multiple times without side effects. In other words, git will only be installed when you run the script for the first time (considering it is not already installed by then).

## Refactoring things a bit

Instead of writing a list of tasks, a better approach is to create roles. By extracting our tasks into different roles, our code will be much more reusable and easier to read.

Create the folder `roles/git/tasks` and add a file named `main.yml` inside of it. In the end, your directory structure will look like this:

```
.
├── Vagrantfile
├── ansible.cfg
├── configure-ci-server.yml
├── hosts
└── roles (create this folder)
    └── git
       └── tasks
           └── main.yml
```

File `git/tasks/main.yml`:

```
---
  - name: install git
    yum:
      name=git
      state=present
```



File `configure-ci-server.yml`:

```
---
- name: Configure CI server
  hosts: ci-server
  sudo: True
  roles:
    - git
```

## Installing Jenkins

What we need to do next is to install Jenkins on this server. Luckily, there is a role published in ansible-galaxy (npm-like service for sharing ansible roles) made by geerlingguy (official repo [here](https://github.com/geerlingguy/ansible-role-jenkins/))

To use this role, run the following command on your terminal:

```
ansible-galaxy install geerlingguy.jenkins -p ./roles/
```

And add this role to your playbook:

```
- name: Configure CI server
  hosts: ci-server
  sudo: True
  roles:
    - git
    - geerlingguy.jenkins
```

Jenkins run, by default, on port 8080. To test it using your browser you should make Vagrant map the port 8080 on the VM to a port in our local machine. Add the following line to your `Vagrantfile`:

```
config.vm.network "forwarded_port", guest: 8080, host: 8080
```

After that, simply run `vagrant reload`, wait a little bit until the jenkins service is running (it was installed by the role `geerlingguy.jenkins`) and point your browser to [http://localhost:8080](http://localhost:8080). Done!
