<template>
  <div class="sidebar-right">
    <div class="handler" ondragstart="return false;" @mousedown="drag">
      <div style="background-color: white; height: 2vh; width: 1px; flex: 0 0 auto;" />
    </div>

    <div class="resize" ref="right">
      <div class="top-bar">
        <span class="collapse-btn" @click="collapse">
          <img v-bind:class="{ 'flip': collapsed }" src="@/assets/collapse.png" style="max-height: 70%; max-width: 80%; margin: 0px 0px 1px 1px;" />
        </span>
      </div>

      <span style="width: 90px;"></span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'SidebarRight',
  data: function() {
    return {
      dragging: false,
      collapsed: true,
      minWidth: 90,
      maxWidth: 200
    }
  },
  mounted: function() {
    window.addEventListener('mousemove', this.resize)
    window.addEventListener('mouseup', this.undrag)

    this.$refs.right.style.width = this.minWidth + 'px';
  },
  methods: {
    resize: function(e) {
      if(this.dragging) {
        this.$refs.right.style.width = this.clamp(window.innerWidth - (e.clientX + 3), this.minWidth, this.maxWidth) + 'px'

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
        this.$refs.right.style.width = this.maxWidth + 'px';
        this.collapsed = false;
      }
      else {
        this.$refs.right.style.width = this.minWidth + 'px';
        this.collapsed = true;
      }
    }
  },
  computed: {
    ...mapGetters([
      'clamp'
    ])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
  background-color: rgb(77, 77, 77);
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
  height: 25px;
  width: 100%;
  background-color: rgb(77, 77, 77);
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
</style>
