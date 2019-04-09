<template>
  <tool imgSource="tool-select.png" @isActive="setActive" />  
</template>





<script>
import paper from 'paper'
import Tool from '../Tool.vue'
import { mapMutations, mapState } from 'vuex'
import { bus } from '@/main.js'

export default {
  name: 'ToolSelect',
  computed: {
    ...mapState([
      'ACTIVE',
      'TOOLSELECT',
      'OBJECTS'
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
      this.SET_ACTIVE("select")

      this.TOOLSELECT.activate();
    }
  },
  mounted: function() {
    var self = this;

    var el = document.querySelector('#tool-select');

    var hitOptions = {
      segments: true,
      stroke: true,
      fill: true,
      tolerance: 4
    };

    // Path over which the mouse currently hovers
    var hoverItem;
    var hoverSelection = new Path();
    hoverSelection.selectable = false;

    // Transform rectangle cache
    var lastTransformRect;

    // The selection rectangle with transform points
    var transformRect = new Path();
    var transformPoints = {
      topLeft: null,
      topMiddle: null,
      topRight: null,

      middleLeft: null,
      middleRight: null,

      bottomLeft: null,
      bottomMiddle: null, 
      bottomRight: null
    }

    // Updated through zoom
    var transformBoxSize = 7/view.zoom;
    var transformBoxWidth = 2/view.zoom;

    var selectingPoint = null;
    var selectRect = new Path();

    var localSelect = [];



    // Remove the selection box with transform points
    function hideTransformBox() {
      transformRect.remove();

      Object.keys(transformPoints).forEach(function(point, index) {
        if(transformPoints[point]) {
          transformPoints[point].remove();
        }
      });
    }


    // Draw selection box with transform points
    function drawTransformBox(rect) {
      if(rect) {
        lastTransformRect = rect;
      }

      if(!lastTransformRect)
        return;

      // Draw rect
      transformRect = Path.Rectangle(lastTransformRect);
      transformRect.strokeColor = 'black';
      transformRect.selectable = false;
      transformRect.strokeWidth = 0.5/view.zoom;

      // Calculate the boxes
      var topLeftRect = new Rectangle(lastTransformRect.point.subtract(transformBoxSize/2), transformBoxSize);
      var topMiddleRect = new Rectangle(new Point(lastTransformRect.point.x + lastTransformRect.width/2, lastTransformRect.point.y).subtract(transformBoxSize/2), transformBoxSize);
      var topRightRect = new Rectangle(new Point(lastTransformRect.point.x + lastTransformRect.width, lastTransformRect.point.y).subtract(transformBoxSize/2), transformBoxSize);

      var middleLeftRect = new Rectangle(new Point(lastTransformRect.point.x, lastTransformRect.point.y + lastTransformRect.height/2).subtract(transformBoxSize/2), transformBoxSize);
      var middleRightRect = new Rectangle(new Point(lastTransformRect.point.x + lastTransformRect.width, lastTransformRect.point.y + lastTransformRect.height/2).subtract(transformBoxSize/2), transformBoxSize);
      
      var bottomLeftRect = new Rectangle(new Point(lastTransformRect.point.x, lastTransformRect.point.y + lastTransformRect.height).subtract(transformBoxSize/2), transformBoxSize);
      var bottomMiddleRect = new Rectangle(new Point(lastTransformRect.point.x + lastTransformRect.width/2, lastTransformRect.point.y + lastTransformRect.height).subtract(transformBoxSize/2), transformBoxSize);
      var bottomRightRect = new Rectangle(new Point(lastTransformRect.point.x + lastTransformRect.width, lastTransformRect.point.y + lastTransformRect.height).subtract(transformBoxSize/2), transformBoxSize);

      // Assign the boxes
      transformPoints.topLeft = Path.Rectangle(topLeftRect);
      transformPoints.topMiddle = Path.Rectangle(topMiddleRect);
      transformPoints.topRight = Path.Rectangle(topRightRect);

      transformPoints.middleLeft = Path.Rectangle(middleLeftRect);
      transformPoints.middleRight = Path.Rectangle(middleRightRect);

      transformPoints.bottomLeft = Path.Rectangle(bottomLeftRect);
      transformPoints.bottomMiddle = Path.Rectangle(bottomMiddleRect);
      transformPoints.bottomRight = Path.Rectangle(bottomRightRect);

      // Set type
      Object.keys(transformPoints).forEach(function(point, index) {
        if(transformPoints[point]) {
          transformPoints[point].type = 'transformPoint';
        }
      });

      // Set cursor type
      transformPoints.topLeft.cursorType = "nw-resize";
      transformPoints.bottomRight.cursorType = "nw-resize";

      transformPoints.topMiddle.cursorType = "n-resize";
      transformPoints.bottomMiddle.cursorType = "n-resize";

      transformPoints.topRight.cursorType = "ne-resize";
      transformPoints.bottomLeft.cursorType = "ne-resize";

      transformPoints.middleLeft.cursorType = "e-resize";
      transformPoints.middleRight.cursorType = "e-resize";


      // Set the box colors
      Object.keys(transformPoints).forEach(function(point, index) {
        if(transformPoints[point]) {
          transformPoints[point].selectable = false;
          transformPoints[point].strokeColor = 'blue';
          transformPoints[point].fillColor = 'white';
          transformPoints[point].strokeWidth = transformBoxWidth;
        }
      });
    }


    // Redraw the selection box with transform points
    function updateTransformBox() {
      hideTransformBox();
      drawTransformBox();
    }


    // Get the selection rectangle
    function getBounds() {
      if(localSelect.length == 0)
        return;

      var _temp = [];
      for(var i=0; i<localSelect.length; i++) {
        _temp.push(localSelect[i].clone());
      }

      // Make a compoundpath to get the bounds for the transform box
      var _grouped = new CompoundPath({
        children: _temp
      });

      var rect = _grouped.bounds;
      _grouped.remove();

      return rect;
    }



    // - Mouse down -
    self.TOOLSELECT.onMouseDown = function(e) {
      hideTransformBox();
      transformRect = new Path();

      // Mouse is not over a shape
      if(!hoverItem) {
        localSelect = [];
      }

      if(hoverSelection) {
        hoverSelection.remove();

        if (hoverItem && !hoverItem.selected && hoverItem.selectable) {
          // Shift key is pressed
          if(e.modifiers.shift) {
            hoverItem.selected = true;

            self.ADD_SELECT(hoverItem);
            localSelect.push(hoverItem);
          }
          // Shift key is not pressed
          else {
            project.activeLayer.selected = false;
            hoverItem.selected = true;

            localSelect = [];
            self.CLEAR_SELECT();

            self.ADD_SELECT(hoverItem);
            localSelect.push(hoverItem);
          }

          drawTransformBox(getBounds());
        }
      }
      
      if(!e.item) {
        project.activeLayer.selected = false;
        self.CLEAR_SELECT();
        selectingPoint = e.point;
      }
    }



    // - Mouse move -
    self.TOOLSELECT.onMouseMove = function(e) {
      document.body.style.cursor = "default";

      if (hoverItem) {
        hoverItem = null;
        hoverSelection.remove();
      }

      if (e.item) {
        hoverItem = e.item;

        if(hoverItem.selectable) {
          hoverSelection = hoverItem.clone();
          hoverSelection.strokeColor = '#33b5ff';
          hoverSelection.strokeWidth = 2 / paper.view.zoom;

          hoverSelection.selectable = false;
        }
        else {
          if(hoverItem.type == 'transformPoint') {
            document.body.style.cursor = hoverItem.cursorType;
          }
        }
      }

      if(selectingPoint) {
        selectRect.remove();
        selectRect = Path.Rectangle(selectingPoint, e.point);
        selectRect.selectable = false;
        selectRect.dashArray = [4/view.zoom, 3/view.zoom];
        selectRect.strokeColor = 'black';
        selectRect.strokeWidth = 0.5/view.zoom;

        for(var i=0; i < self.OBJECTS.length; i++) {
          if(selectRect.intersects(self.OBJECTS[i])) {
            if(!self.OBJECTS[i].selected) {
              self.OBJECTS[i].selected = true;
              localSelect.push(self.OBJECTS[i]);
            }
          }
          else {
            var _selRect = new Rectangle(selectingPoint, e.point)
            if(self.OBJECTS[i].isInside(_selRect)) {
              if(!self.OBJECTS[i].selected) {
                self.OBJECTS[i].selected = true;
                localSelect.push(self.OBJECTS[i]);
              }
            }
            else {
              self.OBJECTS[i].selected = false;
              var index = localSelect.findIndex(x => x === self.OBJECTS[i]);
              if(index != -1) {
                localSelect.splice(index, 1);
              }
            }
          }
        }
      }
    }



    // - Mouse up -
    self.TOOLSELECT.onMouseUp = function(e) {
      selectingPoint = null;
      selectRect.remove();

      if(localSelect.length == 0) {
        return;
      }

      // Update transform box with new rectangle
      hideTransformBox();
      drawTransformBox(getBounds());

      for(var i=0; i<localSelect.length; i++) {
        self.ADD_SELECT(localSelect[i]);
      }
    }



    // - user is zooming -
    bus.$on('zoom', () => {
      // Keep the transform box's width constant over zoom
      transformRect.strokeWidth = 0.5/view.zoom;
      transformBoxSize = 7/view.zoom;
      transformBoxWidth = 2/view.zoom;

      if(localSelect.length > 0) {
        updateTransformBox();
      }
    });



    // - delete key pressed -
    bus.$on('delete_selection', () => {
      localSelect = [];
      hideTransformBox();
    });
  }
}
</script>





<style scoped>
</style>