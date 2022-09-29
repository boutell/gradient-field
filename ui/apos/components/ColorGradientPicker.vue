<template>
  <AposInputWrapper :field="field" :error="null" :uid="uid" :display-options="displayOptions" :modifiers="modifiers"
    :value="value">
    <template #body>
      <div class="apos-input-object">
        <div class="apos-input-wrapper">
          <div id="color-square" :style="{ background: gradient }" />
          <div>
            <AposInputRange :field="{
              name: 'angle',
              label: 'Gradient Angle',
              min: 0,
              max: 360,
              unit: 'deg',
              def: 90
            }" v-model="angleValue" :conditionMet="true" />
          </div>
          <div>
            <ul>
              <h3>Colors</h3>
              <li v-for="(color, index) in colors">
                <!-- This <p> is just temporary for debugging-->
                <p>{{ color }}</p>
                <AposSchema :schema="colorSchema" v-model="colorsValue" :trigger-validation="triggerValidation"
                :utility-rail="false" :generation="generation"
                :key="index" />
                <div>
                  <span>
                <button @click="moveUp" :disabled="atLimit">Up</button>
                <button @click="moveDown" :disabled="atLimit">Down</button>
                </span>
                <span class="span-right">
                  <button @click="removeColor(index)">Trash</button>
                </span>
                </div>
              </li>
            </ul>
          </div>
          <footer class="apos-link-control__footer">
            <AposButton type="button" label="+" @click="addColor" />
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
      colorSchema: [
        {
          name: 'color',
          type: 'color'
        }
      ],
      colorsValue: {
        data: next.colors
      },
      angleValue: {
        data: next.angle
      },
      next,
      colors: next.colors
    };
  },
  computed: {
    gradient() {
      // holder until final data structure
      return 'linear-gradient(45deg, #e66465, #9198e5)';
    },
    atLimit() {
      // disable buttons for the top or the bottom - need multiple functions?
      console.log('TBD');
      return false;
    }
  },
  watch: {
    angleValue() {
      this.next = {
        ...this.next,
        angle: this.angleValue.data
      }
    },
    colorsValue() {
      const newColorArray = this.setColorArray();
      const colorsLength = this.next.colorsLength;
      // spreading colorValue additionally to get error checking
      this.next = {
        ...this.next,
        ...this.colorValue,
        colors: newColorArray,
        colorsLength: colorsLength
      }
    },
    generation() {
      this.next = this.getNext();
      this.colorsValue = {
        data: this.next
      };
    }
  },
  methods: {
    validate(value) {
      return false;
    },
    getNext() {
      return this.value.data ? this.value.data : (this.field.def || {
        angle: 90,
        colors: [
          { data: {color: '#4a90e2ff'}}
        ],
        colorsLength: 1
      });
    },
    setColorArray() {
      const newColor = this.colorsValue.data;
      const newColorObject = {data:newColor};
      let newArray = [...this.next.colors];
      newArray.pop();
      // returning the array with push didn't work, but...
      newArray.push(newColorObject);
      return newArray
    },
    getColorSchema() {
      const returnedSchema = [
        {
          name: 'color',
          type: 'color'
        }
      ];
      return returnedSchema;
    },
    addColor() {
      this.next.colors.push({data: {color: '#00ff00ff'}});
      this.next.colorsLength++;
    },
    moveUp() {
      // need to pass a key and rearrange colors array? or...?
      console.log('TBD');
    },
    moveDown() {
      // need to pass a key and rearrange colors array? or...?
      console.log('TBD');
    },
    removeColor(index) {
      // need to pass a key and delete from array? or...?
      console.log('TBD');
      console.log('index',index);
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

.span-right {
  float: right;
}
</style>
