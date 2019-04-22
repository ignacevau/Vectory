<template>
  <div class="color-trigger">
    <div class="box" v-bind:style="{ 'background-color': color }" @click="showColorpicker()">
      <img src="@/assets/color-undefined.png" v-if="parentColor == 'none' ? true : false" />
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import { bus } from '@/main.js'

export default {
  name: 'ColorTrigger',
  data: function() {
    return {
      oldColor: 'rgb(94, 94, 94)',
      color: 'rgb(94, 94, 94)',
      changingColor: false
    }
  },
  props: [
    'parentColor'
  ],
  methods: {
    ...mapMutations([
      'SHOW_COLORPICKER'
    ]),
    showColorpicker: function() {
      this.changingColor = true;
      this.SHOW_COLORPICKER();
    }
  },
  watch: {
    parentColor: function(_new, _old) {
      if(_new == 'none') {
        this.color = 'rgb(94, 94, 94)'
      }
      else {
        this.color = _new
      }
    }
  },
  mounted: function() {
    this.color = this.parentColor

    bus.$on('color_change', (color) => {
      if(this.changingColor) {
        this.color = color.hex;
      }
    });

    bus.$on('hide_colorpicker', () => {
      if(this.changingColor) {
        this.color = this.oldColor
        this.changingColor = false
      }
    });

    bus.$on('set_color', () => {
      if(this.changingColor) {
        this.$emit('value-change', this.color);
        this.changingColor = false;
        this.oldColor = this.color
      }
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.box {
  width: 17px;
  height: 17px;
  border: 1.5px solid rgb(226, 226, 226);
  background-color: red;
  border-radius: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.box:hover {
  border: 1px solid white;
  border-radius: 1px;
}
.box:active {
  border: 2px solid white;
}
.box img {
  max-height: 40%;
  max-width: 40%;
}
</style>