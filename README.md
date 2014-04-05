jade-to-wire
============

Jade syntax to wire xml compiler

Use node.js to watch changes to `.jade` files to compile into corresponding `.wire` files.


After installing globally, you can run the command `jade-to-wire` from any folder to start a file watcher.

```
npm install -g jade-to-wire
jade-to-wire
```

This little compiler can be used with SFTP for Sublime Text to monitor and upload compiled wire files to create a quick-paced workflow.

## Pre-preprocessors

`jade-to-wire` does use some of its own pre and post compilation processors to help you write wire.

Some basics of the post-compiling, are that `id=` is replaced with `name=` to better suit the WIRE XML language.
And `class=` is replaced with `style=`

So the tag `panel#bacon.square` is compiled into `<panel name="bacon" style="square"></panel>`
