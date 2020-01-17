<template>
  <div class="container" v-bind:style="{ display: show }">
    <div @click="saveSVG">
      <div>SAVE</div>
    </div>

    <div>
      <div>OPEN</div>
    </div>

    <div @click="importSVG">
      <div>IMPORT</div>
    </div>

    <div @click="exportPNG">
      <div>
        EXPORT
      </div>
    </div>
  </div>
</template>

<script>
import { bus } from '@/main.js'
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'FileDropdown',
  computed: {
    ...mapState([
      'FILEDROPDOWN_ACTIVE'
    ]),
    show: function() {
      return this.FILEDROPDOWN_ACTIVE ? '' : 'none';
    }
  },
  methods: {
    ...mapMutations([
      'EXPORT_SVG',
      'IMPORT_SVG'
    ]),
    saveSVG: function() {
      this.EXPORT_SVG();
    },
    importSVG: function() {
      this.IMPORT_SVG();
    },
    exportPNG: function() {
      
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.container {
  position: absolute;
  z-index: 2;
  margin-top: 5vh;
  width: 7em;

  > div {
    font-size: 0.7em;
    width: 100%;
    display: flex;
    height: 2.5em;
    border-left: 5px solid rgb(48, 48, 48);
    justify-content: center;
    align-items: center;
    color: rgb(221, 221, 221);
    font-family: Montserrat;
    border-bottom: 1px solid rgb(92, 92, 92);
    background-color: rgb(75, 75, 75);

    &:hover {
      background-color: rgb(109, 109, 109)
    }
  }
}
</style>
