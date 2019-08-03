<template>
  <div class="layer">
    <label>
      <input type="radio" name="layers" v-on:click.prevent="" v-bind:checked="isLayerSelected" />
      <div>
        <div class="eye">
          <img v-bind:src="imgUrl()" v-on:click="triggerEye" />
        </div>

        <div class="name" v-on:mousedown="selectLayer">
          <span>{{ name }}</span>
        </div>
        
        <div class="color"></div>
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
    id: Number,
    name: String
  },
  data: function() {
    return {
      isLayerSelected: true,
      eyeState: 'visible'
    }
  },
  computed: {
    ...mapState([
      'SELECTED_LAYER_INDEX',
      'LAYERS'
    ])
  },
  watch: {
    SELECTED_LAYER_INDEX: function() {
      this.isLayerSelected = this.SELECTED_LAYER_INDEX == this.id;
    }
  },
  methods: {
    ...mapMutations([
      'SELECT_LAYER'
    ]),
    imgUrl: function() {
      return images('./eye-' + this.eyeState + '.png')
    },
    selectLayer: function() {
      this.SELECT_LAYER(this.id);
    },
    triggerEye: function() {
      this.eyeState = this.eyeState == 'visible' ? 'invisible' : 'visible'
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

      .color {
        width: 15%;
        height: 100%;
        border-left: 1px solid rgb(126, 125, 125);
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
