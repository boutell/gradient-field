<div align="center">
  <img src="https://raw.githubusercontent.com/apostrophecms/apostrophe/main/logo.svg" alt="ApostropheCMS logo" width="80" height="80">

  <h1>Apostrophe Events</h1>
  <p>
    <a aria-label="Apostrophe logo" href="https://v3.docs.apostrophecms.org">
      <img src="https://img.shields.io/badge/MADE%20FOR%20Apostrophe%203-000000.svg?style=for-the-badge&logo=Apostrophe&labelColor=6516dd">
    </a>
    <a aria-label="Test status" href="https://circleci.com/gh/apostrophecms/event/tree/main">
      <img alt="" src="https://img.shields.io/circleci/build/github/apostrophecms/event?labelColor=000000&logo=circleci&style=for-the-badge">
    </a>
    <a aria-label="Join the community on Discord" href="http://chat.apostrophecms.org">
      <img alt="" src="https://img.shields.io/discord/517772094482677790?color=5865f2&label=Join%20the%20Discord&logo=discord&logoColor=fff&labelColor=000&style=for-the-badge&logoWidth=20">
    </a>
    <a aria-label="License" href="https://github.com/apostrophecms/event/blob/main/LICENSE.md">
      <img alt="" src="https://img.shields.io/static/v1?style=for-the-badge&labelColor=000000&label=License&message=MIT&color=3DA639">
    </a>
  </p>
</div>

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

Next, you can add it to any page as an Editor option. In addition to a `label`, you can also add default values through the `def` property with an object composed of three properties, `gradientangle`, `colorone`, and `colortwo`. The first takes an integer for the gradient angle. These keys take hex colors with alpha and will set the colors that initially populate the picker.
```javascript
// modules/custom-page/index.js
...
'background-color': {
    type: 'gradientPicker',
    label: 'Background Gradient Picker',
    def: {
      gradientangle: 90,
      colorone: '#4a90e2ff',
      colortwo: '#d61f1fff'
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
