const _ = require('lodash')
const tinycolor = require('tinycolor2');

module.exports = {
  init(self) {
    self.addVueGradientPickerFieldType();
    self.apos.template.addFilter({
      makeGradient: self.makeGradient
    });
  },
  methods(self) {
    return {
      addVueGradientPickerFieldType() {
        self.apos.schema.addFieldType({
          name: 'gradientPicker',
          convert: self.convert,
          vueComponent: 'ColorGradientPicker'
        });
      },
      async convert(req, field, data, object) {
        console.log('in convert', data[field.name]);
        const input = data[field.name];

        // Check it is the right type of data
        if (typeof input !== 'object') {
          throw self.apos.error('malformed');
        }

        // Check if required and present
        if (field.required && (_.isUndefined(input) || Object.keys(input).length >= 2)) {
          throw self.apos.error('required');
        }

        // Launder each color
        Object.keys(input).forEach(function(key) {
          input[key] = self.apos.launder.string(input[key]);
        }
        );

        // Make sure each value is a valid color value
        for (const [key, value] of Object.entries(input)) {
          const test = tinycolor(value);
          if (!tinycolor(test).isValid()) {
            throw self.apos.error('not color string');
          }
        }

        object[field.name] = input;
      },
      makeGradient(colorData) {
        let colorString = 'linear-gradient(45deg';
        for (const [key, value] of Object.entries(colorData)) {
          colorString = `${colorString}, ${value}`;
        };
        colorString = colorString + ')';
        console.log(colorString);
        return colorString;
      }
    };
  }
};
