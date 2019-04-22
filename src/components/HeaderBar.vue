<template>
  <header class="header-bar">
    <div class="file">
      <div class="left">
        <img src="@/assets/file.png" />
      </div>

      <div class="collapse">
        <div>⌄</div>
      </div>
    </div>

    <div class="tool">
      <div>TOOL :</div>
      <img v-bind:src="imgUrl()" />
    </div>

    <header-pen v-if="ACTIVE == 'pen'" />
    <header-circle v-if="ACTIVE == 'circle'" />
    <header-line v-if="ACTIVE == 'line'" />
    <header-select v-if="ACTIVE == 'select'" />

  </header>
</template>

<script>
import { mapState } from 'vuex'
import HeaderPen from '@/components/header-bar/HeaderPen.vue'
import HeaderCircle from '@/components/header-bar/HeaderCircle.vue'
import HeaderLine from '@/components/header-bar/HeaderLine.vue'
import HeaderSelect from '@/components/header-bar/HeaderSelect.vue'

var images = require.context('../assets/', false, /\.png$/)

export default {
  name: 'HeaderBar',
  components: {
    HeaderPen,
    HeaderCircle,
    HeaderLine,
    HeaderSelect
  },
  computed: {
    ...mapState([
      'ACTIVE'
    ])
  },
  methods: {
    imgUrl: function() {
      return images('./tool-' + this.ACTIVE + '.png')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
* {
  color: rgb(221, 221, 221);
  font-family: Comfortaa;
}
.header-bar {
  flex: 0 1 auto;
  height: 5vh;
  width: 100%;
  background-color: rgb(94, 94, 94);
  z-index: 1;
  display: flex;
}
.file {
  height: 100%;
  width: 50px;
  margin-left: 5px;
  display: flex;
}
.file .left {
  height: 95%;
  width: 75%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.left img {
  max-height: 60%;
  max-width: 60%;
}

.file .collapse {
  width: 25%;
  height: 100%;
  background-color: rgb(75, 75, 75);
  font-size: 0.9em;
  display: flex;
  justify-content: center;
  align-items: center;
}
.collapse:hover {
  background-color: rgb(66, 66, 66);
}

.collapse div {
  margin-top: -6px;
}

.tool {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 5px;
  width: 11vh;
  border-right: 1px solid rgb(133, 133, 133);
}
.tool img {
  margin-bottom: 2px;
  margin-left: 6px;
  width: 20px;
  height: 20px;
}
.tool div {
  color: rgb(123, 175, 253);
  font-size: 0.8em;
}
</style>
