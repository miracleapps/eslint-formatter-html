# @miraclesoft/eslint-formatter-html

Custom Formatter for ESLint that creates a minimal and responsive HTML report based on your eslint results.

**_Note_**_: This is a beta version of this formatter created for internal use by Miracle Apps, Miracle Software Systems, Inc.'s internal app development wing. Please submit any issues (or) feedback [here](https://github.com/miracleapps/eslint-formatter-html/issues)._

## Usage

Install as a dev-dependency with npm (or) yarn,

```sh
npm install @miraclesoft/eslint-formatter-html --save-dev

(or)

yarn install @miraclesoft/eslint-formatter-html --save-dev
```

Then use with eslint from the command line,(example shown running eslint locally)

```sh
./node_modules/.bin/eslint -f @miraclesoft/eslint-formatter-html [files-to-lint]
```

When run, the formatter will output a HTML report in **/reports/lint-report.html**

Here is a preview for the [HTML Report](/@miraclesoft/eslint-formatter-html/assets/lint-report.html)

## Contributors

- **Chanakya Lokam** - Director Innovation | Miracle Software Systems, Inc.
- **Geetha Krishan Adhikari** - Sr. Full Stack Engineer | Miracle Software Systems, Inc.

## License

© 2020 Miracle Software Systems, Inc.

Licensed under the [MIT License](LICENSE).
