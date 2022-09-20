<template>
  <AposInputWrapper :field="field"
                    :error="null" :uid="uid" :display-options="displayOptions">
    <template #body>
      <div class="apos-input-object">
        <div class="apos-input-wrapper">
          <h2>Gradient Picker</h2>
          <div id="color-square"
               :style="{ background: gradient }" />
          <div>
            <AposSchema
              :schema="schema"
              v-model="schemaInput"
              :trigger-validation="triggerValidation"
              :utility-rail="false"
              :generation="generation" />
          </div>
          <footer class="apos-link-control__footer">
            <AposButton
              type="button"
              label="+"
              :disabled="addLimit"
              @click="addColor"
            />
            <AposButton
              type="button"
              label="-"
              :disabled="removeLimit"
              @click="removeColor"
            />
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
  mixins: [AposInputMixin],
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
    const parsedSchema = this.parseSchema(next);
    return {
      schema: parsedSchema,
      schemaInput: {
        data: next
      },
      next,
      gradientDirection: {
        data: {}
      }
    };
  },
  computed: {
    gradient() {
      let colorString = 'linear-gradient(45deg';
      for (const [key, value] of Object.entries(this.schemaInput.data)) {
        colorString = `${colorString}, ${value}`;
      };
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
    schemaInput: {
      handler(newValue, oldValue) {
        this.next = this.schemaInput.data;
      },
      deep: true
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
      return this.value.data ? this.value.data : (this.field.def || {});
    },
    parseSchema(next) {
      const defaultSchema = [
        {
          name: 'colorone',
          label: 'Color 1',
          type: 'color'
        },
        {
          name: 'colortwo',
          label: 'Color 2',
          type: 'color'
        }
      ];
      if (Object.keys(next).length < 2) {
        
        return defaultSchema;
      } else {
        const returnedSchema = [];
        Object.keys(next).forEach(function (key) {
          let number = key.split('color')[1];
          number = number.charAt(0).toUpperCase() + number.slice(1);
          let field = {
            name: key,
            label: `Color ${number}`,
            type: 'color'
          };
          returnedSchema.push(field);
        });
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
  width: 200px;
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
