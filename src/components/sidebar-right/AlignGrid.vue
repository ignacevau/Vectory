<template>
  <div class="grid-container">
    <div class="grid">

      <div class="pr-left">
        <img src="@/assets/align-hor-left.png" alt="">
      </div>
      <div class="pr-middle" @click="align('align-hor-center')">
        <img src="@/assets/align-hor-middle.png" alt="">
      </div>
      <div class="pr-right">
        <img src="@/assets/align-hor-right.png" alt="">
      </div>

      <div class="pr-left">
        <img src="@/assets/align-ver-bottom.png" alt="">
      </div>
      <div class="pr-middle" @click="align('align-ver-center')">
        <img src="@/assets/align-ver-middle.png" alt="">
      </div>
      <div class="pr-right">
        <img src="@/assets/align-ver-top.png" alt="">
      </div>
      
    </div>
  </div>
</template>

<script>
import { bus } from '@/main.js';

export default {
  name: 'AlignGrid',
  methods: {
    align: function(event_name) {
      bus.$emit(event_name);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '@/library.scss';

.grid-container {
  display: flex;
  width: 100%;
  height: 11vh;
  justify-content: center;
  align-items: center;
}
.grid {
  height: 3.8em;
  width: 6em;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  row-gap: 6px;
  grid-template-areas: ". . ." ". . .";

  > div {
    background-color: $LightGray_Btn;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
      background-color: rgb(106, 162, 247);
    }

    &:active {
      background-color: rgb(99, 145, 212);
    }
  }



  .pr-left {
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
    border-right: 2px solid rgb(94, 94, 94);
  }

  .pr-right {
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
    border-left: 2px solid rgb(94, 94, 94);
  }

  img {
    max-height: 1.2em;
    width: 1.2em;
  }
}
.border {
  height: 0.05em;
  margin-top: 1px;
  background-color: rgb(116, 116, 116);
}
</style>