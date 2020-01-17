<template>
  <tool imgSource="tool-line.png" @isActive="setActive" />  
</template>





<script>
import paper from 'paper'
import Tool from '../Tool.vue'
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'ToolLine',
  computed: {
    ...mapState([
      'TOOLLINE',

      'LINE_STROKECOLOR',
      'LINE_OPACITY',
      'LINE_WIDTH'
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
      this.SET_ACTIVE("line")

      this.TOOLLINE.activate();
    }
  },
  mounted: function() {
    var newPath;
    var startPoint = new Point();
    var endPoint = new Point();

    // Keep track of how long the line is, don't create for click
    var delta;

    this.TOOLLINE.onMouseDown = (e) => {
      this.CLEAR_SELECT();

      newPath = new Path();

      delta = 0;
      startPoint = e.point

      project.activeLayer.selected = false;
    }

    this.TOOLLINE.onMouseDrag = (e) => {
      newPath.remove()

      delta += e.delta.length;
      endPoint = e.point

      newPath = Path.Line(startPoint, endPoint)

      newPath.strokeColor = this.LINE_STROKECOLOR
      newPath.strokeWidth = this.LINE_WIDTH
      newPath.fillColor = 'transparent';
      newPath.opacity = this.LINE_OPACITY
    }

    this.TOOLLINE.onMouseUp = (e) => {
      // Don't create an object for a click
      if (delta < 3) {
        newPath.remove();
        return;
      }

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