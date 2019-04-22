<template>
  <div class="header-line">
    <div class="color">
      <div class="color-selector">
        <div>
          <span>
            <img src="@/assets/stroke.png" />
          </span>
        </div>
      </div>

      <div class="color-text">
         {{ colorType }}
      </div>

      <color-trigger v-bind:parentColor="color" @value-change="colorChange" />
    </div>

    <div class="width">
      <div>
        WIDTH
      </div>
      <width-input2 v-bind:parentWidth="width" @value-change="widthChange" />
    </div>

    <div class="opacity">
      <div>
        OPACITY
      </div>
      <click-slider v-bind:parentOpacity="opacity" @value-change="sliderChange" />
    </div>
  </div>
</template>
<script>
import { mapMutations, mapState } from 'vuex'
import ColorTrigger from '@/components/sidebar-right/stroke-grid/ColorTrigger.vue'
import WidthInput2 from '@/components/header-bar/WidthInput2.vue'
import ClickSlider from '@/components/header-bar/ClickSlider.vue'

export default {
  name: 'HeaderLine',
  components: {
    ColorTrigger,
    WidthInput2,
    ClickSlider
  },
  data: function() {
    return {
      colorType: 'STROKE',

      color: 'black',
      width: 1,
      opacity: 100
    }
  },
  computed: {
    ...mapState([
      'LINE_STROKECOLOR',
      'LINE_WIDTH',
      'LINE_OPACITY'
    ])
  },
  methods: {
    ...mapMutations([
      'LINE_SET_WIDTH',
      'LINE_SET_OPACITY',
      'LINE_SET_STROKECOLOR'
    ]),
    sliderChange: function(value) {
      this.opacity = value
      this.LINE_SET_OPACITY(value / 100)
    },
    widthChange: function(value) {
      this.width = value
      this.LINE_SET_WIDTH(value)
    },
    colorChange: function(value) {
      this.strokeColor = value
      this.LINE_SET_STROKECOLOR(value)
    }
  },
  watch: {
    colorType: function(_new, _old) {
      this.color = this.LINE_STROKECOLOR
    }
  },
  mounted: function() {
    this.color = this.LINE_STROKECOLOR

    this.width = this.LINE_WIDTH
    this.opacity = this.LINE_OPACITY * 100
  }
}
</script>




<style lang="scss" scoped>
* {
  color: rgb(221, 221, 221);
  font-family: Comfortaa;
}
.header-line {
  height: 100%;
  width: 55em;
  display: flex;
  align-items: center;
}

.color {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 14%;
  height: 60%;
  border-right: 1px solid rgb(133, 133, 133);
}
.color-text {
  margin-left: -8px;
  width: 40%;
  font-size: 0.7em;
  text-align: center;
  height: 1em;
}
.color-selector {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 30px;
}
.color-selector div {
  height: 50%;
  width: 100%;
}
.color-selector img {
  max-height: 93%;
  max-width: 93%;
}
.color-selector span {
  width: 90%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 3px;
}
.color-selector input {
  opacity: 0;
  position: absolute;
  height: 20px;
  width: 20px;

  &:hover ~ span img {
    max-width: 90%;
    max-height: 90%;
  }
}

.color-selector input:checked ~ span {
  display: none;
}

.width {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 14%;
  height: 60%;
  border-right: 1px solid rgb(133, 133, 133);
}
.width > div {
  font-size: 0.7em;
  margin-top: 2px;
}

.opacity {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 14%;
  height: 60%;
  border-right: 1px solid rgb(133, 133, 133);
}
.opacity > div {
  font-size: 0.7em;
  margin-top: 2px;
}
</style>
