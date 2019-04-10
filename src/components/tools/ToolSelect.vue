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

    // Need this to create custom drag function
    var mouseDown = false;

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

      leftCenter: null,
      rightCenter: null,

      bottomLeft: null,
      bottomMiddle: null, 
      bottomRight: null
    }

    // Updated through zoom
    var transformBoxSize = 7/view.zoom;
    var transformBoxWidth = 2/view.zoom;

    // Object with transform information
    var transform = {
      hover: false,
      active: false,
      pivot: null,
      dir: '' // topLeft, topMiddle, ...
    };

    var selectingPoint = null;
    var selectRect = new Path();

    var localSelect = [];



    var _lastMousePos;
    var mouseDelta;



    var flippedV = false;
    var flippedH = false;
    var lockScaleX = false;
    var lockScaleY = false;
    var point;

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

      // Calculate the positions
      var topLeftPt = lastTransformRect.point.subtract(transformBoxSize/2);
      var topMiddlePt = new Point(lastTransformRect.point.x + lastTransformRect.width/2, lastTransformRect.point.y).subtract(transformBoxSize/2);
      var topRightPt = new Point(lastTransformRect.point.x + lastTransformRect.width, lastTransformRect.point.y).subtract(transformBoxSize/2);

      var middleLeftPt = new Point(lastTransformRect.point.x, lastTransformRect.point.y + lastTransformRect.height/2).subtract(transformBoxSize/2);
      var middleRightPt = new Point(lastTransformRect.point.x + lastTransformRect.width, lastTransformRect.point.y + lastTransformRect.height/2).subtract(transformBoxSize/2);

      var bottomLeftPt = new Point(lastTransformRect.point.x, lastTransformRect.point.y + lastTransformRect.height).subtract(transformBoxSize/2);
      var bottomMiddlePt = new Point(lastTransformRect.point.x + lastTransformRect.width/2, lastTransformRect.point.y + lastTransformRect.height).subtract(transformBoxSize/2);
      var bottomRightPt = new Point(lastTransformRect.point.x + lastTransformRect.width, lastTransformRect.point.y + lastTransformRect.height).subtract(transformBoxSize/2);

      // Calculate the boxes
      var topLeftRect = new Rectangle(topLeftPt, transformBoxSize);
      var topMiddleRect = new Rectangle(topMiddlePt, transformBoxSize);
      var topRightRect = new Rectangle(topRightPt, transformBoxSize);

      var middleLeftRect = new Rectangle(middleLeftPt, transformBoxSize);
      var middleRightRect = new Rectangle(middleRightPt, transformBoxSize);
      
      var bottomLeftRect = new Rectangle(bottomLeftPt, transformBoxSize);
      var bottomMiddleRect = new Rectangle(bottomMiddlePt, transformBoxSize);
      var bottomRightRect = new Rectangle(bottomRightPt, transformBoxSize);

      // Assign the boxes
      transformPoints.topLeft = Path.Rectangle(topLeftRect);
      transformPoints.topMiddle = Path.Rectangle(topMiddleRect);
      transformPoints.topRight = Path.Rectangle(topRightRect);

      transformPoints.leftCenter = Path.Rectangle(middleLeftRect);
      transformPoints.rightCenter = Path.Rectangle(middleRightRect);

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

      transformPoints.leftCenter.cursorType = "e-resize";
      transformPoints.rightCenter.cursorType = "e-resize";

      // Set names
      transformPoints.topLeft.name = "topLeft";
      transformPoints.topRight.name = "topRight";
      transformPoints.topMiddle.name = "topCenter";

      transformPoints.leftCenter.name = "leftCenter";
      transformPoints.rightCenter.name = "rightCenter";

      transformPoints.bottomLeft.name = "bottomLeft";
      transformPoints.bottomMiddle.name = "bottomCenter";
      transformPoints.bottomRight.name = "bottomRight";

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


    // Return the opposite point on the transform box
    function getOppositePoint(point, x, y, bounds) {
      var _point = point;
      var opposite = bounds.center.add(bounds.center.subtract(point));

      if(x) {
        _point = new Point(opposite.x, _point.y);
      }
      if(y) {
        _point = new Point(_point.x, opposite.y);
      }

      return _point;
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
      mouseDown = true;
      _lastMousePos = e.point;

      hideTransformBox();
      if(transform.hover) {
        var bounds = getBounds();

        transform.active = true;
        drawTransformBox();

        transform.dir = e.item.name;
        point = getOppositePoint(bounds[transform.dir], true, true, bounds);

        switch(transform.dir) {
          case 'bottomLeft':
            flippedV = false;
            flippedH = false;
            lockScaleX = false;
            lockScaleY = false;
            break;
          case 'topLeft':
            flippedV = true;
            flippedH = false;
            lockScaleX = false;
            lockScaleY = false;
            break;
          case 'bottomRight':
            flippedV = false;
            flippedH = true;
            lockScaleX = false;
            lockScaleY = false;
            break;
          case 'topRight':
            flippedV = true;
            flippedH = true;
            lockScaleX = false;
            lockScaleY = false;
            break;
          case 'bottomCenter':
            flippedV = false;
            flippedH = false;
            lockScaleX = true;
            lockScaleY = false;
            break;
          case 'topCenter':
            flippedV = true;
            flippedH = false;
            lockScaleX = true;
            lockScaleY = false;
            break;
          case 'leftCenter':
            flippedV = false;
            flippedH = false;
            lockScaleX = false;
            lockScaleY = true;
            break;
          case 'rightCenter':
            flippedV = false;
            flippedH = true;
            lockScaleX = false;
            lockScaleY = true;
            break;
        }
        return;
      }
      
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
      if(mouseDown) {
        mouseDrag(e);
      }

      document.body.style.cursor = "default";
      transform.hover = false;

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

            transform.hover = true;
            transform.pivot = hoverItem.opposite;
          }
        }
      }

      if(selectingPoint && !transform.hover) {
        selectRect.remove();
        selectRect = Path.Rectangle(selectingPoint, e.point);
        selectRect.selectable = false;
        selectRect.dashArray = [4/view.zoom, 3/view.zoom];
        selectRect.strokeColor = 'black';
        selectRect.strokeWidth = 0.5/view.zoom;

        for(var i=0; i < self.OBJECTS.length; i++) {
          // Selection rect intersects with the shape
          if(selectRect.intersects(self.OBJECTS[i])) {
            if(!self.OBJECTS[i].selected) {
              self.OBJECTS[i].selected = true;
              localSelect.push(self.OBJECTS[i]);
            }
          }
          // Selection rect doesn't intersect with shape
          else {
            var _selRect = new Rectangle(selectingPoint, e.point)

            // Shape is inside the selection rect
            if(self.OBJECTS[i].isInside(_selRect)) {
              if(!self.OBJECTS[i].selected) {
                self.OBJECTS[i].selected = true;
                localSelect.push(self.OBJECTS[i]);
              }
            }

            // Shape is not inside the selection rect
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
      mouseDown = false;

      if(transform.active) {
        transform.active = false;
      }

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




    // - mouse drag -
    function mouseDrag(e) {
      // User is scaling the selection
      if(transform.active) {
        var bounds = getBounds();

        if(!lockScaleY) {
          var relH = e.point.subtract(point).y;
          var facH = Math.abs(relH)/bounds.height;
        }
        else {
          facH = 1;
        }
        if(!lockScaleX) {
          var relW = e.point.subtract(point).x;
          var facW = Math.abs(relW)/bounds.width;
        }
        else {
          facW = 1;
        }
        
        if(Math.abs(facH) < 0.1 && !lockScaleY) {
            return;
        }

        if(Math.abs(facW) < 0.1 && !lockScaleX) {
          return;
        }

        if(relH > 0 && flippedV) {
            facH = -facH
            flippedV = false

            var value = bounds.bottomLeft.y;
            
            // point = new Point(point.x, bounds[transform.dir].y);
            point = new Point(point.x, bounds.bottomLeft.y);
        }
        else if(relH < 0 && !flippedV) {
            facH = -facH
            flippedV = true
            
            // point = new Point(point.x, getOppositePoint(bounds[transform.dir], true, true, bounds).y);
            point = new Point(point.x, bounds.topLeft.y);
        }
        
        if(relW > 0 && !flippedH) {
            facW = -facW
            flippedH = true
            
            // point = new Point(getOppositePoint(bounds[transform.dir], true, true, bounds).x, point.y);
            point = new Point(bounds.bottomRight.x, point.y);
        }
        if(relW < 0 && flippedH) {
            facW = -facW
            flippedH = false
            
            // point = new Point(bounds[transform.dir].x, point.y);
            point = new Point(bounds.bottomLeft.x, point.y);
        }

        // Scale all the selected items
        for(var i=0; i<localSelect.length; i++) {
          localSelect[i].scale(facW, facH, point)
        }

        hideTransformBox();
        drawTransformBox(bounds);
      }
    }
  }
}
</script>





<style scoped>
</style>