<template>
  <div class="toolDiv">
    <span v-bind:class="{ 'tool': true, 'tools-active': active }" id="tool-select" @click="select()">
      <img v-bind:src="imgUrl()" class="tool-img" ondragstart="return false;" />
    </span>
  </div>
</template>

<script>
import { bus } from '@/main.js'

var images = require.context('../assets/', false, /\.png$/)

export default {
  name: 'Tool',
  mounted: function() {
    this.active = this.propsActive

    bus.$on("deselect", data => {
      if(data.element != this) {
        this.active = false
      }
    });
  },
  data: function() {
    return {
      active: false
    }
  },
  props: [
    'imgSource',
    'propsActive'
  ],
  methods: {
    imgUrl: function() {
      return images("./" + this.imgSource)
    },
    select: function() {
      bus.$emit("deselect", { element: this })
      this.active = true
      this.$emit("isActive")
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '@/library.scss';

.toolDiv {
    margin: 8px 4px 0px 4px;
    -moz-user-select: none;
    -webkit-user-select: none;
    user-select: none;
}
.tool {
    background-color: $LightGray_Btn;
    width: 35px;
    height: 35px;
    display: flex;
    border-radius: 3px;
    flex-shrink: 0;
    flex-grow: 0;
    justify-content: center;
    align-content: center;
    -moz-user-select: none;
    -webkit-user-select: none;
    user-select: none;
}

.tool:hover {
    background-color: rgb(96, 138, 201);
}

.tool:active {
    background-color: rgb(106, 162, 247);
}

.tools-active {
    background-color: rgb(106, 162, 247);
}

.tools-active:hover {
    background-color: rgb(106, 162, 247);
}

.tool-img {
    margin: 15%;
    width: 70%;
    height: 70%;
    flex: 0 0 auto;
    -moz-user-select: none;
    -webkit-user-select: none;
    user-select: none;
    -webkit-user-drag: none;
}
</style>
