<template>
  <tool imgSource="tool-circle.png" @isActive="setActive" />  
</template>





<script>
import paper from 'paper'
import Tool from '../Tool.vue'
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'ToolCircle',
  computed: {
    ...mapState([
      'TOOLCIRCLE',

      'CIRCLE_STROKECOLOR',
      'CIRCLE_FILLCOLOR',
      'CIRCLE_OPACITY',
      'CIRCLE_WIDTH'
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
      'DESELECT'
    ]),
    setActive: function() {
      this.SET_ACTIVE("circle")

      this.TOOLCIRCLE.activate();
    }
  },
  mounted: function() {
    let newPath, oldPath, startPoint;

    this.TOOLCIRCLE.onMouseDown = (e) => {
      this.DESELECT();

      newPath = new Path();

      startPoint = e.point;

      project.activeLayer.selected = false;        
    }

    this.TOOLCIRCLE.onMouseDrag = (e) => {
      newPath.remove();

      let endPoint = e.point;

      // No shift modifier --> ellipse
      if(!e.modifiers.shift) {
        // No control modifier --> scale from corner
        if(!e.modifiers.control) {
          let rect = new Rectangle(startPoint, endPoint);

          newPath = Path.Ellipse(rect);
        }
        // Control modifier --> scale from center
        else if (e.modifiers.control) {
          let center = startPoint;
          let rad = [endPoint.x - startPoint.x, endPoint.y - startPoint.y];

          newPath = Path.Ellipse({
            center: center,
            radius: rad
          });
        }

      }
      // Shift modifier --> circle
      else if (e.modifiers.shift) {
        let center, rad;

        // No control modifier --> scale from corner
        if(!e.modifiers.control) {
          rad = Math.max(Math.abs(startPoint.x-endPoint.x), Math.abs(startPoint.y-endPoint.y)) / 2;
          center = new Point(startPoint.x + (rad/2)*Math.sign(endPoint.x-startPoint.x), startPoint.y + (rad/2)*Math.sign(endPoint.y-startPoint.y));
        }
        // Control modifier --> scale from center
        else if(e.modifiers.control) {
          rad = startPoint.getDistance(endPoint);
          center = startPoint;
        }
        
        newPath = Path.Circle(center, rad);
      }

      newPath.strokeColor = this.CIRCLE_STROKECOLOR
      newPath.fillColor = this.CIRCLE_FILLCOLOR
      newPath.opacity = this.CIRCLE_OPACITY
      newPath.strokeWidth = this.CIRCLE_WIDTH
    }

    this.TOOLCIRCLE.onMouseUp = (e) => {
      // Don't create object for a click
      if (e.delta.length < 3) {
          newPath.remove();
          return;
      }

      newPath.selected = true;
      oldPath = newPath;
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