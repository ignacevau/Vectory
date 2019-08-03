<template>
  <div class="sidebar-left">
    <div class="resize" ref="left">
      
      <div class="top-bar">
        <span class="collapse-btn" @click="collapse">
          <img v-bind:class="{ 'flip': !collapsed }" src="@/assets/collapse.png" style="max-height: 70%; max-width: 80%; margin: 0px 0px 1px 1px;" />
        </span>
      </div>

      <tool-select />
      <tool-pointer />
      <tool-pen />
      <tool-line />
      <tool-circle />
      <tool-shapebuilder />

    </div>
    <div class="handler" ondragstart="return false;">
    </div>
  </div>

</template>

<script>
import { mapGetters } from 'vuex'
import ToolPen from '@/components/tools/ToolPen.vue'
import ToolPointer from '@/components/tools/ToolPointer.vue'
import ToolSelect from '@/components/tools/ToolSelect.vue'
import ToolCircle from '@/components/tools/ToolCircle.vue'
import ToolShapebuilder from '@/components/tools/ToolShapebuilder.vue'
import ToolLine from '@/components/tools/ToolLine.vue'

export default {
  name: 'SidebarLeft',
  components: {
    ToolPen,
    ToolPointer,
    ToolSelect,
    ToolCircle,
    ToolShapebuilder,
    ToolLine
  },
  data: function() {
    return {
      collapsed: true,
      minWidth: 50,
      maxWidth: 90
    }
  },
  mounted: function() {
    this.$refs.left.style.width = this.minWidth + 'px';
  },
  methods: {
    collapse: function() {
      if(this.collapsed) {
        this.$refs.left.style.width = this.maxWidth + 'px';
        this.collapsed = false;
      }
      else {
        this.$refs.left.style.width = this.minWidth + 'px';
        this.collapsed = true;
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '@/library.scss';

.sidebar-left {
  display: flex;
  pointer-events: all;
}
.resize {
  background-color: $DefaultGray;
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
  background-color: rgb(58, 58, 58);
  border-top: 4px solid rgb(106, 162, 247);
  z-index: 1;

  -moz-user-select: none;
  -webkit-user-select: none;
  user-select: none;
}
.top-bar {
  height: 30px;
  width: 100%;
  background-color: rgb(77, 77, 77);
  display: flex;
  align-items: center;
  border-top: 4px solid rgb(106, 162, 247);
  justify-content: flex-end;
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
