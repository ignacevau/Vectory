<template>
  <div class="header-circle">

    <div class="color-container">
      <div class="color">
        <div class="color-selector">
          <div>
            <input type="radio" name="fill_stroke" value="STROKE" v-model="colorType" checked />
            <span>
              <img src="@/assets/fill.png" />
            </span>
          </div>
          <div>
            <input type="radio" name="fill_stroke" value="FILL" v-model="colorType" />
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
    </div>

    <div class="width-container">
      <div class="width">
        <div>
          WIDTH
        </div>
        <width-input2 start-value="1" v-bind:parentWidth="width" @value-change="widthChange" />
      </div>
    </div>

    <div class="opacity-container">
      <div class="opacity">
        <div>
          OPACITY
        </div>
        <click-slider v-bind:parentOpacity="opacity" @value-change="sliderChange" />
      </div>
    </div>

  </div>
</template>
<script>
import { mapMutations, mapState } from 'vuex'
import ColorTrigger from '@/components/sidebar-right/stroke-grid/ColorTrigger.vue'
import WidthInput2 from '@/components/header-bar/WidthInput2.vue'
import ClickSlider from '@/components/header-bar/ClickSlider.vue'

export default {
  name: 'HeaderCircle',
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
      'CIRCLE_STROKECOLOR',
      'CIRCLE_FILLCOLOR',
      'CIRCLE_WIDTH',
      'CIRCLE_OPACITY'
    ])
  },
  methods: {
    ...mapMutations([
      'CIRCLE_SET_WIDTH',
      'CIRCLE_SET_OPACITY',
      'CIRCLE_SET_STROKECOLOR',
      'CIRCLE_SET_FILLCOLOR'
    ]),
    sliderChange: function(value) {
      this.opacity = value
      this.CIRCLE_SET_OPACITY(value / 100)
    },
    widthChange: function(value) {
      this.width = value
      this.CIRCLE_SET_WIDTH(value)
    },
    colorChange: function(value) {
      if(this.colorType == 'STROKE') {
        this.strokeColor = value
        this.CIRCLE_SET_STROKECOLOR(value)
      }
      else {
        this.fillColor = value
        this.CIRCLE_SET_FILLCOLOR(value)
      }
    }
  },
  watch: {
    colorType: function(_new, _old) {
      if(_new == 'STROKE') {
        this.color = this.CIRCLE_STROKECOLOR
      }
      else {
        this.color = this.CIRCLE_FILLCOLOR
      }
    }
  },
  mounted: function() {
    if(this.colorType == 'STROKE') {
      this.color = this.CIRCLE_STROKECOLOR
    }
    else {
      this.color = this.CIRCLE_FILLCOLOR
    }

    this.width = this.CIRCLE_WIDTH
    this.opacity = this.CIRCLE_OPACITY * 100
  }
}
</script>




<style lang="scss" scoped>
* {
  color: rgb(221, 221, 221);
  font-family: Comfortaa;
}
.header-circle {
  height: 100%;
  width: 55em;
  display: flex;
  align-items: center;

  .color-container {
    width: 14%;
    height: 60%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-right: 1px solid rgb(133, 133, 133);

    .color {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 85%;
      height: 100%;
    }
  }

  .width-container {
    width: 14%;
    height: 60%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-right: 1px solid rgb(133, 133, 133);


    .width {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 85%;
      height: 100%;
    }
    .width > div {
      font-size: 0.7em;
      margin-top: 2px;
    }
  }

  .opacity-container {
    width: 14%;
    height: 60%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-right: 1px solid rgb(133, 133, 133);

    .opacity {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 90%;
      height: 100%;
    }
    .opacity > div {
      font-size: 0.7em;
      margin-top: 2px;
    }
  }
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
  cursor: pointer;
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
</style>
