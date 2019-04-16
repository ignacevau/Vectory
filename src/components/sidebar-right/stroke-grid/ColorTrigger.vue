<template>
  <div class="color-trigger">
    <div class="box" v-bind:style="{ 'background-color': color }" @click="showColorpicker()">
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
    'colorTypePrefix'
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
    SELECTED: function(_new, _old) {
      if(_new.length == 0) {
        this.color = 'rgb(94, 94, 94)'
        this.oldColor = this.color
        return
      }
      else if(!_new[0][this.colorTypePrefix + "Color"]) {
        this.color = 'rgb(94, 94, 94)'
        this.oldColor = this.color
        return
      }
      else {
        var sw = _new[0][this.colorTypePrefix + "Color"]

        for(var i=0; i<_new.length; i++) {
          if(_new[i][this.colorTypePrefix + "Color"] != sw) {
            this.color = 'rgb(94, 94, 94)'
            this.oldColor = this.color
            return
          }
        }
      }

      this.color = _new[0][this.colorTypePrefix + "Color"]._canvasStyle
      this.oldColor = this.color
    }
  },
  computed: {
    ...mapState([
      'SELECTED'
    ])
  },
  mounted: function() {
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
        bus.$emit('set_color_' + this.colorTypePrefix, this.color);
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
}
.box:hover {
  border: 1px solid white;
  border-radius: 1px;
}
.box:active {
  border: 2px solid white;
}
</style>