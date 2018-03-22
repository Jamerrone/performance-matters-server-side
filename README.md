# Performance Matters: Server Side

The original Amsterdams Vault repository can be found [here](https://github.com/Jamerrone/amsterdams-vault).

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Installing

After cloning the repository you can install the required dependencies using npm:

```javascript
$ npm install
```

### Usage

In order to launch a development environment:

```javascript
$ npm run start
```

In order to compile and minify your JavaScript: *(Runs by default while using ```$ npm run start```.)*

```javascript
$ npm run compile
```

## From Client-Side to Server-Side

## NPM Scripts, CommonJS & Browserify

## Performance Optimization

*All tests are performed using the "Slow 3G" option from the Google Chrome Developer Tools.*

### Run 1: Client Side

![Client Side](./images/1-client-side.png)

TODO

* **Total load time:** 04.10m

### Run 2: Server Side

![Server Side](./images/2-server-side.png)

TODO

* **Total load time:** 03.30m

### Run 3: JS + CSS Minification & Critical CSS

![JS + CSS Minification & Critical CSS](./images/3-js_css-minify-critical-css.png)

TODO

* **Total load time:** 03.30m

### Run 4: Images Lazy Loading

![Images Lazy Loading](./images/4-lazy-loading.png)

TODO

* **Total load time:** 28.29s

### Run 5: Minify HTML

![Minify HTML](./images/5-html-minify.png)

TODO

* **Total load time:** 28.16s

### Run 6: gZip

![gZip](./images/6-gzip.png)

TODO

* **Total load time:** 20.08s