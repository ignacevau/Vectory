<template>
  <div class="sidebar-left">
    <div class="resize" ref="left">
      <tool-select />
      <tool-pointer />
      <tool-pen />
      <tool-circle />
    </div>

    <div class="handler" ondragstart="return false;" @mousedown="drag">
      <div style="background-color: white; height: 2vh; width: 1px; flex: 0 0 auto;"></div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ToolPen from '@/components/tools/ToolPen.vue'
import ToolPointer from '@/components/tools/ToolPointer.vue'
import ToolSelect from '@/components/tools/ToolSelect.vue'
import ToolCircle from '@/components/tools/ToolCircle.vue'

export default {
  name: 'SidebarLeft',
  components: {
    ToolPen,
    ToolPointer,
    ToolSelect,
    ToolCircle
  },
  data: function() {
    return {
      dragging: false
    }
  },
  mounted: function() {
    window.addEventListener('mousemove', this.resize)
    window.addEventListener('mouseup', this.undrag)
  },
  methods: {
    resize: function(e) {
      if(this.dragging) {
        this.$refs.left.style.width = this.clamp(e.clientX - 3, 50, 90) + 'px'
      }
    },
    drag: function() {
      this.dragging = true
    },
    undrag: function() {
      this.dragging = false
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
.sidebar-left {
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
  width: 90px;
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
</style>
