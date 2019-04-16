<template>
  <div id="color-picker" class="color-picker" v-bind:style="{ display: show }">

    <div class="picker-handle" v-bind:style="{ marginTop: ph_top + 'px', marginLeft: ph_left + 'px' }"></div>
    <div class="slider-handle" v-bind:style="{ marginTop: sh_top + 'px', marginLeft: sh_left + 'px' }"></div>

    <div id="behindScreen" style="width: 100%; height: 100%;" @click="hide()"></div>
    <div id="container" class="container">
      <div id="panel">
        <canvas id="picker"></canvas>
      </div>

      <canvas id="slider"></canvas>

      <div class="right">
        <div class="values">
          <div class="rgb-holder"><span style="width: 2%;">r: </span> <input type="text" style="width: 50%; font-family: Comfortaa;"></div>
          <div class="rgb-holder"><span style="width: 2%;">g: </span> <input type="text" style="width: 50%; font-family: Comfortaa;"></div>
          <div class="rgb-holder"><span style="width: 2%;">b: </span> <input type="text" style="width: 50%; font-family: Comfortaa;"></div>
          <div class="rgb-holder" style="margin-top: 15px;"><span style="width: 2%;">a: </span><input type="text" style="width: 50%; font-family: Comfortaa;"></div>
        </div>

        <div style="display: flex; justify-content: center; align-items: center; flex-direction: column;">
          <div style="font-family: Comfortaa; color: white;">hex:</div>
          <input type="text" style="width: 80%; font-family: Comfortaa;">
        </div>

        <div class="buttons">
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
      sh_left: 0
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
    var picker = document.getElementById("picker")
    var slider = document.getElementById("slider")

    var ctx_slider = slider.getContext('2d')
    var ctx_picker = picker.getContext('2d')

    var grad_slider;
    var grad_picker;

    var picker_color = [255, 0, 0];

    setPickerHeight();
    setSliderHeight();
  
    drawSliderGrad();
    drawPickerGrad(rgbToHex(...picker_color));

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
      slider.width = window.innerHeight * 0.023;
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
      var rect = canvas.getBoundingClientRect();
      return {
          x: (evt.clientX - rect.x),
          y: (evt.clientY - rect.y)
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

    function handlePickerChange(e, _x, _y) {
      var x;
      var y;

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

      bus.$emit('color_change', color)
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

      var rect = slider.getBoundingClientRect();

      // Change the handle's position
      this.sh_top = this.clamp(e.clientY-1.5, rect.y-1.5, rect.y + slider.height-1.5)
    });

    window.addEventListener('mousemove', (e) => {
      if(pickerDown) {
        var rect = picker.getBoundingClientRect();

        // Change the picker handle's position
        this.ph_top = this.clamp(e.clientY-5, rect.y-5, rect.y + picker.height-5)
        this.ph_left = this.clamp(e.clientX-5, rect.x-5, rect.x + picker.width-5)

        handlePickerChange(e);
      }
      if(sliderDown) {
        var rect = slider.getBoundingClientRect();

        // Change the handle's position
        this.sh_top = this.clamp(e.clientY-1.5, rect.y-1.5, rect.y + slider.height-1.5)

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
<style scoped>
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
  justify-content: flex-start;
  align-items: center;
  text-align: center;
  width: 50vh;
  height: 30vh;
  background-color: rgb(100, 100, 100);
  border-radius: 10px;
  border: 4px solid rgb(106, 162, 247);
  box-shadow: 0px 0px 40px 5px rgba(0, 0, 0, 0.473);
  cursor: default !important;
}
#panel {
  margin-left: 3%;
  width: 55%;
  height: 90%;
  flex: 0 0 auto;
  border: 2px solid white;
}
#slider {
  margin-left: 1%;
}
.right {
  width: 34%;
  height: 90%;
  margin-left: 2%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  border-left: 3px solid rgb(106, 162, 247);
}
.values {
  font-family: Comfortaa;
  color: white;
}
.rgb-holder {
  display: flex; 
  justify-content: space-around; 
  margin-top: 3px;
  margin-left: 10px;
}
.buttons {
  margin-left: 2vw;
  width: 110%;
  height: 15%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.button {
  width: 40%;
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

.picker-handle {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: white;
  border: 1px solid black;
  z-index: 10;
  pointer-events: none;
}
.slider-handle {
  position: absolute;
  width: 25px;
  height: 4px;
  border-radius: 5px;
  background-color: white;
  border: 1px solid rgb(24, 24, 24);
  z-index: 10;
  pointer-events: none;
}
</style>
