<template>
  <AposInputWrapper :field="field" :error="null" :uid="uid" :display-options="displayOptions" :modifiers="modifiers"
    :value="value">
    <template #body>
      <div class="apos-input-object">
        <div class="apos-input-wrapper">
          <div id="color-square" :style="{ background: gradient }" />
          <div>
            <AposSchema
              :schema="angleSchema"
              :trigger-validation="triggerValidation"
              :utility-rail="false"
              :generation="generation"
              v-model="angleSchemaInput"
              ref="schema"
            />
          </div>
          <div>
            <ul>
              <h3>Colors</h3>
              <li v-for="color in colors" v-bind:key="color.id">
                <AposSchema
                  :schema="colorSchema"
                  v-model="color.schemaInput"
                  :trigger-validation="triggerValidation"
                  :utility-rail="false"
                  :generation="generation"
                />
                <div>
                  <span>
                    <button @click="moveUp(color.id)" :disabled="disableMoveUp(color.id)">Up</button>
                    <button @click="moveDown(color.id)" :disabled="disableMoveDown(color.id)">Down</button>
                  </span>
                  <span class="span-right">
                    <button @click="remove(color.id)">Trash</button>
                  </span>
                </div>
              </li>
            </ul>
          </div>
          <footer class="apos-link-control__footer">
            <AposButton type="button" label="+" :disabled="disableAdd()" @click="add" />
          </footer>
        </div>
      </div>
    </template>
  </AposInputWrapper>
</template>

<script>

import AposInputMixin from 'Modules/@apostrophecms/schema/mixins/AposInputMixin';
import AposInputWrapper from 'Modules/@apostrophecms/schema/components/AposInputWrapper.vue';
import AposButton from 'apostrophe/modules/@apostrophecms/ui/ui/apos/components/AposButton.vue';
import cuid from 'cuid';

const defColor = '#4a90e2ff';

export default {
  name: 'ColorGradientPicker',
  components: {
    AposInputWrapper,
    AposButton
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
    return {
      next,
      angleSchemaInput: expandAngle(next.angle),
      colors: expandColors(next.colors),
      // These schemas are really constants, but this is a convenient
      // way to make them component properties
      angleSchema: [
        {
          name: 'angle',
          label: 'Angle',
          type: 'range',
          min: 0,
          max: 360,
          unit: 'deg'
        }
      ],
      colorSchema: [
        {
          name: 'color',
          label: 'Color',
          type: 'color',
          def: defColor
        }
      ],
    };
  },
  computed: {
    gradient() {
      return `linear-gradient(${this.next.angle}deg, ${this.next.colors.join(', ')})`;
    }
  },
  watch: {
    generation() {
      this.next = this.getNext();
      this.angleSchemaInput = expandAngle(this.next.angle);
      this.colors = expandColors(this.next.colors);
    },
    angleSchemaInput: {
      deep: true,
      handler() {
        if (!this.angleSchemaInput.hasErrors) {
          this.next = {
            ...this.next,
            angle: this.angleSchemaInput.data.angle
          };
        }
      }
    },
    colors: {
      deep: true,
      handler() {
        if (!this.colors.find(color => color.schemaInput.hasErrors)) {
          this.next = {
            ...this.next,
            colors: this.colors.map(color => color.schemaInput.data.color)
          };
        }
      }
    }
  },
  methods: {
    validate(value) {
      if (this.field.min) {
        if (this.colors.length < this.field.min) {
          return 'min';
        }
      }
      if (this.field.max) {
        if (this.colors.length > this.field.max) {
          return 'max';
        }
      }
      if (this.field.required) {
        if (!this.colors.length) {
          return 'required';
        }
      }
    },
    getNext() {
      return this.value.data ? this.value.data : (this.field.def || {
        angle: 90,
        colors: [ defColor ]
      });
    },
    disableMoveUp(id) {
      const index = this.colors.findIndex(color => color.id === id);
      return index === 0;
    },
    disableMoveDown(id) {
      const index = this.colors.findIndex(color => color.id === id);
      return (index + 1) === this.colors.length;
    },
    disableAdd() {
      return this.field.max && (this.colors.length >= this.field.max);
    },
    moveUp(id) {
      const index = this.colors.findIndex(color => color.id === id);
      this.colors = [
        ...this.colors.slice(0, index - 1),
        this.colors[index],
        this.colors[index - 1],
        ...this.colors.slice(index + 1)
      ];
    },
    moveDown(id) {
      const index = this.colors.findIndex(color => color.id === id);
      this.colors = [
        ...this.colors.slice(0, index),
        this.colors[index + 1],
        this.colors[index],
        ...this.colors.slice(index + 2)
      ];
    },
    remove(id) {
      this.colors = this.colors.filter(color => color. id !== id);
    },
    add() {
      this.colors.push({
        id: cuid(),
        schemaInput: {
          data: {
            color: defColor
          }
        },
      });
    }
  }
};

function expandAngle(angle) {
  return {
    data: {
      angle
    }
  };
}

function expandColors(colors) {
  return colors.map(color => ({
    id: cuid(),
    schemaInput: {
      data: {
        color
      }
    }
  }));
}
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

.span-right {
  float: right;
}
</style>
