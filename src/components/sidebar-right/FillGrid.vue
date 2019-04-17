<template>
  <div>
    <div class="title">
      <img class="img-stroke" src="@/assets/fill.png" />
      <div>FILL</div>
    </div>

    <div v-bind:class="{ 'large-grid': showText, 'small-grid': !showText, 'grid-container': true }">
      <div class="pr-left"></div>
      <div v-if="showText" class="pr-middle">color:</div>
      <div class="pr-right">
        <color-trigger v-bind:colorTypePrefix="'fill'" />
      </div>
    </div>
  </div>
</template>

<script>
import ColorTrigger from '@/components/sidebar-right/stroke-grid/ColorTrigger.vue'

export default {
  name: 'StrokeGrid',
  components: {
    ColorTrigger
  },
  props: [
    'showText'
  ]
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.title {
  margin-left: 5px;
  display: flex;
  justify-content: flex-start;
}
.title div {
  color: rgb(123, 175, 253); 
  border-bottom: 1px solid rgb(123, 175, 253);
  width: 100%;
  margin-left: 10px;
  font-size: 0.8em;
}

.large-grid {
  margin-top: 10px;
  height: 11vh;
  display: grid;
  grid-template-columns: 0.1fr 1fr 1fr;
  grid-template-rows: 0.5fr 1fr 1fr 1fr;
  grid-template-areas: ". . ." ". . ." ". . .";
}
.small-grid {
  margin-top: 10px;
  height: 11vh;
  display: grid;
  grid-template-columns: 0.1fr 1fr;
  grid-template-rows: 0.5fr 1fr 1fr 1fr;
  grid-template-areas: ". ." ". ." ". .";
}
.img-stroke {
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