<template>
  <AposInputWrapper
    :field="field"
    :error="null"
    :uid="uid"
    :display-options="displayOptions"
    :modifiers="modifiers"
  >
    <template #body>
      <div class="apos-input-object">
        <div class="apos-input-wrapper">
          <div id="color-square" :style="{ background: gradient }" />
          <div>
            <AposSchema
            :schema="schema" v-model="schemaInput" :trigger-validation="triggerValidation"
            :utility-rail="false" :generation="generation"
            />
          </div>
          <div>
            <AposSchema
            :schema="schematwo" v-model="schemaInput" :trigger-validation="triggerValidation"
            :utility-rail="false" :generation="generation"
            />
          </div>
          <footer class="apos-link-control__footer">
            <AposButton type="button" label="+" :disabled="addLimit" @click="addColor" />
            <AposButton type="button" label="-" :disabled="removeLimit" @click="removeColor" />
          </footer>
        </div>
      </div>
    </template>
  </AposInputWrapper>
</template>

<script>
import AposInputMixin from 'Modules/@apostrophecms/schema/mixins/AposInputMixin';
import AposInputWrapper from 'Modules/@apostrophecms/schema/components/AposInputWrapper.vue';

export default {
  name: 'ColorGradientPicker',
  components: {
    AposInputWrapper
  },
  mixins: [ AposInputMixin ],
  props: {
    generation: {
      type: Number,
      required: false,
      default() {
        return null;
      }
    }
  },
  data() {
    const next = this.getNext();
    console.log('next', next);
    const parsedSchema = this.parseSchema(next);
    return {
      schema: parsedSchema,
      schematwo: [
        {
          name: 'test',
          type: 'range'
        }
      ],
      schemaInput: {
        data: next
      },
      next
    };
  },
  computed: {
    gradient() {
      const _data = { ...this.schemaInput.data };
      console.log('_data', _data);
      let colorString = `linear-gradient(${_data.gradientangle}deg`;
      delete _data.gradientangle;
      Object.values(_data).forEach(value => {
        colorString = `${colorString}, ${value}`;
      });
      colorString = colorString + ')';
      return colorString;
    },
    addLimit() {
      if (this.schema.length === 10) {
        return true;
      }
      return false;
    },
    removeLimit() {
      if (this.schema.length < 3) {
        return true;
      }
      return false;
    }
  },
  watch: {
    schemaInput() {
      this.next = this.schemaInput.data;
    },
    generation() {
      this.next = this.getNext();
      this.schemaInput = {
        data: this.next
      };
    }
  },
  methods: {
    validate(value) {
      if (this.schemaInput.hasErrors) {
        return 'invalid';
      }
    },
    getNext() {
      console.log(this.value.data);
      return this.value ? this.value.data : (this.field.def || {});
    },
    parseSchema(next) {
      const defaultSchema = [
        {
          name: 'gradientangle',
          label: 'Gradient Angle',
          type: 'range',
          min: 0,
          max: 360,
          unit: 'deg'
        },
        {
          name: 'colorone',
          label: 'Color One',
          type: 'color'
        },
        {
          name: 'colortwo',
          label: 'Color Two',
          type: 'color'
        }
      ];
      if (Object.keys(next).length < 4) {
        return defaultSchema;
      } else {
        const returnedSchema = [];
        for (const [key, value] of Object.entries(next)) {
          if (key === 'gradientangle') {
            const field = {
              name: 'gradientangle',
              label: 'Gradient Angle',
              type: 'range',
              min: 0,
              max: 360,
              unit: 'deg'
            };
            returnedSchema.push(field);
          } else {
            let number = key.split('color')[1];
            number = number.charAt(0).toUpperCase() + number.slice(1);
            let field = {
              name: key,
              label: `Color ${number}`,
              type: 'color'
            };
            returnedSchema.push(field);
          };
        }
        return returnedSchema;
      }
    },
    addColor() {
      const fieldNumbers = [ 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten' ];
      const currentField = this.schema.length;
      const newSchema = {
        name: `color${fieldNumbers[currentField].toLowerCase()}`,
        label: `Color ${fieldNumbers[currentField]}`,
        type: 'color'
      };
      this.schema.push(newSchema);
    },
    removeColor() {
      this.schema.pop();
    }
  }
};
</script>

<style lang="scss" scoped>
#color-square {
  height: 200px;
  width: 100%;
}

li {
  list-style: none;
}

.apos-input-object {
  border-left: 1px solid var(--a-base-9);
}

.apos-input-wrapper {
  margin: 20px 0 0 19px;
}

.apos-input-object ::v-deep .apos-schema .apos-field {
  margin-bottom: 30px;
}
</style>