<template>
  <div class="footer-bar">
    <div class="layer-top">
      <div class="layer-trigger" @click="expand" v-if="!active">
        <img src="@/assets/collapse-ver.png">
      </div>

      <div class="layer-text" v-if="!active">
        <div>LAYERS</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'FooterBar',
  computed: {
    active: {
      get() {
        return this.$store.state.LAYER_ACTIVE
      },
      set(value) {
        return this.$store.commit('SET_LAYER_ACTIVE', value)
      }
    }
  },
  methods: {
    expand: function() {
      this.active = true
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.footer-bar {
  width: 100%;
  height: 25px;
  background-color: rgb(77, 77, 77);
  border-top: 2px solid rgb(39, 39, 39);
  z-index: 1;
  pointer-events: all;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
}
.layer-top {
  width: 20em;
  margin-top: -1px;
  height: 100%;
  display: flex;
  border-right: 1px solid rgb(106, 162, 247);
  background-color: rgb(49, 49, 49);
}
.layer-text {
  width: 80%;
  height: 100%;
  background-color: rgb(49, 49, 49);
  color: rgb(221, 221, 221);
  font-family: Comfortaa;
  font-size: 0.7em;
  display: flex;
  justify-content: center;
  align-items: center;

  div {
    width: 100%;
    text-align: center;
    border-left: 1px solid gray;
  }
}
.layer-trigger {
  width: 20%;
  height: 100%;
  background-color: rgb(63, 63, 63);
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    max-height: 0.8em;
    max-width: 0.8em;
  }

  .flip {
    -webkit-transform: scaleY(-1);
    transform: scaleY(-1);
  }

  &:hover {
    background-color: rgb(73, 73, 73);
  }
}
</style>
