---
layout: post
title: "15 Things to Know About Ansible on Day One"
date: 2016-01-11T10:53:11-02:00
keywords: react, testing, javascript
author: marlonbernardes
excerpt: >
  Ansible
---


## 1 - You can pass parameters to roles

It's a good practice to create roles to organize your playbooks. Let's say we want to create a role for installing Jenkins. The folder structure for this role could look something like this:

```
myapplication/
   files/
   templates/
   tasks/
   handlers/
   defaults/
```

The folder `defaults` is used to store the values of default vars for a role. Inside of it we could have this `main.yml` file:

```yaml
jenkins_port: 8080
jenkins_context_path: /jenkins
jenkins_home: /jenkins
```

You could overwrite the default variables, by passing different parameters to the role like so:

```yml
roles:
   - { role: jenkins, jenkins_port: 8181, jenkins_home: '/jenkins1' }
   - { role: jenkins, jenkins_port: 8080, jenkins_home: '/jenkins2' }
```

## 2 - How to make the command module idempotent

Idempotence is the property of certain operations that can be executed multiple times without changing the result of the initial application. This concept is present in most Ansible modules: you specify the desired final state and Ansible decides if the task should be run. This principle is not applied by default to the `command` module. By default, if you have the task below in your playbook, it will always be run:

```shell
- command: /usr/bin/create-database.sh
```

In order to achieve idempotence, you could use the attribute `creates`. When present, Ansible will only run the command task if the file specified by the pattern does not exists. Alternatively you could use `removes`, which will only execute the task if the file specified exists.

```shell
- command: /usr/bin/create-database.sh creates=/path/to/database
```

Always have in mind that Ansible has a lot of modules and most common operations do not require the use of the command module. For instance, there are modules for creating [filesystems](http://docs.ansible.com/ansible/filesystem_module.html), [adding entries to the hosts file](http://docs.ansible.com/ansible/hostname_module.html) and [managing cron entries](http://docs.ansible.com/ansible/cron_module.html). All these modules are idempotent by deault, so you always should prefer them.

## 3 - Invoking 'setup' manually

You probably have seen that the first thing Ansible does when it runs a playbook is something like this:

```shell
TASK [setup] *******************************************************************
ok: [servername]
```

This happens because Ansible invokes the special module `setup` before executing the first task. The setup module connects to the host and gather facts for all kind of details: IP address, disk space, CPU architecture, available memory and more. It could be useful to invoke this module manually as a quick way to gather information about your hosts. In order to do so simply run the command below:

```shell
$ ansible localhost -m setup
localhost | SUCCESS => {
  "ansible_facts": {
    "ansible_all_ipv4_addresses": [
        "10.27.12.77",
        "192.168.33.1"
    ],
    (MANY more facts)
  }
```

## 4 - How to list all tasks of a playbook

Want to remember what a playbook does? Run `ansible-playbook` using the `--list-tasks` flag and Ansible will list all its tasks:

```shell
$ ansible-playbook install-jenkins.yml --list-tasks
PLAY: #1
  tasks:
    TASK: meta
    TASK: open-jdk : Install open jdk 1.8
    TASK: mount-partition : Creating the filesystem for the device {{ device }} (if needed)
    TASK: mount-partition : Mounting the device {{ device }} on path {{ path }}
    TASK: jenkins : Ensure Jenkins repo is installed.
    TASK: jenkins : Add Jenkins repo GPG key.
    TASK: jenkins : Ensure Jenkins is present.
    TASK: jenkins : Ensures that the home directory exists
    TASK: jenkins : include
    TASK: jenkins : Ensure Jenkins is started and runs on startup.
    TASK: jenkins : Wait for Jenkins to start up before proceeding.
    TASK: jenkins : Get the jenkins-cli jarfile from the Jenkins server.
```

## 5 - How to store sensitive information using ansible-vault

If one of your tasks requires sensitive information (let's say the database user and password), it's a good practice to keep this information encrypted, instead of storing it in plain text.

Ansible ships with a command line tool called `ansible-vault`, that allows you to create and manage encrypted files. This way you can commit the encrypted file to your source control and only users with the decryption password will be able to read it.

```shell
# Encrypt an existing file. You'll need to create an encryption password.
ansible-vault encrypt secrets.yml

# Creates a new, encrypted file. You'll need to create an encryption password.
ansible-vault create secrets.yml

# Decrypt a file. You'll have to enter password used for encryption.
# Use it with caution! Don't leave your files unecrypted.
ansible-vault decrypt secrets.yml

# Edit an encrypted file (uses vim by default, can be overriden by the environment variable $EDITOR)
ansible-vault edit secrets.yml

# Print the contents of the encrypted file
ansible-vault edit secrets.yml
```

If you import the vars_file `secrets.yml` in your playbook, Ansible will fail, as it will not know how to read the encrypted file. You'll have to specify the command line argument `--ask-vault-pass`, which will make Ansible prompt you the password of the encrypted file.

```shell
ansible-playbook playbook.yml -i hosts --ask-vault-password
```

Another way is to store the password in a file (which should not be commited) and specify the path to the file using the `--vault-password-file` argument. If this file is marked as executable, Ansible will run it and use the output as the password.

Read more about ansible-vault [here](http://docs.ansible.com/ansible/playbooks_vault.html).

## 6 - Using with_items to iterate an array

When you use the `with_items` clause, Ansible will create a variable called `{{item}}` containing the value for the current iteration. Some modules handle collections of items really well and are actually faster than running the same task multiple times with different parameters.

```shell

  # Installing all packages with one task (faster)
  - name: install required packages using the apt module
    apt: package={{item}} update_cache=yes
    sudo: True
    with_items:
      - git
      - memcached
      - nginx

  # Installing packages individually (slower)
  - name: install git
    apt: package=git update_cache=yes
    sudo: True

  - name: install memcached
    apt: package=memcached update_cache=yes
    sudo: True

  - name: install nginx
    apt: package=nginx update_cache=yes
    sudo: True
```

## 7 - delegate_to and local_action

- PG 121: variáveis tem escopo remoto em local action
- delegate_to e local_action PG 122

## 8 - You can run a task only once

Sometimes you might want to run a task only once, even when there are multiple hosts. As an example, let's say you have several application servers that connect to the same database and you have a task that performs a database migration. In this case, you need to run this task only once.

To achieve that, you can you the `run_once` parameter to tell Ansible to run the command only one time:

```shell
- name: run the database migrations
  command: bundle exec rake db:migrate
  run_once: true
```

## 9 - Handlers are special types of tasks

Handlers are tasks with unique names that will only be executed if notified by another task. They are really useful for restarting a service or rebooting the system.

Handlers that were notified will be executed **one** time at the end of the playbook and, regardless of how many times they were notified. You can declare them with the `handler` clause and trigger them using `notify`.

Here is an example of how restart two services when the contents of a file change, but only if the file changes (extracted from Ansible [docs](http://docs.ansible.com/ansible/playbooks_intro.html#handlers-running-operations-on-change)):

```shell
- name: template configuration file
  template: src=template.j2 dest=/etc/foo.conf
  notify:
     - restart memcached
     - restart apache
```

The handlers should be declared somewhere else in your playbook:

```shell
handlers:
    - name: restart memcached
      # The service module was used, but you could use whatever module you wanted
      service: name=memcached state=restarted
    - name: restart apache
      service: name=apache state=restarted
```

## 10 - Speeding things up with pipelining

- pipelining
- fact caching
- parallelism
- !requiretty só é preciso quando pipelining tá ativo. Olha conceito de pipelining (PG 165)

## 11 - Ansible has several notification modules

Using ansible to automate your blue-green deployment? Running playbooks to provision new instances on AWS? Let your team know using one of their notifications modules. As an example, the task below will send a slack notification with a custom message:

```shell
- hosts: servername
  tasks:
    - name: Send notification message via Slack
      local_action:
        module: slack
        # To retrieve your slack token, open your team settings and look for the
        # Incoming Webhooks plugin
        token: <your>/<token>/<goes here>
        msg: "Hello team! I just finished updating our production environment."
        channel: "#general"
        username: "ansible-bot"
```

There are also modules available for notificating irc, twillio, hipchat, jabber and [many more](http://docs.ansible.com/ansible/list_of_notification_modules.html).

## 12 - EC2 instances are automatically grouped by their tags

When using Amazon Web Services and Ansible's EC2 dynamic inventory script, all instances will be grouped based on their characteristics, such as their type, keypairs and tags. EC2 tags are simply key=name values associated with your instances and you can use them however you like. Some use tags to group their production/staging servers, mark the web servers or even the "active" servers during a blue-green deployment.

EC2 Dynamic Inventory script uses the following pattern (without the brackets) when grouping hosts by tag:

```
tag_[TAG_NAME]_[TAG_VALUE]
```

So, if you want to run a task on all hosts with a tag `env=staging`, simply add this to your playbook:

```shell
  hosts: tag_env_staging
  tasks:
    - name: This task will be run on all servers with env == staging
    # ...
```

To make it even more interesting, you can use Ansible patterns ([docs](http://docs.ansible.com/ansible/intro_patterns.html#patterns)) to be more specific about what hosts should be affected by a task. For example, if you want to execute a particular task on your production db servers (assuming they are properly tagged), you could use the intersect pattern (`:&`), like this:

```shell
  hosts: tag_env_production&:tag_type_db
  tasks:
    - name: This task will be run on all servers with tags 'env=production' and 'type=db'
    # ...
```


## 13 - Dry-run


-- diff
copy, lineinfile, template


ansible tem um comando --diff para mostrar as diferenças feitas por comandos copy, template, lineinfile PG 269

## 14 - Running tasks step by step

Sometimes you don't want to run all tasks in your playbook. This is somewhat common when you're writing a new playbook and want to test it. Ansible provides a way to let you decide which tasks you want to run, through the use of the `--step` flag. It will let you choose if you want to run the task (y), skip it (n), or (c)ontinue  without asking.


```shell
# playbook.yml
- hosts: servername
    tasks:
      - name: First task
        # ...
      - name: Second task
        # ...

$ ansible-playbook provision.yml -i hosts --step

> Perform task: TASK: setup  (y/n/c): n  #
> Perform task: TASK: First task (y/n/c): n
> Perform task: TASK: Second task (y/n/c): y
```

## 15 - How to debug and troubleshoot

-vvvv
debug module
assert module
