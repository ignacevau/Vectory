<template>
  <div class="header-select">
    <div class="section">

      <div>
        FLIP
      </div>

      <div class="button-holder">
        <div class="flip left">
         <img @click="flipHor" src="@/assets/flip-hor.png" />
        </div>
        <div class="flip right">
          <img @click="flipVer" src="@/assets/flip-ver.png" />
        </div>
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
@import '@/library.scss';

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
  font-size: 0.75em;

  .button-holder {
    display: flex;
  }

  .flip {
    width: 2.5em;
    height: 1.5em;
    background-color: $LightGray_Btn;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      max-height: 100%;
    }

    &:hover {
      background-color: $ThemeBlue;
    }
  }

  .left {
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
  }

  .right {
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
    border-left: 1px solid rgb(126, 126, 126);
  }
}
</style>
