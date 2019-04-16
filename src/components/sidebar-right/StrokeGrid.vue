<template>
  <div v-bind:class="{ 'large-grid': showText, 'small-grid': !showText, 'grid-container': true }">
    <div class="pr-left">
      <img class="img-stroke" src="@/assets/stroke.png" />
    </div>
    <div v-if="showText" class="pr-middle"></div>
    <div class="pr-right"></div>

    <div class="pr-left"></div>
    <div v-if="showText" class="pr-middle">color:</div>
    <div class="pr-right">
      <color-trigger v-bind:colorTypePrefix="'stroke'" />
    </div>

    <div class="pr-left"></div>
    <div v-if="showText" class="pr-middle">width:</div>
    <div class="pr-right">
      <width-input />
    </div>

    <div class="pr-left"></div>
    <div v-if="showText" class="pr-middle">type:</div>
    <div class="pr-right">
      <cap-style />
    </div>
  </div>
</template>

<script>
import ColorTrigger from '@/components/sidebar-right/stroke-grid/ColorTrigger.vue'
import WidthInput from '@/components/sidebar-right/stroke-grid/WidthInput.vue'
import CapStyle from '@/components/sidebar-right/stroke-grid/CapStyle.vue'

export default {
  name: 'StrokeGrid',
  components: {
    ColorTrigger,
    WidthInput,
    CapStyle
  },
  props: [
    'showText'
  ]
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.large-grid {
  margin-top: 10px;
  height: 11vh;
  display: grid;
  grid-template-columns: 0.1fr 1fr 1fr;
  grid-template-rows: 0.5fr 1fr 1fr 1fr;
  grid-template-areas: ". . ." ". . ." ". . ." ". . .";
}
.small-grid {
  margin-top: 10px;
  height: 11vh;
  display: grid;
  grid-template-columns: 0.1fr 1fr;
  grid-template-rows: 0.5fr 1fr 1fr 1fr;
  grid-template-areas: ". ." ". ." ". ." ". .";
}
.img-stroke {
  margin-top: 15px;
  margin-left: 8px;
  width: 25px;
  height: 18px;
}
.grid-container > div {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}
.grid-container .pr-left {
  width: 30px;
}
.grid-container .pr-middle {
  justify-content: flex-end;
  font-size: 0.9em;
}
.grid-container div:first-child {
  height: 20px;
}
</style>