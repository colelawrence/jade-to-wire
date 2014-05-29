jade-to-wire
============

Jade syntax to wire xml compiler

Use node.js to watch changes to `.jade` files to compile into corresponding `.wire` files.


After installing globally, you can run the command `jade-to-wire` from any folder to start a file watcher.

```
sudo npm install -g jade-to-wire
jade-to-wire
```

I recommend this compiler be used with SFTP for Sublime Text to monitor compiled wire files for uploading to create a quick-paced workflow for making WIRE apps.

## Pre-preprocessors

`jade-to-wire` does use some of its own pre and post compilation processors to help you write wire.

Some basics of the post-compiling, are that `id=` is replaced with `name=` to better suit the WIRE XML language.
And `class=` is replaced with `style=`

So the tag `panel#bacon.square` is compiled into `<panel name="bacon" style="square"></panel>`

## Jade keywords

Some keywords are shared between WIRE XML and jade like `include` and `if` tags. So if you want to generate a `<if>` tag you use `_if` in jade,

***so:***

```jade
  - var happy = true
  if happy
    _if(lhs="" operator="" rhs="")
      assign(property="" value="")
```

***becomes:***

```xml
  <if lhs="" operator="" rhs="">
    <assign property="" value=""/>
  </if>
```

## Vars file

If a `vars.cson` or a `vars.json` file is located in the directory where `jade-to-wire` is executed, it will be read in for local variables to be used with each jade conversion.

## Converting wire to jade

To convert past projects into the nifty and fantastic language of jade, just run the command `wire-to-jade` from the directory containing your wire files.