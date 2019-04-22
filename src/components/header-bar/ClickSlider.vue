<template>
  <div class="click-slider">
    <input type="text" v-model="value" />

    <div class="slider">
      <div class="sliderTrigger" ref="sliderTrigger">
        <div>o</div>
      </div>

      <div class="input" ref="slider">
        <div class="handle"  ref="handle"></div>
        <div class="track"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ClickSlider',
  props: [
    'parentOpacity'
  ],
  data: function() {
    return {
      sliderActive: false,
      value: 100
    }
  },
  computed: {
    ...mapGetters([
      'clamp'
    ]),
    showSlider: function() {
      sliderActive: true
      this.$refs['slider'].style.display = ''
    }
  },
  watch: {
    parentOpacity: function(_new, _old) {
      this.value = _new
    }
  },
  mounted: function() {
    var sliderDown = false;
    var sliderTrigger = this.$refs['sliderTrigger']
    var slider = this.$refs['slider']
    var height = slider.clientHeight;
    var offsetTop = this.$refs['handle'].getBoundingClientRect().y + this.$refs['handle'].clientHeight / 2;

    slider.style.display = 'none'
    

    sliderTrigger.addEventListener('mousedown', (e) => {
      sliderTrigger.style.pointerEvents = 'none'
      sliderDown = true
      this.$refs['slider'].style.display = ''
      slider.firstChild.style.top = '0%'
    });

    window.addEventListener('mouseup', (e) => {
      if(sliderDown) {
        sliderDown = false
        this.$refs['slider'].style.display = 'none'
        sliderTrigger.style.pointerEvents = ''
      }
    });

    window.addEventListener('mousemove', (e) => {
      if(sliderDown) {
        var rel = (e.clientY - offsetTop) / height
        var value = this.clamp(rel, 0, 1) * 100

        slider.firstChild.style.top = value + '%'
        this.value = Math.round(value)
        this.$emit('value-change', this.value)
      }
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
$track-w: 10em;
$track-h: 50px;
$thumb-d: 1.5em;

.click-slider {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  z-index: 10;
}

.click-slider > input {
  margin-bottom: 3px;
  width: 35px;
  height: 18px;
  background-color: rgb(94, 94, 94);
  border: 0px solid black;
  color: rgb(221, 221, 221);
  font-family: Comfortaa;
  background-color: rgb(112, 112, 112);
  text-align: center;
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
  margin-right: 0;
}

.slider {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.slider .sliderTrigger {
  background-color: rgb(82, 82, 82);
  width: 17px;
  height: 17px;
  margin-bottom: 3px;
  border-bottom-right-radius: 3px;
  border-top-right-radius: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  -moz-user-select: none;

  &:hover {
    background-color: rgb(71, 71, 71);
  }
}

.input {
  height: $track-h;
  position: absolute;
  top: 50%;
  display: flex;
  justify-content: center;
  align-items: flex-start;

  & .handle {
    margin-top: -6px;
    width: 12px;
    height: 12px;
    top: 0%;
    border-radius: 10px;
    background-color: rgb(94, 158, 255);
    position: absolute;
  }

  & .track {
    height: 100%;
    width: 4px;
    background-color: rgb(221, 221, 221);
    border-radius: 10px;
  }
}

input:active {
  outline-width: 1px;
}
</style>
