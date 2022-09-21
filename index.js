const _ = require('lodash');
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
        const input = data[field.name];

        // Check it is the right type of data
        if (typeof input !== 'object') {
          throw self.apos.error('Data object is malformed');
        }

        // Check if required and present
        if (
          field.required &&
          (_.isUndefined(input) || Object.keys(input).length < 3)
        ) {
          throw self.apos.error('required');
        };

        // Make sure each value is a valid
        for (const [key, value] of Object.entries(input)) {
          if (key === 'gradientangle') {
            if (!Number.isInteger(value) || value > 360 || value < 0) {
              throw self.apos.error('Improper range value');
            }
          } else {
            const test = tinycolor(value);
            if (!tinycolor(test).isValid()) {
              throw self.apos.error('Not a color string');
            }
          }
        };

        object[field.name] = input;
      },
      makeGradient(colorData) {
        const _data = {...colorData};
        let colorString = `linear-gradient(${_data.gradientangle}deg`;
        delete _data.gradientangle;
        Object.values(_data).forEach((values) => {
          colorString = `${colorString}, ${value}`;
        });
        colorString = colorString + ')';
        return colorString;
      }
    };
  }
};