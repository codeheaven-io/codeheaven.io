---
layout: post
title: "15 Things You Should Know About Ansible"
date: 2016-01-12T19:05:11-02:00
keywords: ansible, devops
author: marlonbernardes
excerpt: >
  I've been working a lot with Ansible lately and decided to share some things I learned along the way.
  In this post you'll find a list of 15 things I think you should know about Ansible.
---

I've been working a lot with Ansible lately and decided to share some things I learned along the way. Below you'll find a list of 15 things I think you should know about Ansible. Missing something? Just leave a comment and share your own tips!

## 1 - You can pass parameters to roles

It's a good practice to create roles to organize your playbooks. Let's say we want to create a role for installing Jenkins. The folder structure for this role could look something like this:

```
jenkins/
   files/
   templates/
   tasks/
   handlers/
   defaults/
```

The folder `defaults` is used to store the values of default vars for a role. Inside of it we could have this `main.yml` file:

```shell
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

Always have in mind that Ansible has a lot of modules and most common operations do not require the use of the command module. For instance, there are modules for creating [filesystems](http://docs.ansible.com/ansible/filesystem_module.html), [modifying the iptables](http://docs.ansible.com/ansible/iptables_module.html) and [managing cron entries](http://docs.ansible.com/ansible/cron_module.html). All these modules are idempotent by default, so you always should prefer them.

## 3 - Using Ansible setup's module to gather information about your hosts

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

## 4 - You can list all tasks of a playbook

Want to remember what a playbook does? Run `ansible-playbook` using the `--list-tasks` flag and Ansible will list all its tasks:

```shell
$ ansible-playbook install-jenkins.yml --list-tasks
PLAY: #1
  tasks:
    TASK: meta
    TASK: open-jdk : Install open jdk 1.8
    TASK: mount-partition : Creating the filesystem for the device {% raw %}{{ device }} {% endraw %} (if needed)
    TASK: mount-partition : Mounting the device {% raw %}{{ device }}{% endraw %} on path {% raw %}{{ path }}{% endraw %}
    TASK: jenkins : Ensure Jenkins repo is installed.
    TASK: jenkins : Add Jenkins repo GPG key.
    TASK: jenkins : Ensure Jenkins is present.
    TASK: jenkins : Ensures that the home directory exists
    TASK: jenkins : include
    TASK: jenkins : Ensure Jenkins is started and runs on startup.
    TASK: jenkins : Wait for Jenkins to start up before proceeding.
    TASK: jenkins : Get the jenkins-cli jarfile from the Jenkins server.
```

## 5 - Use ansible-vault when you want to store sensitive information

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

## 6 - Using with_items might be a good idea

When you use the `with_items` clause, Ansible will create a variable called `{% raw %}{{item}}{% endraw %}` containing the value for the current iteration. Some modules handle collections of items really well and are actually faster than running the same task multiple times with different parameters.

```shell

  # Installing all packages with one task (faster)
  - name: install required packages using the apt module
    apt: package={% raw %}{{ item }} {% endraw %} update_cache=yes
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

## 7 - How Local Actions work

Sometimes you might want to run a task on your local machine instead of running it on the remote machine. This could be useful when we want to wait for the server to start (if it has just booted) or when we want to add some nodes in a load balancer pool (or remove them):

```shell
tasks:
 - name: take out of load balancer pool
   local_action: >
      command /usr/bin/take_out_of_pool {% raw %}{{ inventory_hostname }}{% endraw %}

 - name: update application
   yum: name=acme-web-stack state=latest

 - name: add back to load balancer pool
   local_action: >
      command /usr/bin/take_out_of_pool {% raw %}{{ inventory_hostname }}{% endraw %}

```

Below is an example of how to launch an EC2 instance and wait for it to be available:

```shell
- name: Launching EC2 Instance
    # instance options here
  register: ec2


- name: Waiting for ec2 instances to listen on port 22
  wait_for:
    state=started
    host={% raw %}{{ item.public_dns_name }}{% endraw %}
    port=22
  with_items: ec2.instances
```

## 8 - You can tell Ansible to run a task only once

Sometimes you might want to run a task only once, even when there are multiple hosts. As an example, let's say you have several application servers that connect to the same database and you have a task that performs a database migration. In this case, you need to run this task only once.

To achieve that, you can use the `run_once` parameter to tell Ansible to run the command only one time:

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

There are some things you can do to make Ansible run even faster:

- **Enable pipelining**
Enabling pipelining reduces the number of SSH operations required to execute a module on the remote server, by piping scripts to the SSH session instead of copying it. This can result in a very significant performance improvement when enabled.

You should be careful, though. Pipelining will only work if the option `requiretty` is disabled on all remote machines in the sudoers file (/etc/sudoers).

```shell
[defaults]
pipelining = True
```

- **Turn off fact gathering or enable fact caching**
If you are not using any Ansible facts in your tasks, you can disable the "fact gathering" step for improved speed. To do so, simply add the property `gather_facts: False` in your playbook:

```shell
- hosts: servername
  gather_facts: False
  tasks:
    - name: ...
    # ...
```

Alternatively, if you do need to use Ansible facts (automatically gathered by the setup task) you can cache them so subsequent executions will be faster. Ansible docs cover this in details [here](http://docs.ansible.com/ansible/playbooks_variables.html#fact-caching), if you want to read more.

## 11 - Ansible has several notification modules

Using Ansible to automate your blue-green deployment? Running playbooks to provision new instances on AWS? Let your team know using one of their notifications modules. As an example, the task below will send a slack notification with a custom message:

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

## 13 - You can run things in "Dry Run" Mode

Ansible supports running a playbook in dry run mode (also called Check Mode), in this mode, Ansible will **not** make any changes to your host, but simply report what changes would have been made if the playbook was run without this flag.

```shell
$ ansible-playbook --check playbook.yml
```

While this is useful in some scenarios, it might not work properly if your tasks use conditional steps.

## 14 - Tasks can be run step-by-step

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

## 15 - Tasks can be run based on their tags

You can add one or more tags to a task or a play. To do so, simply mark what you want to tag with the `tags` attribute:

```shell
# playbook.yml
- hosts: servername
  tags:
    - server
  tasks:
    - name: Download optional files
      tags:
        - download
        - optional
    - name: Install dependencies
      tags:
        - dependencies
```

Later on you can decide which tags to run or skip using the flags `--tags <tagname>` (or simply `-t`) and `--skip-tags <tagnames>`:

```shell
# will run only tasks with the tag 'dependencies'
$ ansible-playbook --tags=dependencies playbook.yml

# will run all tasks except the ones that contain the tag 'optional'
$ ansible-playbook --skip-tags=optional playbook.yml
```

You can specify more than one tag by separating them with commas.

## References

 - [Ansible Docs](http://docs.ansible.com/ansible/intro.html)
 - [Ansible Up & Running Book, by Lorin Hochstein](http://shop.oreilly.com/product/0636920035626.do)
