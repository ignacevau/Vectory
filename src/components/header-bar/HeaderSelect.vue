<template>
  <div class="header-select">
    <div class="section">
      <div>
        FLIP
      </div>
      <div class="flip">
        <img @click="flipHor" src="@/assets/flip-hor.png" />
      </div>
      <div class="flip">
        <img @click="flipVer" src="@/assets/flip-ver.png" />
      </div>
    </div>
  </div>
</template>


<script>
import { bus } from '@/main.js'

export default {
  name: 'HeaderSelect',
  methods: {
    flipHor: function() {
      bus.$emit('flip-hor')
    },
    flipVer: function() {
      bus.$emit('flip-ver')
    }
  }
}
</script>




<style lang="scss" scoped>
* {
  color: rgb(221, 221, 221);
  font-family: Comfortaa;
}
.header-select {
  height: 100%;
  width: 55em;
  display: flex;
  align-items: center;
}

.section {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 14%;
  height: 60%;
  border-right: 1px solid rgb(133, 133, 133);

  & div:first-child {
    font-size: 0.7em;
    margin-top: 2px;
  }

  & .flip {
    width: 1.8em;
    height: 80%;
    border-radius: 4px;
    background-color: rgb(112, 112, 112);
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
      background-color: gray;
    }

    & img {
      max-height: 90%;
      max-width: 90%;
    }
  }
}
</style>
