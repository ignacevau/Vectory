<template>
  <div class="container" v-if="active">
    <div class="layer-top">
      <div class="layer-trigger" @click="collapse">
        <img src="@/assets/collapse-ver.png" class="flip">
      </div>

      <div class="layer-text">
        <div>LAYERS</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'LayerWindow',
  computed: {
    ...mapState([
      'LAYER_ACTIVE'
    ]),
    active: {
      get () {
        return this.$store.state.LAYER_ACTIVE
      },
      set (value) {
        return this.$store.commit('SET_LAYER_ACTIVE', value)
      }
    }
  },
  methods: {
    collapse: function() {
      this.active = false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.container {
  width: 20em;
  height: 15em;
  background-color: rgb(90, 90, 90);
  z-index: 1;
  pointer-events: all;
}

.layer-top {
  width: 20em;
  margin-top: -1px;
  height: 25px;
  display: flex;
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
