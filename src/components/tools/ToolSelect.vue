<template>
  <tool imgSource="tool-select.png" @isActive="setActive" />
</template>




<script>
import paper from "paper";
import Tool from "../Tool.vue";
import { mapMutations, mapState } from "vuex";
import { bus, Action } from "@/main.js";
import Data from '@/Data.js';
import { GuideLines } from '@/mixins/GuideLines.js';

export default {
  mixins: [GuideLines],
  name: "ToolSelect",
  data: function() {
    return {
      snappedY: false,
      snappedX: false
    }
  },
  computed: {
    ...mapState([
      "ACTIVE_TOOL", 
      "TOOLSELECT", 
      "OBJECTS", 
      "SELECTED", 
      "ACTIONS"
      ])
  },
  components: {
    Tool
  },
  methods: {
    ...mapMutations([
      "SET_ACTIVE",
      "ADD_SELECT",
      "DESELECT",
      "ADD_ACTION",
      "UNDO"
    ]),
    setActive: function() {
      this.SET_ACTIVE("select");

      bus.$emit("activate-select");
      this.TOOLSELECT.activate();
    }
  },
  mounted: function() {
//#region Assigning
    var el = document.querySelector("#tool-select");

    var hitOptions = {
      segments: true,
      stroke: true,
      fill: true,
      tolerance: 4
    };

    var mouseEvent;

    // Need this to create custom drag function
    var mouseDown = false;

    // Path over which the mouse currently hovers
    let hoverItem;
    var hoverSelection = new Path();
    hoverSelection.selectable = false;

    // Shadow paths while transforming path
    let shadowPaths = [];

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
    };

    // Updated through zoom
    var transformBoxSize = 7 / view.zoom;
    var transformBoxWidth = 2 / view.zoom;

    // Object with transform information
    var transform = {
      // Scaling
      pivot: null,
      dir: "", // topLeft, topMiddle, ...

      scale_facH: null,
      scale_facW: null,
    };

    const state = {
      isHovering: false,
      isScaling: false,
      isDragging: false,
      isSelecting: false,
      
      snapVecLeftX: null,
      snapVecRightX: null,
      snapVecTopY: null,
      snapVecBottomY: null
    }

    // The relative distances used in scaling
    var relH;
    var relW;

    var selectRectAnchor = null;

    // Selection rectangle
    let selectRectPath = new Path();

    var _lastMousePos;
    var mouseDelta;

    var flippedV = false;
    var flippedH = false;
    var lockScaleX = false;
    var lockScaleY = false;
    var point;

    // Object containing the data before the scaling, used for undo and shift/control modifiers
    var initTransfData = {
      height: null,
      width: null,
      pivot: null,
      center: null
    };

    var action = {
      move: new Action("move", {
        startPos: null,
        endPos: null,
        paths: null
      }),
      scale: new Action("scale", {
        paths: null,
        pivot: null,
        handle_init: null,
        handle_end: null,
        lockX: false,
        lockY: false,
        shift: false
      })
    };
//

//#region Functions
    let getSelection = () => {
      return this.SELECTED;
    }

    let getUngrouped = (items) => {
      if(items.length == 0) {
        return [];
      }

      let result = [];

      for(let i=0; i<items.length; i++) {
        let item = items[i];

        if(item.type == "shape")
          result.push(item)
        else if(item.type == "group") {
          for(let j=0; j<item.children.length; j++) {
            result.push(...getUngrouped([item.children[j]]));
          }
        }

        // Error catching - prevent infinite loop
        else {
          console.error("Unknown item type! Item was: " + item);
          return null;
        }
      }

      return result;
    }

    function ResetHover() {
      state.isHovering = false;

      if (hoverItem) {
        hoverItem = null;
        hoverSelection.remove();
      }
    }

    function DrawHoverSelection(path) {
      hoverSelection = path.clone();
      Object.assign(hoverSelection, {
        selectable: false,
        strokeColor: "#33b5ff",
        strokeWidth: 2 / paper.view.zoom
      });
    }

    function DrawShadowPaths(paths) {
      if(shadowPaths.length != 0) {
        RemoveShadowPaths();
      }

      shadowPaths = [];
      for(let i=0; i<paths.length; i++) {
        let _path = paths[i].clone();
        _path.selectable = false;
        _path.selected = false;
        _path.dashArray = [5, 5];
        _path.opacity = 0.2;
        shadowPaths.push(_path);
      }
    }

    function RemoveShadowPaths() {
      if(shadowPaths.length != 0) {
        for(let i=0; i<shadowPaths.length; i++) {
          shadowPaths[i].remove();
        }
        shadowPaths = [];
      }
    }

    function HandleMouseHoverPath(item) {
      if (!item.selected) {
        DrawHoverSelection(item);
      }
    }

    function HandleMouseHoverTransform(item) {
      document.body.style.cursor = item.cursorType;
      transform.pivot = item.opposite;
    }

    // Remove the selection box with transform points
    function hideTransformBox() {
      transformRect.remove();

      Object.keys(transformPoints).forEach(function(point, index) {
        if (transformPoints[point]) {
          transformPoints[point].remove();
        }
      });
    }

    // Draw selection box with transform points
    function drawTransformBox(rect) {
      if (rect) {
        lastTransformRect = rect;
      }

      if (!lastTransformRect) return;

      // Draw rect
      transformRect = Path.Rectangle(lastTransformRect);
      transformRect.strokeColor = "black";
      transformRect.selectable = false;
      transformRect.strokeWidth = 0.5 / view.zoom;

      // Calculate the positions
      var topLeftPt = lastTransformRect.point.subtract(transformBoxSize / 2);
      var topMiddlePt = new Point(
        lastTransformRect.point.x + lastTransformRect.width / 2,
        lastTransformRect.point.y
      ).subtract(transformBoxSize / 2);
      var topRightPt = new Point(
        lastTransformRect.point.x + lastTransformRect.width,
        lastTransformRect.point.y
      ).subtract(transformBoxSize / 2);

      var middleLeftPt = new Point(
        lastTransformRect.point.x,
        lastTransformRect.point.y + lastTransformRect.height / 2
      ).subtract(transformBoxSize / 2);
      var middleRightPt = new Point(
        lastTransformRect.point.x + lastTransformRect.width,
        lastTransformRect.point.y + lastTransformRect.height / 2
      ).subtract(transformBoxSize / 2);

      var bottomLeftPt = new Point(
        lastTransformRect.point.x,
        lastTransformRect.point.y + lastTransformRect.height
      ).subtract(transformBoxSize / 2);
      var bottomMiddlePt = new Point(
        lastTransformRect.point.x + lastTransformRect.width / 2,
        lastTransformRect.point.y + lastTransformRect.height
      ).subtract(transformBoxSize / 2);
      var bottomRightPt = new Point(
        lastTransformRect.point.x + lastTransformRect.width,
        lastTransformRect.point.y + lastTransformRect.height
      ).subtract(transformBoxSize / 2);

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
        if (transformPoints[point]) {
          transformPoints[point].type = "transformPoint";
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
        if (transformPoints[point]) {
          transformPoints[point].selectable = false;
          transformPoints[point].strokeColor = "blue";
          transformPoints[point].fillColor = "white";
          transformPoints[point].strokeWidth = transformBoxWidth;
        }
      });
    }

    // Redraw the selection box with transform points
    function updateTransformBox(bounds) {
      hideTransformBox();

      if (bounds) {
        drawTransformBox(bounds);
      } else {
        drawTransformBox();
      }
    }

    // Hide the transform points, but keep the box (e.g. while moving selection)
    function HideTransformPoints() {
      Object.keys(transformPoints).forEach(function(point, index) {
        transformPoints[point].visible = false;
      });
    }

    function ShowTransformPoints() {
      Object.keys(transformPoints).forEach(function(point, index) {
        transformPoints[point].visible = true;
      });
    }

    function CreateSelectionRectanglePath({rect, strokeWidth, strokeColor, dashArray}) {
      let path = Path.Rectangle(rect);
      Object.assign(path, {
        strokeWidth: strokeWidth,
        strokeColor: strokeColor,
        dashArray: dashArray,
        selectable: false
      });
      return path;
    }

  //#region Group
    let SelectGroup = (group) => {
      if(!group.selected) {
        let ungrouped = getUngrouped([group]);
        for(let i=0; i<ungrouped.length; i++) {
          ungrouped[i].selected = true;
        }
        group.selected = true;
        this.ADD_SELECT(group);
      }
    }

    function DeselectGroup(group) {
      DeselectShape(group);
    }

    function CheckGroupIntersection(group, rect) {
      // Check for every child in the group
      let children = getUngrouped(group.children);
      for (let j = 0; j < children.length; j++) {
        // Check for intersection with selection rect
        if (rect.intersects(children[j])) {
          return { success: true };
        }
      }

      return { success: false };
    }

    function CheckGroupInsideRect(group, rect) {
      let children = getUngrouped(group.children);
      for(let i=0; i<children.length; i++) {
        if (children[i].isInside(rect) && children[i].selectable) {
          return { success: true };
        }
      }

      return { success: false };
    }
  //

  //#region Shape
    let SelectShape = (shape) => {
      if (!shape.selected) {
        shape.selected = true;
        this.ADD_SELECT(shape);
      }
    }

    let DeselectShape = (shape) => {
      shape.selected = false;
      let index = getSelection().findIndex(x => x === shape);
      if (index != -1) {
        getSelection().splice(index, 1);
      }
    }

    function CheckShapeIntersection(shape, rectPath) {
      // Selection rect intersects with the shape
      if (rectPath.intersects(shape) && shape.selectable) {
        return { success: true };
      }

      return { success: false };
    }

    function CheckShapeInsideRect(shape, rect) {
      // Shape is inside the selection rect
      if (shape.isInside(rect) && shape.selectable) {
        return { success: true };
      }

      return { success: false };
    }
  //

    // Return the opposite point on the transform box
    function getOppositePoint(point, x, y, bounds) {
      if (!point) {
        alert("warning: 001");
        return;
      }
      var _point = point;
      var opposite = bounds.center.add(bounds.center.subtract(point));

      if (x) {
        _point = new Point(opposite.x, _point.y);
      }
      if (y) {
        _point = new Point(_point.x, opposite.y);
      }

      return _point;
    }

    // Get the selection rectangle
    let getBounds = (shapes) => {
      if (shapes.length == 0) {
        return null;
      }

      var _temp = [];
      for (var i = 0; i < shapes.length; i++) {
        let item = shapes[i];

        if(item.type == "group") {
          let ungrouped = getUngrouped(item.children);
          for(let j=0; j<ungrouped.length; j++) {
            _temp.push(ungrouped[j].clone());
          }
        }
        else if(item.type == "shape") {
          _temp.push(item.clone());
        }
      }

      // Make a compoundpath to get the bounds for the transform box
      var _grouped = new CompoundPath({
        children: _temp
      });

      var rect = _grouped.bounds;
      _grouped.remove();

      return rect;
    }

    function RedrawTransformPoints() {
      Object.keys(transformPoints).forEach((point, index) => {
        transformPoints[point].position = transformRect.bounds[point];
      });
    }

    // While scaling check whether the selection should be flipped
    function checkScaleFlip() {
      if (relH > 0 && flippedV && !lockScaleY) {
        transform.scale_facH = -transform.scale_facH;
        flippedV = false;
      } else if (relH < 0 && !flippedV && !lockScaleY) {
        transform.scale_facH = -transform.scale_facH;
        flippedV = true;
      }

      if (relW > 0 && !flippedH && !lockScaleX) {
        transform.scale_facW = -transform.scale_facW;
        flippedH = true;
      }
      if (relW < 0 && flippedH && !lockScaleX) {
        transform.scale_facW = -transform.scale_facW;
        flippedH = false;
      }
    }

    // Handle ctrl-key presses
    function handleControlKey() {
      var delta = initTransfData.center.subtract(transformRect.bounds.center);

      let selection = getUngrouped(getSelection());
      for (var i = 0; i < selection.length; i++) {
        selection[i].translate(delta);
      }

      transformRect.position = initTransfData.center;
      point = new Point(initTransfData.center.x, initTransfData.center.y);

      action.scale.data.pivot = point;

      mouseDrag(mouseEvent);
    }
//

//#region Mouse down
    
    this.TOOLSELECT.onMouseDown = e => {
      mouseDown = true;
      _lastMousePos = e.point;

      if (this.SELECTED.length != 0) {
        if (e.point.isInside(transformRect.bounds) && !state.isScaling) {
          document.body.style.cursor = "move";
          state.isDragging = true;

          // Hide scaling points when moving the selection
          HideTransformPoints();
          DrawShadowPaths(getUngrouped(getSelection()));

          state.snapVecLeftX = getBounds(getSelection()).leftCenter.subtract(e.point);
          state.snapVecRightX = getBounds(getSelection()).rightCenter.subtract(e.point);
          state.snapVecTopY = getBounds(getSelection()).topCenter.subtract(e.point);
          state.snapVecBottomY = getBounds(getSelection()).bottomCenter.subtract(e.point);

          action.move = new Action("move", {
            paths: getUngrouped(getSelection()),
            startPos: e.point,
            endPos: null
          });

          return;
        }
      }

      hideTransformBox();
      if (state.isHovering && hoverItem.type == "transformPoint") {
        let bounds = getBounds(getSelection());

        state.isScaling = true;

        // Hide scaling points when scaling the selection
        HideTransformPoints();
        DrawShadowPaths(getUngrouped(getSelection()));

        drawTransformBox();

        transform.dir = e.item.name;
        point = getOppositePoint(bounds[transform.dir], true, true, bounds);

        // Updating the backup data (for shift-scale and for undo)
        initTransfData.width = bounds.width;
        initTransfData.height = bounds.height;
        initTransfData.pivot = new Point(point.x, point.y);
        initTransfData.center = new Point(bounds.center.x, bounds.center.y);

        switch (transform.dir) {
          case "bottomLeft":
            flippedV = false;
            flippedH = false;
            lockScaleX = false;
            lockScaleY = false;
            break;
          case "topLeft":
            flippedV = true;
            flippedH = false;
            lockScaleX = false;
            lockScaleY = false;
            break;
          case "bottomRight":
            flippedV = false;
            flippedH = true;
            lockScaleX = false;
            lockScaleY = false;
            break;
          case "topRight":
            flippedV = true;
            flippedH = true;
            lockScaleX = false;
            lockScaleY = false;
            break;
          case "bottomCenter":
            flippedV = false;
            flippedH = false;
            lockScaleX = true;
            lockScaleY = false;
            break;
          case "topCenter":
            flippedV = true;
            flippedH = false;
            lockScaleX = true;
            lockScaleY = false;
            break;
          case "leftCenter":
            flippedV = false;
            flippedH = false;
            lockScaleX = false;
            lockScaleY = true;
            break;
          case "rightCenter":
            flippedV = false;
            flippedH = true;
            lockScaleX = false;
            lockScaleY = true;
            break;
        }

        if (e.modifiers.control) {
          handleControlKey();
        }

        action.scale = new Action("scale", {
          paths: getUngrouped(getSelection()),
          pivot: initTransfData.pivot,
          lockX: lockScaleX,
          lockY: lockScaleY,
          handle_init: bounds[transform.dir],
          handle_end: null,
          shift: false
        });

        mouseDrag(e);

        return;
      }

      transformRect = new Path();

      // Mouse is not over a shape
      if (!state.isHovering) {
        this.DESELECT();
      }

      // Mouse is over a shape
      if (hoverSelection) {
        hoverSelection.remove();

        if (hoverItem && !hoverItem.selected && hoverItem.selectable) {
          // Shift key is pressed
          if (e.modifiers.shift) {
            hoverItem.selected = true;

            this.ADD_SELECT(hoverItem);
          }
          // Shift key is not pressed
          else {
            project.deselectAll();

            this.DESELECT();

            SelectShape(hoverItem);
          }

          drawTransformBox(getBounds(getSelection()));
        }
      }

      if (!e.item) {
        project.deselectAll();
        this.DESELECT();
        selectRectAnchor = e.point;
        state.isSelecting = true;
      }
    };
//

//#region Mouse move
    this.TOOLSELECT.onMouseMove = (e) => {
      mouseEvent = e;

      // Reset cursor style
      document.body.style.cursor = "default";
      ResetHover();

      // Mouse is hovering over an item
      if (e.item && !state.isSelecting && !state.isDragging) {

        if (e.item.selectable) {
          hoverItem = e.item;
          state.isHovering = true;
          HandleMouseHoverPath(hoverItem);
        }
        
        // Mouse is hovering over transform-handle (not selectable)
        else if(e.item.type == "transformPoint") {
          hoverItem = e.item;
          state.isHovering = true;
          HandleMouseHoverTransform(hoverItem);
        }
      }

      if (state.isSelecting && !state.isHovering) {
        selectRectPath.remove();

        let selectRect = new Rectangle(selectRectAnchor, e.point);

        selectRectPath = CreateSelectionRectanglePath({
          rect: selectRect,
          strokeWidth: 0.5 / view.zoom,
          strokeColor: "black",
          dashArray: [4 / view.zoom, 3 / view.zoom]
        });

        let objects = this.OBJECTS;
        for (let i = 0; i < objects.length; i++) {
          /* First, check for intersections between the shapes and the selection rectangle,
            if none, check whether the shapes are inside the rectangle */
            
          let obj = objects[i];

          // Group
          if (obj.type == "group" && obj.selectable) {
            let _isIntersect = CheckGroupIntersection(obj, selectRectPath);

            if(_isIntersect.success)
              SelectGroup(obj);
            else {
              let _isInside = CheckGroupInsideRect(obj, selectRect);

              if(_isInside.success)
                SelectGroup(obj);
              else {
                DeselectGroup(obj);
              }
            }
          }
          
          // Shape
          else if (obj.type == "shape") {
            let _isIntersect = CheckShapeIntersection(obj, selectRectPath);

            if(_isIntersect.success)
              SelectShape(obj);
            else {
              let _isInside = CheckShapeInsideRect(obj, selectRect);

              if(_isInside.success)
                SelectShape(obj);
              else {
                DeselectShape(obj);
              }
            }
          }

        }
      }
      if (this.SELECTED.length != 0) {
        if (e.point.isInside(transformRect.bounds) && !state.isScaling) {
          document.body.style.cursor = "move";
        }
      }

      // Call mouseDrag AFTER mouseMove
      if (mouseDown) {
        mouseDrag(e);
      }
    };
//

//#region Mouse up
    this.TOOLSELECT.onMouseUp = e => {
      mouseDown = false;
      var _return = false;

      selectRectAnchor = null;
      state.isSelecting = false;
      selectRectPath.remove();

      if (getSelection().length == 0) {
        return;
      }

      if (state.isScaling) {
        lockScaleX = false;
        lockScaleY = false;

        let bounds = getBounds(getSelection());

        action.scale.data.handle_end = getOppositePoint(
          point,
          true,
          true,
          bounds
        );
        if (e.modifiers.shift) {
          action.scale.data.shift = true;
        }
        this.ADD_ACTION(action.scale);

        state.isScaling = false;

        // Scaling points where hidden while moving selection
        ShowTransformPoints();
        RemoveShadowPaths();

        _return = true;

        // Update the guide-points
        this.updateGuidePoints();
      }

      if (state.isDragging) {
        action.move.data.endPos = e.point;
        this.ADD_ACTION(action.move);

        state.isDragging = false;

        // Scaling points where hidden while moving selection
        ShowTransformPoints();
        RemoveShadowPaths();

        _return = true;

        // Update the guide-points
        this.updateGuidePoints();
      }

      if(this.snappedX)
        this.clearGuideLinesX();
      if(this.snappedY)
        this.clearGuideLinesY();

      // Update transform box with new rectangle
      hideTransformBox();
      drawTransformBox(getBounds(getSelection()));

      if (_return) {
        return;
      }
    };
//

//#region Mouse drag
    let mouseDrag = (e) => {
      mouseDelta = e.point.subtract(_lastMousePos);
      if(Data.SNAP_MOVE && state.isDragging) {
        let snapY = null;
        let snapX = null;

        // Snapping y-axis
        if(mouseDelta.y != 0) {
          let snappedY = false;

          // Check for top snap
          let guided, _;
          [guided, _, snappedY] = this.getGuidedPosition(e.point.add(state.snapVecTopY))
          mouseDelta.y = guided.subtract(transformRect.bounds.topCenter).y;

          if(snappedY) {
            snapY = guided.y;
          }
          //If top hasn't snapped, check for bottom snap
          else {
            [guided, _, snappedY] = this.getGuidedPosition(e.point.add(state.snapVecBottomY));
            mouseDelta.y = guided.subtract(transformRect.bounds.bottomCenter).y;

            if(snappedY) {
              snapY = guided.y;
            }
          }

          // If snapped to a y-line, display the line
          if (snapY != null) {
            this.drawGuideLines(null, [snapY]);
            this.snappedY = true;
          }
          else if(this.snappedY) {
            this.snappedY = false;
            this.clearGuideLinesY();
          }
        }

        // Snapping x-axis
        if(mouseDelta.x != 0) {
          let snappedX = false;

          // Check for left snap
          let guided, _;
          [guided, snappedX, _] = this.getGuidedPosition(e.point.add(state.snapVecLeftX));
          mouseDelta.x = guided.subtract(transformRect.bounds.leftCenter).x;

          if(snappedX) {
            snapX = guided.x;
          }
          // If left hasn't snapped, check for right snap
          else {
            [guided, snappedX, _] = this.getGuidedPosition(e.point.add(state.snapVecRightX));
            mouseDelta.x = guided.subtract(transformRect.bounds.rightCenter).x;

            if(snappedX) {
              snapX = guided.x;
            }
          }

          // If snapped to a x-line, display the line
          if (snapX != null) {
            this.drawGuideLines([snapX], null);
            this.snappedX = true;
          }
          else if(this.snappedX) {
            this.snappedX = false;
            this.clearGuideLinesX();
          }
        }
      }

      _lastMousePos = e.point;

      var path = transformRect;

      // User is moving the selection
      if (state.isDragging) {
        let selection = getUngrouped(getSelection());
        for (var i = 0; i < selection.length; i++) {
          selection[i].translate(mouseDelta);
        }

        transformRect.translate(mouseDelta);
        lastTransformRect = transformRect.bounds;

        Object.keys(transformPoints).forEach(function(point, index) {
          transformPoints[point].translate(mouseDelta);
        });
        return;
      }

      // User is scaling the selection
      if (state.isScaling) {
        // Add snapping if enabled
        if(Data.SNAP_SCALE) {
          if(Math.abs(transform.scale_facH) > 0.1 && Math.abs(transform.scale_facW) > 0.1) {
            let [guided, xsnapped, ysnapped] = this.getGuidedPosition(e.point);
            if (xsnapped) {
              this.drawGuideLines([guided.x], null);
              this.snappedX = true;
            }
            else if(this.snappedX) {
              this.snappedX = false;
              this.clearGuideLinesX();
            }
            if (ysnapped) {
              this.drawGuideLines(null, [guided.y]);
              this.snappedY = true;
            }
            else if(this.snappedY) {
              this.snappedY = false;
              this.clearGuideLinesY();
            }

            e.point = guided;
          }
        }
        
        let bounds = transformRect.bounds;

        if (!lockScaleY) {
          relH = e.point.subtract(point).y;
          transform.scale_facH = Math.abs(relH) / bounds.height;
        } else {
          transform.scale_facH = 1;
        }
        if (!lockScaleX) {
          relW = e.point.subtract(point).x;
          transform.scale_facW = Math.abs(relW) / bounds.width;
        } else {
          transform.scale_facW = 1;
        }

        if (Math.abs(transform.scale_facH) < 0.1 && !lockScaleY) {
          return;
        }

        if (Math.abs(transform.scale_facW) < 0.1 && !lockScaleX) {
          return;
        }

        if (!e.modifiers.shift) {
          checkScaleFlip();
        }

        if (e.modifiers.shift) {
          var min = Math.min(
            Math.abs(transform.scale_facH),
            Math.abs(transform.scale_facW)
          );

          if (lockScaleY) {
            min = Math.abs(transform.scale_facW);
          } else if (lockScaleX) {
            min = Math.abs(transform.scale_facH);
          }

          transform.scale_facH = min;
          transform.scale_facW = min;
        }

        if (e.modifiers.control) {
          if (!lockScaleX) {
            transform.scale_facW *= 2;
          }
          if (!lockScaleY) {
            transform.scale_facH *= 2;
          }
        }

        // Scale all the selected items
        let selection = getUngrouped(getSelection());
        for (var i = 0; i < selection.length; i++) {
          selection[i].scale(
            transform.scale_facW,
            transform.scale_facH,
            point
          );
        }

        transformRect.scale(transform.scale_facW, transform.scale_facH, point);

        // Don't show the points while scaling
        Object.keys(transformPoints).forEach((point, index) => {
          transformPoints[point].remove();
        });
      }
    }
//

//#region events
    // - user is zooming -
    bus.$on("zoom", () => {
      // Keep the transform box's width constant over zoom
      transformRect.strokeWidth = 0.5 / view.zoom;
      transformBoxSize = 7 / view.zoom;
      transformBoxWidth = 2 / view.zoom;

      if (getSelection().length > 0) {
        updateTransformBox();
      }
    });

    // - Ctrl + Z -
    bus.$on("undo", () => {
      if (this.ACTIONS.length > 0) {
        this.UNDO();

        project.deselectAll();

        let selection = getUngrouped(getSelection());
        for (var i = 0; i < selection.length; i++) {
          selection[i].selected = true;
        }

        updateTransformBox(getBounds(getSelection()));
        this.updateGuidePoints();
      }
    });

    // - delete key pressed -
    bus.$on("delete_selection", () => {
      this.DESELECT();
      hideTransformBox();
    });

    // - shift key pressed -
    bus.$on("shift", () => {
      if (state.isScaling) {
        var bounds = getBounds(getSelection());

        var facH_init = initTransfData.height / bounds.height;
        var facW_init = initTransfData.width / bounds.width;

        // Scale the selection to its initial size
        let selection = getUngrouped(getSelection());
        for (var i = 0; i < selection.length; i++) {
          selection[i].scale(facW_init, facH_init, point);
        }

        // Resize the transform rect as well
        transformRect.scale(facW_init, facH_init, point);
        var rel;

        if (lockScaleX) {
          rel = Math.abs(relH);
        } else if (lockScaleY) {
          rel = Math.abs(relW);
        } else {
          rel = Math.min(Math.abs(relH), Math.abs(relW));
        }

        var fac = rel / Math.min(initTransfData.width, initTransfData.height);

        // Resize the selection to the current size without deformation
        for (var i = 0; i < selection.length; i++) {
          selection[i].scale(fac, fac, point);
        }

        // Resize transform rect as well
        transformRect.scale(fac, fac, point);

        mouseDrag(mouseEvent);
      }
    });

    // - control key pressed -
    bus.$on("control", () => {
      if (state.isScaling) {
        handleControlKey();
      }
    });

    // - control key released -
    bus.$on("control_up", () => {
      if (state.isScaling) {
        point = new Point(initTransfData.pivot.x, initTransfData.pivot.y);
        action.scale.data.pivot = point;

        relH = mouseEvent.point.subtract(point).y;
        relW = mouseEvent.point.subtract(point).x;

        var curDistPt;

        if (relH >= 0 && relW >= 0) {
          curDistPt = transformRect.bounds.topLeft;
          flippedV = false;
          flippedH = true;
        } else if (relH >= 0 && relW < 0) {
          curDistPt = transformRect.bounds.topRight;
          flippedV = false;
          flippedH = false;
        } else if (relH < 0 && relW >= 0) {
          curDistPt = transformRect.bounds.bottomLeft;
          flippedV = true;
          flippedH = true;
        } else if (relH < 0 && relW < 0) {
          curDistPt = transformRect.bounds.bottomRight;
          flippedV = true;
          flippedH = false;
        }

        var delta = initTransfData.pivot.subtract(curDistPt);
        if (lockScaleX) {
          delta.x = 0;
        } else if (lockScaleY) {
          delta.y = 0;
        }

        transformRect.translate(delta);
        let selection = getUngrouped(getSelection());
        for (var i = 0; i < selection.length; i++) {
          selection[i].translate(delta);
        }

        mouseDrag(mouseEvent);
      }
    });

    bus.$on("hide-transformbox", () => {
      hideTransformBox();
    });

    // - switched to another tool -
    bus.$on("deactivate-select", () => {
      for (var i = 0; i < getSelection().length; i++) {
        DeselectShape(getSelection());
      }

      if (this.ACTIVE_TOOL != "pointer") {
        this.DESELECT();
      }

      hideTransformBox();
    });

    bus.$on("activate-select", () => {
      if (this.SELECTED.length > 0) {
        for (var i = 0; i < getSelection().length; i++) {
          SelectShape(getSelection()[i]);
        }

        // There could've been drawn a new shape
        this.updateGuidePoints();

        drawTransformBox(getBounds(getSelection()));
      }
    });

    bus.$on("set_color_stroke", color => {
      let selection = getUngrouped(getSelection());
      for (var i = 0; i < selection.length; i++) {
        selection[i].strokeColor = color;
      }
    });

    bus.$on("set_color_fill", color => {
      let selection = getUngrouped(getSelection());
      for (var i = 0; i < selection.length; i++) {
        selection[i].fillColor = color;
      }
    });

    bus.$on("set_width_stroke", width => {
      let selection = getUngrouped(getSelection());
      for (var i = 0; i < selection.length; i++) {
        selection[i].strokeWidth = width;
      }
    });

    bus.$on("set_cap_stroke", type => {
      let selection = getUngrouped(getSelection());
      for (var i = 0; i < selection.length; i++) {
        selection[i].strokeCap = type;
      }
    });

    bus.$on("set_opacity", opacity => {
      let selection = getUngrouped(getSelection());
      for (var i = 0; i < selection.length; i++) {
        selection[i].opacity = opacity/100;
      }
    });

    bus.$on("flip-hor", () => {
      if (this.SELECTED.length > 0) {
        let bounds = getBounds(getSelection());
        var center = bounds.center;

        let selection = getUngrouped(getSelection());
        for (var i = 0; i < selection.length; i++) {
          selection[i].scale(1, -1, center);
        }
      }
    });

    bus.$on("flip-ver", () => {
      if (this.SELECTED.length > 0) {
        let bounds = getBounds(getSelection());
        var center = bounds.center;

        for (var i = 0; i < this.SELECTED.length; i++) {
          this.SELECTED[i].scale(-1, 1, center);
        }
      }
    });

    document.addEventListener("mousedown", e => {
      var temp = [];
      for (var i = 0; i < this.ACTIONS.length; i++) {
        temp.push(this.ACTIONS[i].data.paths.length);
      }
    });
//

//#region Aligning

  // Horizontal
  bus.$on('align-hor-center', () => {
    let selection = getSelection();
    let bounds = getBounds(selection);
    let dist_x = Data.CENTER_HOR - bounds.center.x;

    let ungrouped = getUngrouped(selection);
    for(let i=0; i<ungrouped.length; i++) {
      ungrouped[i].translate([dist_x, 0]);
    }

    updateTransformBox(getBounds(getSelection()));
  });

  bus.$on('align-hor-left', () => {
    let selection = getSelection();
    let bounds = getBounds(selection);
    let docLeft = Data.CENTER_HOR - Data.DOCUMENT_WIDTH/2;
    let dist_x = docLeft - bounds.x;

    let ungrouped = getUngrouped(selection);
    for(let i=0; i<ungrouped.length; i++) {
      ungrouped[i].translate([dist_x, 0]);
    }

    updateTransformBox(getBounds(getSelection()));
  });

  bus.$on('align-hor-right', () => {
    let selection = getSelection();
    let bounds = getBounds(selection);
    let docRight = Data.CENTER_HOR + Data.DOCUMENT_WIDTH/2;
    let dist_x = docRight - (bounds.x + bounds.width);

    let ungrouped = getUngrouped(selection);
    for(let i=0; i<ungrouped.length; i++) {
      ungrouped[i].translate([dist_x, 0]);
    }

    updateTransformBox(getBounds(getSelection()));
  });


  // Vertical
  bus.$on('align-ver-center', () => {
    let selection = getSelection();
    let bounds = getBounds(selection);
    let dist_y = Data.CENTER_VER - bounds.center.y;

    let ungrouped = getUngrouped(selection);
    for(let i=0; i<ungrouped.length; i++) {
      ungrouped[i].translate([0, dist_y]);
    }

    updateTransformBox(getBounds(getSelection()));
  });

  bus.$on('align-ver-top', () => {
    let selection = getSelection();
    let bounds = getBounds(selection);
    let docTop = Data.CENTER_VER - Data.DOCUMENT_HEIGHT/2;
    let dist_y = docTop - bounds.y;

    let ungrouped = getUngrouped(selection);
    for(let i=0; i<ungrouped.length; i++) {
      ungrouped[i].translate([0, dist_y]);
    }

    updateTransformBox(getBounds(getSelection()));
  });

  bus.$on('align-ver-bottom', () => {
    let selection = getSelection();
    let bounds = getBounds(selection);
    let docTop = Data.CENTER_VER + Data.DOCUMENT_HEIGHT/2;
    let dist_y = docTop - (bounds.y + bounds.height);

    let ungrouped = getUngrouped(selection);
    for(let i=0; i<ungrouped.length; i++) {
      ungrouped[i].translate([0, dist_y]);
    }

    updateTransformBox(getBounds(getSelection()));
  });
//
  }
};
</script>





<style scoped>
</style>