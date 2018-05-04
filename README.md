# NSP, except

A library to help you only exclude the security vulnerabilities you really mean to.

## Why

[nsp](https://www.npmjs.com/package/nsp) is a very useful library that checks your project's dependencies against a database of known security vulnerabilities, so that you don't introduce your project to unnecessary risk.

Sometimes, `nsp` will warn you about an issue with one of your dependencies, but upon investigation you find that it does not affect your project. For example, you depend on the library `fantastic-features`, which uses a vulnerable version of the library `great-lib`. You take a look at the `fantastic-features` source code, and find that `great-lib` is only being used in the code for generating the `fantastic-features` documentation website.

`nsp` let's you specify an array of `exceptions` in your `.nsprc` file:

```json
"exceptions": [
  "https://nodesecurity.io/advisories/123"
]
```

You've now said you don't care if your project uses a vulnerable version of `great-lib` and `nsp` will stop reporting the issue. But what if someone adds `great-lib` to your project in a month's time? Or includes `another-lib` which also uses the vulnerable version of `great-lib`? `nsp` won't warn you about the exception and the security hole will get built into your app without you noticing.

`nsp-except` lets you specify the path to the advisory you wish to ignore, so you only ignore the vulnerability if it originates from `fantastic-features`.

## Usage


### Installation

```sh
$ npm install -g nsp-except
```

It's probably not a good idea to manage your exceptions in two different ways at the same time, so you'll want to remove the `exceptions` array from your `.nsprc`.

### `add`

If you've discovered an advisory you'd like to ignore, run:

```sh
$ nsp-except add
```

This will create a `.nsp-exceptions.json` file at the root of your project with your exceptions. Please note that running `nsp-except add` will add __all__ your current advisories to the file (it overwrites the file every time), so make sure that you really want to ignore each of your current advisories.

The `.nsp-exceptions.json` file will look something like this:

```json
[
  {
    "id": 123,
    "advisory": "https://nodesecurity.io/advisories/123",
    "path": [
      "fantastic-featurees@1.0.0",
      "great-lib@1.3.0"
    ]
  }
]
```

As you can see, you've only added an exception for the _exact_ path to the advisory.

### `check`

```sh
$ nsp-except check
```

Running `nsp-except check` will check your project against the `nsp` advisory database in the same way that `nsp check` does. The only difference is that it will take the exceptions in your `.nsp-exceptions.json` file into account.

### Gotchas

- Make sure you run the command from the root of your project, so it can find your `package.json` and `.nsp-exceptions.json`

# License

MIT
