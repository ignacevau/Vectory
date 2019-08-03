<template>
  <header class="header-bar">
    <div class="file" @click="triggerFileDropdown">
      <div class="left">
        <img src="@/assets/file.png" />
      </div>

      <div class="collapse">
        <div>{{ fileDropDownSign }}</div>
        <div>{{ fileActiveSign }}</div>
      </div>
    </div>

    <div class="tool">
      <div>TOOL :</div>
      <img v-bind:src="imgUrl()" />
    </div>

    <header-pen v-if="ACTIVE_TOOL == 'pen'" />
    <header-circle v-if="ACTIVE_TOOL == 'circle'" />
    <header-line v-if="ACTIVE_TOOL == 'line'" />
    <header-select v-if="ACTIVE_TOOL == 'select'" />

  </header>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { bus } from '@/main.js'
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
      'ACTIVE_TOOL',
      'FILEDROPDOWN_ACTIVE'
    ]),
    fileDropDownSign: function() {
      return this.FILEDROPDOWN_ACTIVE ? '' : '⌵';
    },
    fileActiveSign: function() {
      return this.FILEDROPDOWN_ACTIVE ? '⬤' : '';
    }
  },
  methods: {
    ...mapMutations([
      'TRIGGER_FILEDROPDOWN'
    ]),
    imgUrl: function() {
      return images('./tool-' + this.ACTIVE_TOOL + '.png')
    },
    triggerFileDropdown: function() {
      this.TRIGGER_FILEDROPDOWN();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '@/library.scss';

* {
  color: rgb(221, 221, 221);
  font-family: Comfortaa;
}
.header-bar {
  flex: 0 1 auto;
  height: 5vh;
  width: 100%;
  background-color: $DefaultGray;
  z-index: 1;
  display: flex;
}
.file {
  height: 100%;
  width: 56px;
  border-left: 5px solid rgb(48, 48, 48);
  display: flex;
  background-color: rgb(75, 75, 75);

  &:active {
    background-color: rgb(66, 66, 66);
  }
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
  width: 30%;
  height: 100%;
  background-color: rgb(75, 75, 75);
  font-size: 0.5em;
  display: flex;
  justify-content: center;
  align-items: center;

  >div:first-child{
    margin-top: -5px;
  }

  &:hover {
    >div {
      margin-top: 0px;
    }
  }

  &:active {
    background-color: rgb(66, 66, 66);
  }
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
