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
      'ACTIVE',
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
      'CLEAR_SELECT'
    ]),
    setActive: function() {
      this.SET_ACTIVE("circle")

      this.TOOLCIRCLE.activate();
    }
  },
  mounted: function() {
    var self = this;

    var newPath;
    var oldPath;
    var middle;

    self.TOOLCIRCLE.onMouseDown = (e) => {
      self.CLEAR_SELECT();

      newPath = new Path();

      middle = e.point;

      project.activeLayer.selected = false;        
    }

    self.TOOLCIRCLE.onMouseDrag = (e) => {
      newPath.remove();

      // Ellipse
      if(!e.modifiers.shift) {
        var rect;
        if(!e.modifiers.control) {
          var from = middle;
          var to = e.point;
          rect = new Rectangle(from, to);
          newPath = Path.Ellipse(rect);
        }
        else {
          var center = middle;
          var rad = [e.point.x - middle.x, e.point.y - middle.y];
          newPath = Path.Ellipse({
            center: center,
            radius: rad
          });
        }

      }
      // Circle
      else {

        var center;
        var rad;

        if(!e.modifiers.control) {
          rad = Math.max(Math.abs(middle.x-e.point.x), Math.abs(middle.y-e.point.y))/2;
          center = new Point(middle.x + (rad/2)*Math.sign(e.point.x-middle.x), middle.y + (rad/2)*Math.sign(e.point.y-middle.y));
        }
        else {
          rad = middle.getDistance(e.point);
          center = middle;
        }
        
        newPath = Path.Circle(center, rad);
      }

      newPath.strokeColor = this.CIRCLE_STROKECOLOR
      newPath.fillColor = this.CIRCLE_FILLCOLOR
      newPath.opacity = this.CIRCLE_OPACITY
      newPath.strokeWidth = this.CIRCLE_WIDTH
    }

    self.TOOLCIRCLE.onMouseUp = function(e) {
      // Don't create an object for a click
      if (e.delta.length < 3) {
          newPath.remove();
          return;
      }

      newPath.selected = true;
      oldPath = newPath;
      newPath.selectable = true;

      self.ADD_SELECT(newPath);
      self.ADD_SHAPE(newPath);
    }
  }
}
</script>





<style scoped>
</style>