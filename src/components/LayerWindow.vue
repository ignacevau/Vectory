<template>
  <div class="container" v-bind:style="{ display: active }">
    <div class="layer-top">
      <div class="layer-trigger" @click="collapse">
        <img src="@/assets/collapse-ver.png" class="flip">
      </div>

      <div class="layer-text">
        <div>LAYERS</div>
      </div>
    </div>

    <div class="layer-body">
      <layer v-for="(layer, index) in layers" v-bind:key="index" v-bind:number="layer.number" v-bind:name="layer.name" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Layer from "@/components/Layer.vue"

export default {
  name: 'LayerWindow',
  components: {
    Layer
  },
  data: function() {
    return {
      layers: []
    }
  },
  computed: {
    ...mapState([
      'LAYER_WINDOW_ACTIVE',
      'LAYERS',
      'SELECTED_LAYER_INDEX'
    ]),
    active: {
      get () {
        return this.$store.state.LAYER_WINDOW_ACTIVE ? '' : 'none';
      },
      set (value) {
        return this.$store.commit('SET_LAYER_WINDOW_ACTIVE', value)
      }
    }
  },
  watch: {
    SELECTED_LAYER_INDEX: function() {
      this.layers = this.LAYERS.filter(function(el) {
        return !el.data.deleted;
      });
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
@import '@/library.scss';

.container {
  width: 20em;
  height: 15em;
  background-color: rgb(90, 90, 90);
  z-index: 1;
  pointer-events: all;
  display: flex;
  flex-flow: column;

  .layer-top {
    width: 20em;
    margin-top: -1px;
    display: flex;
    flex: 0 0 25px;
  }
  
  .layer-body {
    width: 100%;
    flex: 1 1 auto;
    overflow-y: scroll;
    display: flex;
    flex-flow: column;
    border-right: 1px solid $ThemeBlue;
  }
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
  background-color: $SuperDarkGray;
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
    background-color: rgb(97, 97, 97);
  }
}
</style>
