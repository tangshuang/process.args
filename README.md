# process.args
light-weight command line arguments parser for cli application

## Install

```
npm install process.args --save-dev
```

## Usage

```
var args = require('process.args')([find,alias]);
```

1) get all commands in command line

```
// script.js
var args = require('process.args')();
console.log(args);
```

Then run in CLI:

```
node script.js -v add --name=new_component --template=./templates/default.tpl
```

Then you will get:

```
{
	node: {},
	'script.js': {
		v: true
	},
	add: {
		name: 'new_component',
		template: './templates/default.tpl'
	}
}
```

2) get a command's parameters by command name

```
var args = require('process.args')('add');
console.log(args);
```

Run the same command, and you will get:

```
{
	name: 'new_component',
	template: './templates/default.tpl'
}
```

3) set alias

The second parameter is `alias` which calls full name for shortname. e.g.

```
var args = require('process.args')({
	v: 'version',
	g: 'global'
});
```

Then you run:

```
your -v=1.2.3 -g
```

`args` will be:

```
{
	your: {
		version: 1.2.3,
		global: true
	}
}
```

The result dosen't have `v` but has `version`. 

Well, if you give a object for the first param, it will be used as `alias` not `find`. `find` is only used with string.

`alias` will only work on `-` params. `alias` of `--bmk` will not work.

## Why this CLI appearance?

I have seen many kinds of cli parameters appearance, like:

```
(npm install) bower
-v
--version
-name my_name
--name my_name
-name=my_name
--name=my_name
```

A command line in my mind always follow the model: 

```
{basic command [-options]} {action [-options] [--params]*}+ {---global_options_or_params}*
# + means repeat once or more
# * means repeat none or more
```

For example:

```
node -v
npm run test -h --cwd=~/dev/project
gulp add --name=my_plugin build --name=my_plugin
gulp add build preview ---name=my_plugin2
```

This is the reason why I use this appearance.

In `process.args`:

* `-` short alias: e.g. `-v` `-h` `-g`
* `--` key=value pairs: e.g. `--name="Nick"` `--host="192.168.0.1"`
* `---` super param: e.g. `---v` means all before this command will be set `-v`, `---name="Park"` means all before this will be set `--name="Park"`

```
gulp build --path="./js" preview -b ---without-feedback go --link="http://www.google.com"
```

Let's look at `---without-feedback`. This means, `build` and `preview` task will both be set `without-feedback`, go will not be set bcause of position behind.

If you set a key twice, the value will be a array.

```
gulp build --path="./js" --path="./css"
```

Then `path` will be a array.

## Convention

* only `[a-zA-Z0-9]` and `_` could be used for parameter key name.
* the first letter of key name should be character.
* no blank could be use in value, you can use quota for more than one word, for example: --place="Shenzhen China"
* without `-` at the beginning of a word, it will be considered as a task or command, not a parameter.
* more than three `-` at the beginning of a word makes this part no use doing nothing, for example: ----link="http://github.com", this will be abandoned.