<template>
  <tool imgSource="tool-pen.png" @isActive="setActive" />  
</template>





<script>
import paper from 'paper'
import Tool from '../Tool.vue'
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'ToolPen',
  computed: {
    ...mapState([
      'TOOLPEN',

      'PEN_WIDTH',
      'PEN_OPACITY',
      'PEN_STROKECOLOR',
      'PEN_FILLCOLOR'
    ])
  },
  components: {
    Tool
  },
  methods: {
    ...mapMutations([
      'SET_ACTIVE',
      'ADD_SHAPE',
      'ADD_SELECT',
      'CLEAR_SELECT'
    ]),
    setActive: function() {
      this.SET_ACTIVE("pen")

      this.TOOLPEN.activate();
    }
  },
  mounted: function() {
    var newPath;
    var delta = 0;

    this.TOOLPEN.onMouseDown = (e) => {
      this.CLEAR_SELECT();

      newPath = new Path();
      newPath.strokeColor = this.PEN_STROKECOLOR
      newPath.fillColor = this.PEN_FILLCOLOR
      newPath.strokeWidth = this.PEN_WIDTH
      newPath.opacity = this.PEN_OPACITY

      delta = 0;

      project.activeLayer.selected = false;
    }

    this.TOOLPEN.onMouseDrag = (e) => {
      newPath.add(e.point);
      delta += e.delta.length;
    }

    this.TOOLPEN.onMouseUp = (e) => {
      // Don't create an object for a click
      if (delta < 3) {
        newPath.remove();
        return;
      }

      newPath.smooth();
      newPath.simplify();
      newPath.selected = true;

      newPath.selectable = true;
      newPath.type = "shape";

      this.ADD_SELECT(newPath);
      this.ADD_SHAPE(newPath);
    }
  }
}
</script>





<style scoped>
</style>