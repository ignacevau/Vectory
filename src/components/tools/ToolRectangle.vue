<template>
  <tool imgSource="tool-rectangle.png" @isActive="setActive" />  
</template>





<script>
import paper from 'paper'
import Tool from '../Tool.vue'
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'ToolRectangle',
  computed: {
    ...mapState([
      'TOOLRECTANGLE',

      'RECTANGLE_STROKECOLOR',
      'RECTANGLE_FILLCOLOR',
      'RECTANGLE_OPACITY',
      'RECTANGLE_WIDTH'
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
      this.SET_ACTIVE("rectangle")

      this.TOOLRECTANGLE.activate();
    }
  },
  mounted: function() {
    let newPath, oldPath, origin;

    this.TOOLRECTANGLE.onMouseDown = (e) => {
      this.DESELECT();

      newPath = new Path();

      origin = e.point;

      project.activeLayer.selected = false;        
    }

    this.TOOLRECTANGLE.onMouseDrag = (e) => {
      newPath.remove();

      let mousePos = e.point;
      let rect;

      // No shift modifier --> rectangle
      if(!e.modifiers.shift) {
        let from, to;

        // No control modifier --> scale from corner
        if(!e.modifiers.control) {
          from = origin;
          to = mousePos;
        }
        // Control modifier --> scale from center
        else if (e.modifiers.control) {
          from = origin.multiply(2).subtract(mousePos);
          to = mousePos;
        }

        rect = new Rectangle(from, to);
      }
      // Shift modifier --> square
      else if (e.modifiers.shift) {
        // No control modifier --> scale from corner
        if(!e.modifiers.control) {
          let dif_x = mousePos.x-origin.x;
          let dif_y = mousePos.y-origin.y;
          let size = Math.max(Math.abs(dif_x), Math.abs(dif_y));

          rect = new Rectangle(origin, size*Math.sign(dif_x), size*Math.sign(dif_y));
        }
        // Control modifier --> scale from center
        else if(e.modifiers.control) {
          let size = Math.max(Math.abs(origin.x-mousePos.x), Math.abs(origin.y-mousePos.y));

          rect = new Rectangle(origin.subtract(size), origin.add(size));
        }
      }

      newPath = Path.Rectangle(rect);

      newPath.strokeColor = this.RECTANGLE_STROKECOLOR
      newPath.fillColor = this.RECTANGLE_FILLCOLOR
      newPath.opacity = this.RECTANGLE_OPACITY
      newPath.strokeWidth = this.RECTANGLE_WIDTH
    }

    this.TOOLRECTANGLE.onMouseUp = (e) => {
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