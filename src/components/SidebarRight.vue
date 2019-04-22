<template>
  <div class="sidebar-right">
    <div class="handler" ondragstart="return false;" @mousedown="drag">
      <div style="background-color: rgb(106, 162, 247); height: 2vh; width: 100%; flex: 0 0 auto;" />
    </div>

    <div class="resize" ref="right">
      <div class="top-bar">
        <span class="collapse-btn" @click="collapse">
          <img v-bind:class="{ 'flip': collapsed }" src="@/assets/collapse.png" style="max-height: 70%; max-width: 80%; margin: 0px 0px 1px 1px;" />
        </span>
      </div>

      <div class="tab-properties">
        <div class="properties-title">Properties</div>

          <div class="opacity">
            <div v-if="textActive">
              OPACITY
            </div>
            <click-slider v-bind:parentOpacity="opacity" @value-change="sliderChange" />
          </div>

          <stroke-grid v-bind:showText="textActive" />

          <fill-grid v-bind:showText="textActive" /> 

      </div>

    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import StrokeGrid from '@/components/sidebar-right/StrokeGrid.vue'
import FillGrid from '@/components/sidebar-right/FillGrid.vue'
import ClickSlider from '@/components/header-bar/ClickSlider.vue'

export default {
  name: 'SidebarRight',
  components: {
    StrokeGrid,
    FillGrid,
    ClickSlider
  },
  data: function() {
    return {
      dragging: false,
      collapsed: false,
      minWidth: 100,
      maxWidth: 160,
      size: 160,
      opacity: 100
    }
  },
  mounted: function() {
    window.addEventListener('mousemove', this.resize)
    window.addEventListener('mouseup', this.undrag)

    this.$refs.right.style.width = this.maxWidth + 'px';
  },
  methods: {
    ...mapMutations([
      'SHOW_COLORPICKER'
    ]),
    resize: function(e) {
      if(this.dragging) {
        this.size = this.clamp(window.innerWidth - (e.clientX + 3), this.minWidth, this.maxWidth)
        this.$refs.right.style.width = this.size  + 'px'

        if (this.$refs.right.style.width == this.minWidth + 'px') {
          this.collapsed = true;
        }
        else {
          this.collapsed = false;
        }
      }
    },
    drag: function() {
      this.dragging = true
    },
    undrag: function() {
      this.dragging = false
    },
    collapse: function() {
      if(this.collapsed) {
        this.size = this.maxWidth;
        this.$refs.right.style.width = this.size + 'px';

        this.collapsed = false;
      }
      else {
        this.size = this.minWidth
        this.$refs.right.style.width = this.size + 'px';

        this.collapsed = true;
      }
    },
    sliderChange: function(value) {
      this.opacity = value
    }
  },
  computed: {
    ...mapGetters([
      'clamp'
    ]),
    textActive: function() {
      if(this.size > 150) {
        return true
      }
      return false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
* {
  color: rgb(221, 221, 221);
  font-family: Comfortaa;
}
.sidebar-right {
  display: flex;
  pointer-events: all;
}
.resize {
  background-color: rgb(94, 94, 94);
  flex: 0 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: flex-start;
  z-index: 1;
  pointer-events: all;
}
@media screen and (max-width: 992px) {
  .resize {
    display: none !important;
  }
}
.handler {
  width: 6px;
  background-color: rgb(63, 63, 63);
  border-top: 4px solid #6aa2f7;
  cursor: e-resize;
  z-index: 1;

  display: flex;
  justify-content: center;
  align-items: center;

  -moz-user-select: none;
  -webkit-user-select: none;
  user-select: none;
}
.top-bar {
  height: 30px;
  width: 100%;
  background-color: rgb(77, 77, 77);
  border-top: 4px solid rgb(106, 162, 247);
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.collapse-btn {
  height: 14px;
  width: 20px;
  background-color: rgb(77, 77, 77);
  margin-bottom: 1px;
  border-radius: 3px;

  display: flex;
  justify-content: center;
  align-items: center;
}
.collapse-btn:hover {
  background-color: rgb(99, 99, 99);
}
.collapse-btn:active {
  background-color: rgb(61, 61, 61);
}
.flip {
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
}

.tab-properties {
  width: 100%;
  flex: 0 0 auto;
}
.properties-title {
  text-align: center;
  width: 100%;
  height: 2em;
  font-size: 100%;
  background-color: rgb(114, 114, 114);
  padding-top: 0.4em;
}
.stroke {
  font-size: 100%;
  width: 100%;
  height: 30%;
  background-color: green;
  display: flex;
  align-items: flex-start;
  justify-content: space-evenly;
}
.opacity {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  height: 2em;
  border-bottom: 1px solid rgb(116, 116, 116);
  margin-top: 2px;
}
.opacity > div {
  font-size: 0.7em;
  margin-top: 2px;
}
</style>
