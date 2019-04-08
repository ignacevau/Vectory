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

    var hoverItem;
    var selectionPath;

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

    bus.$on('delete_selection', () => {
      hideTransformBox();
    });

    bus.$on('zoom', () => {
      // Keep the transform box's width constant over zoom
      transformRect.strokeWidth = 0.5/view.zoom;
      transformBoxSize = 7/view.zoom;
      transformBoxWidth = 2/view.zoom;

      updateTransformBox();
    });

    function hideTransformBox() {
      transformRect.remove();

      Object.keys(transformPoints).forEach(function(point, index) {
        if(transformPoints[point]) {
          transformPoints[point].remove();
        }
      });
    }

    var _lastTransformRect;
    function drawTransformBox(rect) {
      if(rect) {
        _lastTransformRect = rect;
      }

      if(!_lastTransformRect)
        return;

      // Draw rect
      transformRect = Path.Rectangle(_lastTransformRect);
      transformRect.strokeColor = 'black';
      transformRect.locked = true;
      transformRect.strokeWidth = 0.5/view.zoom;

      // Calculate the boxes
      var topLeftRect = new Rectangle(_lastTransformRect.point.subtract(transformBoxSize/2), transformBoxSize);
      var topMiddleRect = new Rectangle(new Point(_lastTransformRect.point.x + _lastTransformRect.width/2, _lastTransformRect.point.y).subtract(transformBoxSize/2), transformBoxSize);
      var topRightRect = new Rectangle(new Point(_lastTransformRect.point.x + _lastTransformRect.width, _lastTransformRect.point.y).subtract(transformBoxSize/2), transformBoxSize);

      var middleLeftRect = new Rectangle(new Point(_lastTransformRect.point.x, _lastTransformRect.point.y + _lastTransformRect.height/2).subtract(transformBoxSize/2), transformBoxSize);
      var middleRightRect = new Rectangle(new Point(_lastTransformRect.point.x + _lastTransformRect.width, _lastTransformRect.point.y + _lastTransformRect.height/2).subtract(transformBoxSize/2), transformBoxSize);
      
      var bottomLeftRect = new Rectangle(new Point(_lastTransformRect.point.x, _lastTransformRect.point.y + _lastTransformRect.height).subtract(transformBoxSize/2), transformBoxSize);
      var bottomMiddleRect = new Rectangle(new Point(_lastTransformRect.point.x + _lastTransformRect.width/2, _lastTransformRect.point.y + _lastTransformRect.height).subtract(transformBoxSize/2), transformBoxSize);
      var bottomRightRect = new Rectangle(new Point(_lastTransformRect.point.x + _lastTransformRect.width, _lastTransformRect.point.y + _lastTransformRect.height).subtract(transformBoxSize/2), transformBoxSize);


      // Assign the boxes
      transformPoints.topLeft = Path.Rectangle(topLeftRect);
      transformPoints.topMiddle = Path.Rectangle(topMiddleRect);
      transformPoints.topRight = Path.Rectangle(topRightRect);

      transformPoints.middleLeft = Path.Rectangle(middleLeftRect);
      transformPoints.middleRight = Path.Rectangle(middleRightRect);

      transformPoints.bottomLeft = Path.Rectangle(bottomLeftRect);
      transformPoints.bottomMiddle = Path.Rectangle(bottomMiddleRect);
      transformPoints.bottomRight = Path.Rectangle(bottomRightRect);


      // Set the box colors
      Object.keys(transformPoints).forEach(function(point, index) {
        if(transformPoints[point]) {
          transformPoints[point].locked = true;
          transformPoints[point].strokeColor = 'blue';
          transformPoints[point].fillColor = 'white';
          transformPoints[point].strokeWidth = transformBoxWidth;
        }
      });
    }

    function updateTransformBox() {
      hideTransformBox();
      drawTransformBox();
    }

    self.TOOLSELECT.onMouseDown = function(e) {
      localSelect = [];
      hideTransformBox();

      transformRect = new Path();

      if(selectionPath) {
        selectionPath.remove();

        if (hoverItem && !hoverItem.selected) {
          if(e.modifiers.shift) {
            hoverItem.selected = true;
            self.ADD_SELECT(hoverItem);
          }
          else {
            project.activeLayer.selected = false;
            hoverItem.selected = true;
            self.CLEAR_SELECT();
            self.ADD_SELECT(hoverItem);
          }
        }
      }
      
      if(!e.item) {
        project.activeLayer.selected = false;
        self.CLEAR_SELECT();
        selectingPoint = e.point;
      }
    }

    self.TOOLSELECT.onMouseMove = function(e) {
      if (hoverItem) {
        hoverItem = null;
        selectionPath.remove();
      }

      if (e.item) {
        hoverItem = e.item;
        selectionPath = hoverItem.clone();
        selectionPath.strokeColor = '#33b5ff';
        selectionPath.strokeWidth = 2 / paper.view.zoom;
      }

      if(selectingPoint) {
        selectRect.remove();
        selectRect = Path.Rectangle(selectingPoint, e.point);
        selectRect.locked = true;
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
    
    self.TOOLSELECT.onMouseUp = function(e) {
      selectingPoint = null;
      selectRect.remove();

      var _temp = [];
      for(var i=0; i<localSelect.length; i++) {
        _temp.push(localSelect[i].clone());
      }

      // Make a compoundpath to get the bounds for the transform box
      var _grouped = new CompoundPath({
        children: _temp
      });

      drawTransformBox(_grouped.bounds);
      _grouped.remove();

      for(var i=0; i<localSelect.length; i++) {
        self.ADD_SELECT(localSelect[i]);
      }
    }
  }
}
</script>





<style scoped>
</style>