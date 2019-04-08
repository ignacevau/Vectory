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
      'ACTIVE',
      'TOOLPEN'
    ])
  },
  components: {
    Tool
  },
  methods: {
    ...mapMutations([
      'SET_ACTIVE',
      'ADD_SHAPE'
    ]),
    setActive: function() {
      this.SET_ACTIVE("pen")

      this.TOOLPEN.activate();
    }
  },
  mounted: function() {
    var self = this;

    var oldPath;
    var newPath;
    var delta = 0;

    self.TOOLPEN.onMouseDown = function(e) {
        newPath = new Path();
        newPath.strokeColor = 'black';

        delta = 0;

        project.activeLayer.selected = false;
    }

    self.TOOLPEN.onMouseDrag = function(e) {
        newPath.add(e.point);
        delta += e.delta.length;
    }

    self.TOOLPEN.onMouseUp = function(e) {
        // Don't create an object for a click
        if (delta < 3) {
            newPath.remove();
            return;
        }

        newPath.smooth();
        newPath.simplify();
        newPath.selected = true;

        oldPath = newPath;

        self.ADD_SHAPE(newPath);
    }
  }
}
</script>





<style scoped>
</style>