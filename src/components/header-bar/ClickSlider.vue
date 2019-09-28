<template>
  <div class="click-slider">
    <input type="text" v-model="value" />

    <div class="slider">
      <div class="sliderTrigger" ref="sliderTrigger">
        <span>⬤</span>
      </div>

      <div class="input" ref="slider">
        <div class="handle" ref="handle"></div>
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
    'parentValue'
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
    parentValue: function(_new, _old) {
      this.value = _new;
      this.$emit('value-change', _new);
    }
  },
  mounted: function() {
    var sliderDown = false;
    var sliderTrigger = this.$refs['sliderTrigger']
    var slider = this.$refs['slider']
    var height = slider.getBoundingClientRect().height;
    var offsetTop = slider.getBoundingClientRect().top;

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
@import '@/library.scss';

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
  width: 35px;
  height: 18px;
  border-width: 0px;
  color: rgb(255, 255, 255);
  font-family: Montserrat;
  background-color: rgb(139, 139, 139);
  text-align: center;
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
}

.slider {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.slider .sliderTrigger {
  background-color: $DarkGray;
  width: 17px;
  height: 18px;
  border-bottom-right-radius: 3px;
  border-top-right-radius: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  -moz-user-select: none;
  font-size: 0.2em;
  color: white;

  &:hover {
    background-color: rgb(94, 94, 94);
  }
}

.input {
  height: $track-h;
  position: absolute;
  top: 50%;
  display: flex;
  justify-content: center;
  align-items: flex-start;

  .handle {
    margin-top: -6px;
    width: 12px;
    height: 12px;
    top: 0%;
    border-radius: 10px;
    background-color: rgb(94, 158, 255);
    position: absolute;
  }

  .track {
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
