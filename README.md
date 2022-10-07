# Gradient Picker for Apostrophe

This module will add a new `gradientPicker` field type to your project. It will allow the Editor to select up to 10 colors to be added to a linear gradient. For the moment, it only takes direction in degrees. It also creates a new Nunjucks filter to apply the colors in your template.

## Installation

To install the module, use the command line to run this command in an Apostrophe project's root directory:

```
npm install https://github.com/BoDonkey/gradient-field.git
```

## Usage

Once the module is installed, you will need to add it to your `app.js` file. 

```javascript
...
modules: {
  ...
  'gradient-field': {}
  ...
}
```

Next, you can add it to any page as an Editor option. In addition to a `label`, you can also add default values through the `def` property with an object containing `angle` and `colors` properties. `angle` should be an integer angle in degrees, and `colors` should be an array of valid HTML color strings, like `#ffffff`. The color string may optionally include alpha channel as well. These set the colors that initially populate the picker.

```javascript
// modules/custom-page/index.js
...
'background-color': {
    type: 'gradientPicker',
    label: 'Background Gradient Picker',
    def: {
      angle: 90,
      colors: [ '#4a90e2ff', '#d61f1fff' ]
    }
  }
...
```
 In the page template you can access your color data by using `data.page.<fieldname>` and filter it through  the `makeGradient` filter. For the example above, to add the newly made gradient as a style on the page:
```django
<style>
 body: {
 background: {{ data.page.background-color | makeGradient }};
 }
 </style>
 ```
