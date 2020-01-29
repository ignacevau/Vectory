<template>
  <div id="color-picker" class="color-picker" v-bind:style="{ display: show }">

    <div id="picker-handle" class="picker-handle" v-bind:style="{ marginTop: ph_top + 'px', marginLeft: ph_left + 'px', backgroundColor: color }"></div>
    <div class="slider-handle" v-bind:style="{ marginTop: sh_top + 'px', marginLeft: sh_left + 'px' }"></div>

    <div id="behindScreen" style="width: 100%; height: 100%;" @click="hide()"></div>
    <div class="container">
      <div class="top">

      </div>

      <div class="middle">
        <canvas id="picker"></canvas>
        <canvas id="slider"></canvas>
      </div>

      <div class="bottom">
        <div class="button-container">
          <span class="button" @click="setColor()">ok</span>
          <span class="button" style="margin-left: 5px;" @click="hide()">cancel</span>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapState } from 'vuex'
import { bus } from '@/main.js'

export default {
  name: 'ColorPicker',
  data: function() {
    return {
      ph_top: 0,
      ph_left: 0,

      sh_top: 0,
      sh_left: 0,

      color: "transparent"
    }
  },
  methods: {
    ...mapMutations([
      'HIDE_COLORPICKER'
    ]),
    hide: function() {
      bus.$emit('hide_colorpicker')
      this.HIDE_COLORPICKER();
    },
    setColor: function() {
      bus.$emit('set_color');
      this.hide();
    }
  },
  computed: {
    ...mapGetters([
      'clamp'
    ]),
    ...mapState([
      'COLORPICKER_ACTIVE'
    ]),
    show: function() {
      return this.COLORPICKER_ACTIVE ? '' : 'none'
    }
  },
  mounted: function() {
    var self = this;

    this.ph_top = 3;
    var picker = document.getElementById("picker");
    const pickerHandle = document.getElementById("picker-handle");
    var slider = document.getElementById("slider");

    var ctx_slider = slider.getContext('2d')
    var ctx_picker = picker.getContext('2d')

    var grad_slider;
    var grad_picker;

    var picker_color = [255, 0, 0];

    setPickerHeight();
    setSliderHeight();
  
    drawSliderGrad();
    drawPickerGrad(rgbToHex(...picker_color));

    // Initially hide the picker handle
    pickerHandle.style.display = "none";

    // The position of the picker's handle when adjusting the slider
    var pickerOffPos = {
      x: picker.width-1,
      y: 0.1
    }

    var wd = document.getElementById('color-picker')


    function setPickerHeight() {
      // Manually reset canvas' size to prevent scaling
      picker.width = window.innerHeight * 0.3*0.9 - 4;
      picker.height = window.innerHeight * 0.3*0.87 - 4;
    }

    function setSliderHeight() {
      // Manually reset canvas' size to prevent scaling
      slider.width = window.innerHeight * 0.03;
      slider.height = window.innerHeight * 0.3*0.87 - 4;
    }

    let setSliderHandle = () => {
      // Set the slider handle's position when colorpicker is not displayed
      var setNone = false;
      if(wd.style.display == 'none') {
        wd.style.display = '';
        setNone = true;
      }
      
      this.sh_left = slider.getBoundingClientRect().x - 4
      this.sh_top = slider.getBoundingClientRect().y - 2.5

      this.ph_left = picker.getBoundingClientRect().x - 5 + picker.width
      this.ph_top = picker.getBoundingClientRect().y - 5

      if(setNone)
        wd.style.display = 'none';
    };
    
    function drawSliderGrad() {
      // Create slider gradient
      grad_slider = ctx_slider.createLinearGradient(slider.width, slider.height, slider.width, 0);

      // Create gradient
      grad_slider.addColorStop(0.000, 'rgba(255, 0, 0, 1.000)');
      grad_slider.addColorStop(0.150, 'rgba(255, 0, 255, 1.000)');
      grad_slider.addColorStop(0.330, 'rgba(0, 0, 255, 1.000)');
      grad_slider.addColorStop(0.490, 'rgba(0, 255, 255, 1.000)');
      grad_slider.addColorStop(0.670, 'rgba(0, 255, 0, 1.000)');
      grad_slider.addColorStop(0.840, 'rgba(255, 255, 0, 1.000)');
      grad_slider.addColorStop(1.000, 'rgba(255, 0, 0, 1.000)');
      
      ctx_slider.fillStyle = grad_slider;
      ctx_slider.fillRect(0, 0, slider.width, slider.height);
    }

    function drawPickerGrad(color) {
      // Create picker white-color gradient
      grad_picker = ctx_picker.createLinearGradient(0, 0, ctx_picker.canvas.width, 0);
      grad_picker.addColorStop(0, 'white');
      grad_picker.addColorStop(1,  color);

      ctx_picker.fillStyle = grad_picker;
      ctx_picker.fillRect(0, 0, ctx_picker.canvas.width, ctx_picker.canvas.height);

      // Create picker black-transparent gradient
      grad_picker = ctx_picker.createLinearGradient(0, 0, 0, ctx_picker.canvas.height);
      grad_picker.addColorStop(0, 'rgba(0,0,0,0)');
      grad_picker.addColorStop(1,  '#000');

      ctx_picker.fillStyle = grad_picker;
      ctx_picker.fillRect(0, 0, ctx_picker.canvas.width, ctx_picker.canvas.height);
    }

    function getMousePos(canvas, evt) {
      var _rect = canvas.getBoundingClientRect();
      return {
          x: (evt.clientX - _rect.x),
          y: (evt.clientY - _rect.y)
      };
    }

    function componentToHex(c) {
      var hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    }

    function rgbToHex(r, g, b) {
      return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }

    function handleSliderChange(e) {
      var x = getMousePos(slider, e).x
      var y = getMousePos(slider, e).y

      x = 0;
      y = self.clamp(y, 0, slider.height-1)

      var data = ctx_slider.getImageData(x, y, 1, 1).data;
      picker_color = [data[0], data[1], data[2]];
      drawPickerGrad(rgbToHex(...picker_color))

      handlePickerChange(null, pickerOffPos.x, pickerOffPos.y)
    }

    let handlePickerChange = (e, _x, _y) => {
      var x;
      var y;

      pickerHandle.style.display = "";

      if(!_x || !_y) {
        x = getMousePos(picker, e).x;
        y = getMousePos(picker, e).y;

        x = self.clamp(x, 0.1, picker.width-1)
        y = self.clamp(y, 0.1, picker.height-1)

        pickerOffPos.x = x
        pickerOffPos.y = y
      }
      else {
        x = _x;
        y = _y;
      }

      var data = ctx_picker.getImageData(x, y, 1, 1).data;
      var color = {
        rgb: data,
        hex: rgbToHex(data[0], data[1], data[2])
      }

      this.color = color.hex;
      bus.$emit('color_change', color);
    }


    setSliderHandle()


    var pickerDown = false
    picker.addEventListener('mousedown', (e) => {
      // Change the handle's position
      this.ph_top = e.clientY-5
      this.ph_left = e.clientX-5

      handlePickerChange(e)
      pickerDown = true
    });

    var sliderDown = false
    slider.addEventListener('mousedown', (e) => {
      sliderDown = true
      handleSliderChange(e)

      var _rect = slider.getBoundingClientRect();

      // Change the handle's position
      this.sh_top = this.clamp(e.clientY-1.5, _rect.y-1.5, _rect.y + slider.height-1.5)
    });

    window.addEventListener('mousemove', (e) => {
      if(pickerDown) {
        var _rect = picker.getBoundingClientRect();

        // Change the picker handle's position
        this.ph_top = this.clamp(e.clientY-5, _rect.y-5, _rect.y + picker.height-5)
        this.ph_left = this.clamp(e.clientX-5, _rect.x-5, _rect.x + picker.width-5)

        handlePickerChange(e);
      }
      if(sliderDown) {
        var _rect = slider.getBoundingClientRect();

        // Change the handle's position
        this.sh_top = this.clamp(e.clientY-1.5, _rect.y-1.5, _rect.y + slider.height-1.5)

        handleSliderChange(e);
      }
    });

    window.addEventListener('resize', function() {
      setPickerHeight();
      setSliderHeight();

      drawPickerGrad(rgbToHex(...picker_color))
      drawSliderGrad();

      setSliderHandle()
    })

    window.addEventListener('mouseup', function() {
      sliderDown = false
      pickerDown = false
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.color-picker {
  position: absolute;
  width: 100vw;
  height: 100vh;
  pointer-events: all;
  z-index: 10;
}
.container {
  top: 30vh;
  left: 35vw;
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 32vh;
  height: 37vh;
  background-color: rgb(100, 100, 100);
  border-radius: 5px;
  box-shadow: 0px 0px 40px 5px rgba(0, 0, 0, 0.473);
  cursor: default !important;

  canvas {
    border-radius: 2px;
  }

  .top {
    height: 13%;
    width: 100%;
    background-color:rgb(49, 49, 49);
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }

  .middle {
    display: flex;
    justify-content: space-between;
    align-content: center;
    width: 95%;
    height: 70%;
  }

  .bottom {
    width: 80%;
    height: 13%;
    border-top: 1px solid rgb(106, 162, 247);
    display: flex;
    justify-content: center;
    align-items: center;


    .button-container {
      width: 70%;
      display: flex;
      justify-content: space-between;

      .button {
        width: 45%;
        height: 80%;
        background-color: rgb(202, 202, 202);
        font-family: Comfortaa;
        font-size: 0.8em;
        color: black;
        text-align: center;
        line-height: 25px;
        border-radius: 2px;
        margin-right: 2px;
      }
      .button:hover {
        background-color: rgb(112, 153, 214);
      }
      .button:active {
        background-color: rgb(145, 184, 243);
      }
    }
  }
}

.picker-handle {
  position: absolute;
  width: 15px;
  height: 15px;
  border-radius: 10px;
  border: 2px solid white;
  z-index: 10;
  pointer-events: none;
}
.slider-handle {
  position: absolute;
  width: 30px;
  height: 4px;
  border-radius: 1px;
  background-color: white;
  // border: 2px solid white;
  z-index: 10;
  pointer-events: none;
}
</style>
