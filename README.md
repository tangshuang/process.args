# process.args
light-weight command line arguments parser for cli application

## Example

```
// a.js
var args = require('./process.args.js')();
console.log(args);
```

then run in command line:

```
$ node a.js -d -h --name="home love"
```

you will get :

```
{
	'a.js' : {
		d: true,
		h: true,
		name: "home love"
	}
}
```

## Why this CLI appearance?

I have seen many kinds of cli parameters appearance, like:

```
-v
--version
-name my_name
--name my_name
-name=my_name
--name=my_name
```

In my opinion, `-` stands for short, so what follows `-` should be a shortname, without value, so `-v` is my best choice. `--` means detail, so what follows `--` should be a fullname, could be with value, for example `--version` or `--name=yourname`. With a `=`, it seems so easy to understand.

This is the reason why I use this appearance.

## Convention

* only `[a-zA-Z0-9]` and `_` could be used for parameter key name.
* the first letter of key name should be character.
* no blank could be use in value, you can use quota for more than one word, for example: --place="Shenzhen China"
* without `-` at the beginning of a word, it will be considered as a task or command, not a parameter.
* more than two `-` at the beginning of a word makes this part no use doing nothing, for example: ---link="http://github.com", this will be abandoned.

## Usage in .js

** 1) how to require? **


`require('./process.args')` return a function.
Normally, you can just use like this:

a.js:
```
var args = require('./process.args')();
console.log(args);
```

CLI:
```
$ node a.js -v --name="Nick"
{'a.js':{v:true,name:'Nick'}}
```

`require('./process.args')` returns a function.

** parameters **

>require('./process.args')([find]);

find: which key name to use, ignore others, and return value of only this one. 
For example:

```
gulp build --src="./a.js" preview --file="./index.html"
``` 

You just want to find out the values of `preview`, just do like this:

a.js:
```
var args = require('./process.args')('preview');
console.log(args);
```

CLI:
```
$ gulp build --src="./a.js" preview --file="./index.html"
{file:"./index.html"}
``` 

** 2) what will you get in .js? **

`args` will be a object with key:value pattern, for example:

CLI:
```
node a.js -v --name="Nick"
``` 

.js:
```
var args = require('./process.args')();
```

`args` will be:

```
{
	'a.js' : {
		v: true,
		name: "Nick"
	}
}
```

Why contains 'a.js' key? Well, some times, you will use more than one command, like this:

```
gulp build --src="./a.js" preview --file="./index.html" --output="./tmp/index.html"
```

As you seen, there are three command in one line, `gulp` `build` and `preview`, so I whish you be able to get each's parameters.

```
{
	gulp: {},
	build: {
		src: './a.js'
	},
	preview: {
		file: './index.html',
		output: './tmp/index.html'
	}
}
```

>When we run `gulp build`, it is different with `node a.js -v`. 
>In fact it runs `node gulp build`, `node` is hidden for us when we run `gulp build`.

However you can give a key name, like 'build' or 'preview':

```
var args = require('./process.args')('preview');
```

Then, you can set it `true` to catch the first group of parameters.

```
var args = require('./process.args')(true);
```

This will help you to find out the first group args, not the first command's parameters.
For exmaple:

```
$ gulp build --input="./src/" --out="./dist/"
```

You will get parameters of `build`:

```
{
	input: "./src/",
	out: "./dist/"
}
```

You can run the .js files in demo directory in node environment to try.