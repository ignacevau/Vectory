<template>
  <div class="footer-bar">
    <div class="layer-top">
      <!-- Collapsed -->
      <div class="layer-trigger" @click="expand" v-if="!active">
        <img src="@/assets/collapse-ver.png" />
      </div>

      <div class="layer-text" v-if="!active">
        <div>LAYERS</div>
      </div>
      <!-- /Collapsed -->

      <!-- Expanded -->
      <div class="layer-set" v-if="active">
        <div @click="addLayer">
          <img src="@/assets/new.png" ondragstart="return false;" />
        </div>
        <div @click="removeLayer">
          <img src="@/assets/delete.png" ondragstart="return false;" />
        </div>
        <div>
          <img src="@/assets/duplicate.png" ondragstart="return false;" />
        </div>
        <div>
          <img src="@/assets/merge.png" ondragstart="return false;" />
        </div>
      </div>

      <div class="options" v-if="active">
        <div>
          <img src="@/assets/settings.png" ondragstart="return false;" />
        </div>
      </div>
      <!-- /Expanded -->
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  name: "FooterBar",
  computed: {
    active: {
      get() {
        return this.$store.state.LAYER_ACTIVE;
      },
      set(value) {
        return this.$store.commit("SET_LAYER_ACTIVE", value);
      }
    }
  },
  methods: {
    ...mapMutations([
      'ADD_LAYER',
      'REMOVE_LAYER'
    ]),
    expand: function() {
      this.active = true;
    },
    addLayer: function() {
      this.ADD_LAYER();
    },
    removeLayer: function() {
      this.REMOVE_LAYER();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '@/library.scss';

.footer-bar {
  width: 100%;
  height: 25px;
  background-color: $DarkGray;
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

  .layer-set {
    width: 90%;
    height: 100%;
    display: flex;
    justify-content: flex-start;
    align-content: center;

    > div {
      height: 100%;
      width: 10%;
      background-color: rgb(49, 49, 49);
      border-right: 1px solid rgb(78, 78, 78);
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        max-height: 1em;
      }

      &:hover {
        background-color: rgb(73, 73, 73);
      }
    }
  }

  .options {
    width: 10%;
    height: 100%;

    > div {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgb(49, 49, 49);
      border-left: 1px solid rgb(78, 78, 78);

      img {
        max-height: 1em;
      }

      &:hover {
        background-color: rgb(73, 73, 73);
      }
    }
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
