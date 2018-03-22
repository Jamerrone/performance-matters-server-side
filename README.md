# Performance Matters: Server Side

The original "Amsterdams Vault" repository can be found [here](https://github.com/Jamerrone/amsterdams-vault).

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

4 minutes is of course extremely slow and unacceptable. First of all, I should like to make clear that the [Adamlink](https://adamlink.nl/) API used for this project is extremely slow. Other then the bad API performance, most of the content is rendered using client-side JavaScript, every image is loaded at the same time and most of the time there are over 1000 images requested. Last but certainly not least, the [Leaflet](http://leafletjs.com/examples.html) map rendering process can be quite slow. Overall extremely bad performance.

* **Total load time:** 04.10m

### Run 2: Server Side

![Server Side](./images/2-server-side.png)

After rewriting the entire codebase using [Express](https://expressjs.com/), [Pug](https://pugjs.org/api/getting-started.html) and [Node](https://nodejs.org/en/) I was able to reduce the total load time by almost 1 minute. However, I am unable to calculate how much performance I actually gained by rendering the HTML server-side because I also deleted the entire [Leaflet](http://leafletjs.com/examples.html) map and it's dependencies. Overall great performance boost but still extremely slow.

* **Total load time:** 03.30m

### Run 3: JS + CSS Minification & Critical CSS

![JS + CSS Minification & Critical CSS](./images/3-js_css-minify-critical-css.png)

The first thing I did after rewriting the codebase was minifying the JavaScript files using [UglyfyJS](https://github.com/mishoo/UglifyJS2) and minifying the CSS file. My next step was generating the required critical CSS, in my case, this meant the entire CSS file. Other than the smaller file sizes it didn't really result in any performance gain. In the end, not a single second was gained.

* **Total load time:** 03.30m

### Run 4: Images Lazy Loading

![Images Lazy Loading](./images/4-lazy-loading.png)

What a boost! I went from over 3 minutes to 28 and a half seconds. My biggest issue was the large number of images being rendered at the same time. Using [Lazyload](https://www.npmjs.com/package/lazyload) I was able to implement lazy loading with resulted in a performance boost I had not expected. Overall extremely pleased with the results so far.

* **Total load time:** 28.29s

### Run 5: Minify HTML

![Minify HTML](./images/5-html-minify.png)

Every millisecond count, even when the differences are invisible, right? Yeah... Anyway, next I minified my server-side rendered HTML file using the Express middleware [express-minify-html](https://github.com/Konnng/express-minify-html).

* **Total load time:** 28.16s

### Run 6: gZip

![gZip](./images/6-gzip.png)

Enabling gZip with [Compression](https://www.npmjs.com/package/compression) was my last optimization step for this project. It resulted in an 8 seconds performance gain. On faster networks, the website renders almost immediately. Overall I am extremely happy with how this project turned out.

* **Total load time:** 20.08s