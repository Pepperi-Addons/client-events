import angular from 'rollup-plugin-angular';
import resolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';
import includePaths from 'rollup-plugin-includepaths';
import sass from 'node-sass';
import CleanCSS from 'clean-css';
import { minify as minifyHtml } from 'html-minifier';
import builtins from 'rollup-plugin-node-builtins'
import globals from 'rollup-plugin-node-globals'

const cssmin = new CleanCSS();
const htmlminOpts = {
    caseSensitive: true,
    collapseWhitespace: true,
    removeComments: true,
};
import Utils from 'rollup-plugin-app-utils';

export default [{
   input: 'src/main.ts',
   output: {
     file: '../publish/editor.plugin.bundle.js',
     format: 'umd',
     name: 'editor',
     globals: {
      'loadsh': '_'
    }
},
   plugins: [
      angular({
         preprocessors: {
           template: template => minifyHtml(template, htmlminOpts),
           style: scss => {
               const css = sass.renderSync({ data: scss }).css;
               return cssmin.minify(css).styles;
           },
         }
       }),
     Utils.i18nBundler({
        target: './src/assets/',
        baseLanguage: 'en',
        // Optional
        transformer: (lang, data) => {
          return data
        }
     }),
     {
        name:'my-example',
        resolveId(source) {
           if (source === 'perf_hooks') {
              return source;
           }
           else if (source === 'node-fetch') {
            return source;
           }
           return null;
        },
        load(id) {
         if (id === 'perf_hooks') {
            return 'export default { performance }';
         }
         if (id === 'node-fetch') {
            return 'export default window.fetch.bind(window)';
         }
         return null;
        }
     },
     resolve({
        jsnext: true,
        main: true,
        // pass custom options to the resolve plugin
        customResolveOptions: {
           moduleDirectory: './../../node_modules'
        },
        browser: true
     }),
     typescript({
      tsconfig: "tsconfig.json",
      check: false,
      // typescript2: require('typescript2'),

     }),
     commonjs({
        namedExports: {
           '@pepperi-addons/papi-sdk': ['DataViewFieldTypes', 'PapiClient']
        }
     }),
     includePaths({ paths: ["s"] }),
     builtins(),
     globals(),
   ],
   external: [
     '@angular/core',
     '@angular/common',
     '@angular/cdk',
     '@angular/material',
     '@angular/http',
     '@angular/forms',
     '@angular/cdk/bidi',
     '@angular/cdk/coercion',
     '@angular/cdk/observers',
     '@angular/cdk/keycodes',
     '@angular/cdk/a11y',
     '@angular/cdk/platform',
     '@angular/router',
     'pepperi-user-service',
     'pepperi-addon-service',
     'pepperi-ngx-json-viewer',
   ],
}]
