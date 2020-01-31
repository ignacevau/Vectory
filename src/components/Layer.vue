<template>
  <div class="layer">
    <label>
      <input type="radio" name="layers" v-on:click.prevent="" v-bind:checked="isLayerSelected" />
      <div>
        <div class="eye">
          <img v-bind:src="imgUrlEye()" v-on:click="triggerEye" />
        </div>

        <div class="name" v-on:mousedown="selectLayer">
          <span>{{ name }}</span>
        </div>
        
        <div class="selectall">
          <img v-bind:src="imgUrlSelect()" v-on:mousedown="selectDown" v-on:mouseup="selectUp" v-on:mouseleave="mouseLeaveSelect" />
        </div>
      </div>
    </label>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

var images = require.context('../assets/', false, /\.png$/)

export default {
  name: 'Layer',
  props: {
    number: Number,
    name: String
  },
  data: function() {
    return {
      eyeState: 'visible',
      selectState: 'stroke'
    }
  },
  computed: {
    ...mapState([
      'SELECTED_LAYER_INDEX',
      'LAYERS'
    ]),
    isLayerSelected: function() {
      return this.SELECTED_LAYER_INDEX == this.number;
    }
  },
  methods: {
    ...mapMutations([
      'SELECT_LAYER',
      'LAYER_SELECT_ALL',
      'LAYER_HIDE_SHAPES',
      'LAYER_UNHIDE_SHAPES'
    ]),
    imgUrlEye: function() {
      return images('./eye-' + this.eyeState + '.png')
    },
    imgUrlSelect: function() {
      return images('./select-' + this.selectState + '.png')
    },
    selectLayer: function() {
      this.SELECT_LAYER(this.number);
    },
    triggerEye: function() {
      this.eyeState = this.eyeState == 'visible' ? 'invisible' : 'visible'
      if(this.eyeState == 'invisible') 
        this.LAYER_HIDE_SHAPES(this.number);
      else
        this.LAYER_UNHIDE_SHAPES(this.number);
    },
    selectDown: function() {
      this.selectState = 'fill';
    },
    selectUp: function() {
      this.selectState = 'stroke';
      this.LAYER_SELECT_ALL(this.number);
    },
    mouseLeaveSelect: function() {
      if (this.selectState = 'fill') {
        this.selectState = 'stroke';
      }
    }
  }
}
</script>

<style scoped lang="scss">
.layer {
  width: 100%;
  height: 1.8em;
  color: white;
  font-family: Montserrat;
  flex: 0 0 auto;

  label {
    display: block;
    width: 100%;
    height: 100%;
    
    >div {
      width: 100%;
      height: 100%;
      background-color: rgb(90, 90, 90);
      border-bottom: 1px solid rgb(126, 125, 125);
      display: flex;

      .eye {
        width: 10%;
        height: 100%;
        border-right: 1px solid rgb(126, 125, 125);
        display: flex;
        justify-content: center;
        align-items: center;

        img {
          max-height: 1.1em;
          cursor: pointer;
        }
      }

      .name {
        width: 75%;
        height: 100%;
        font-size: 0.9em;

        display: flex;
        justify-content: center;
        align-items: center;
      }

      .selectall {
        width: 15%;
        height: 100%;
        border-left: 1px solid rgb(126, 125, 125);
        display: flex;
        justify-content: center;
        align-items: center;

        img {
          max-height: 0.9em;
          cursor: pointer;
        }
      }
    }

    input:checked~div {
      background-color: rgb(80, 147, 248);
      border-bottom: 1px solid rgb(169, 204, 255);
    }

    input {
      display: none;
    }
  }
}
</style>
