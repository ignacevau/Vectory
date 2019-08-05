<template>
  <tool imgSource="tool-select.png" @isActive="setActive" />
</template>




<script>
import paper from "paper";
import Tool from "../Tool.vue";
import { mapMutations, mapState } from "vuex";
import { bus, Action } from "@/main.js";

export default {
  name: "ToolSelect",
  computed: {
    ...mapState(["ACTIVE_TOOL", "TOOLSELECT", "OBJECTS", "SELECTED", "ACTIONS"])
  },
  components: {
    Tool
  },
  methods: {
    ...mapMutations([
      "SET_ACTIVE",
      "ADD_SELECT",
      "CLEAR_SELECT",
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

      // Dragging
      hoverDrag: false,
    };

    const state = {
      isHovering: false,
      isScaling: false,
      isDragging: false,
      isSelecting: false
    }

    // The relative distances used in scaling
    var relH;
    var relW;

    var selectRectAnchor = null;

    // Selection rectangle
    let selectRectPath = new Path();

    // Local array containing the selected paths (this.SELECTED is the public array)
    var localSelect = [];

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

    function HandleMouseHover(item) {
      hoverItem = item;

      if (hoverItem.selectable) {
        // Hovering over a path
        if (hoverItem.type == "shape") {
          if (!hoverItem.selected) {
            DrawHoverSelection(hoverItem);
          }
        }
      }

      if(!hoverItem.selectable) {
        // Hovering over a transform-handle
        if (hoverItem.type == "transformPoint") {
          document.body.style.cursor = hoverItem.cursorType;
          state.isHovering = true;
          transform.pivot = hoverItem.opposite;
        }
      }
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

    function CreateSelectionRectanglePath(rect) {
      let path = Path.Rectangle(rect);
      Object.assign(path, {
        dashArray: [4 / view.zoom, 3 / view.zoom],
        strokeWidth: 0.5 / view.zoom,
        strokeColor: "black",
        selectable: false
      });
      return path;
    }

  //#region Group
    function SelectGroup(group) {
      for (let i = 0; i < group.children.length; i++) {
        let child = group.children[i];
        SelectShape(child);
      }
    }

    function DeselectGroup(group) {
      for (let i = 0; i < group.children.length; i++) {
        let child = group.children[i]

        DeselectShape(child);
      }
    }

    function CheckGroupIntersection(group, rect) {
      // Check for every child in the group
      for (let j = 0; j < group.children.length; j++) {
        // Check for intersection with selection rect
        if (rect.intersects(group.children[j])) {
          return { success: true };
        }
      }

      return { success: false };
    }

    function CheckGroupInsideRect(group, rect) {
      for(let i=0; i<group.children.length; i++) {
        if (group.children[i].isInside(rect) && group.children[i].selectable) {
          return { success: true };
        }
      }

      return { success: false };
    }
  //

  //#region Shape
    function SelectShape(shape) {
      if (!shape.selected) {
        shape.selected = true;
        localSelect.push(shape);
      }
    }

    function DeselectShape(shape) {
      shape.selected = false;
      let index = localSelect.findIndex(x => x === shape);
      if (index != -1) {
        localSelect.splice(index, 1);
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
    function getBounds() {
      if (localSelect.length == 0) return;

      var _temp = [];
      for (var i = 0; i < localSelect.length; i++) {
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

      for (var i = 0; i < localSelect.length; i++) {
        localSelect[i].translate(delta);
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

      if (transform.hoverDrag) {
        action.move = new Action("move", {
          paths: localSelect,
          startPos: e.point,
          endPos: null
        });

        state.isDragging = true;
        return;
      }

      hideTransformBox();
      if (state.isHovering) {
        var bounds = getBounds();

        state.isScaling = true;

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
          paths: localSelect,
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
      if (!hoverItem) {
        localSelect = [];
      }

      // Mouse is over a shape
      if (hoverSelection) {
        hoverSelection.remove();

        if (hoverItem && !hoverItem.selected && hoverItem.selectable) {
          // Shift key is pressed
          if (e.modifiers.shift) {
            hoverItem.selected = true;

            this.ADD_SELECT(hoverItem);
            localSelect.push(hoverItem);
          }
          // Shift key is not pressed
          else {
            project.deselectAll();
            hoverItem.selected = true;

            localSelect = [];
            this.CLEAR_SELECT();

            this.ADD_SELECT(hoverItem);
            localSelect.push(hoverItem);
          }

          drawTransformBox(getBounds());
        }
      }

      if (!e.item) {
        project.deselectAll();
        this.CLEAR_SELECT();
        selectRectAnchor = e.point;
        state.isSelecting = true;
      }
    };
//

//#region Mouse move
    this.TOOLSELECT.onMouseMove = (e) => {
      mouseEvent = e;

      if (mouseDown) {
        mouseDrag(e);
      }

      // Reset cursor style
      document.body.style.cursor = "default";
      ResetHover();

      // Mouse is hovering over an item
      if (e.item) {
        HandleMouseHover(e.item);
      }

      if (state.isSelecting && !state.isHovering) {
        selectRectPath.remove();

        let selectRect = new Rectangle(selectRectAnchor, e.point);
        selectRectPath = CreateSelectionRectanglePath(selectRect);

        let objects = this.OBJECTS;
        for (let i = 0; i < objects.length; i++) {
          let obj = objects[i];

          // Group
          if (obj.type == "group" && obj.selectable) {
            /* First, check for intersections between the shapes and the selection rectangle,
            if none, check whether the shapes are inside the rectangle */

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
      transform.hoverDrag = false;

      if (this.SELECTED.length != 0) {
        if (
          e.point.isInside(lastTransformRect) &&
          !state.isHovering &&
          !state.isScaling
        ) {
          document.body.style.cursor = "move";
          transform.hoverDrag = true;
        }
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

      if (localSelect.length == 0) {
        return;
      }

      if (state.isScaling) {
        lockScaleX = false;
        lockScaleY = false;

        var bounds = getBounds();

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
        _return = true;
      }

      if (state.isDragging) {
        action.move.data.endPos = e.point;
        this.ADD_ACTION(action.move);

        state.isDragging = false;

        _return = true;
      }

      // Update transform box with new rectangle
      hideTransformBox();
      drawTransformBox(getBounds());

      if (_return) {
        return;
      }

      this.CLEAR_SELECT();
      for (var i = 0; i < localSelect.length; i++) {
        this.ADD_SELECT(localSelect[i]);
      }
    };
//

//#region Mouse drag
    function mouseDrag(e) {
      mouseDelta = e.point.subtract(_lastMousePos);
      _lastMousePos = e.point;

      var path = transformRect;

      // User is moving the selection
      if (state.isDragging) {
        for (var i = 0; i < localSelect.length; i++) {
          localSelect[i].translate(mouseDelta);
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
        var bounds = transformRect.bounds;

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
        for (var i = 0; i < localSelect.length; i++) {
          localSelect[i].scale(
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

      if (localSelect.length > 0) {
        updateTransformBox();
      }
    });

    // - Ctrl + Z -
    bus.$on("undo", () => {
      if (this.ACTIONS.length > 0) {
        this.UNDO();

        project.deselectAll();

        localSelect = [...this.SELECTED];
        for (var i = 0; i < localSelect.length; i++) {
          localSelect[i].selected = true;
        }

        updateTransformBox(getBounds());
      }
    });

    // - delete key pressed -
    bus.$on("delete_selection", () => {
      localSelect = [];
      hideTransformBox();
    });

    // - shift key pressed -
    bus.$on("shift", () => {
      if (state.isScaling) {
        var bounds = getBounds();

        var facH_init = initTransfData.height / bounds.height;
        var facW_init = initTransfData.width / bounds.width;

        // Scale the selection to its initial size
        for (var i = 0; i < localSelect.length; i++) {
          localSelect[i].scale(facW_init, facH_init, point);
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
        for (var i = 0; i < localSelect.length; i++) {
          localSelect[i].scale(fac, fac, point);
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
        for (var i = 0; i < localSelect.length; i++) {
          localSelect[i].translate(delta);
        }

        mouseDrag(mouseEvent);
      }
    });

    bus.$on("hide-transformbox", () => {
      hideTransformBox();
    });

    // - switched to another tool -
    bus.$on("deactivate-select", () => {
      for (var i = 0; i < localSelect.length; i++) {
        localSelect[i].selected = false;
      }

      if (this.ACTIVE_TOOL != "pointer") {
        this.CLEAR_SELECT();
      }

      localSelect = [];
      hideTransformBox();
    });

    bus.$on("activate-select", () => {
      if (this.SELECTED.length > 0) {
        for (var i = 0; i < this.SELECTED.length; i++) {
          localSelect.push(this.SELECTED[i]);
        }

        drawTransformBox(getBounds());
      }
    });

    bus.$on("set_color_stroke", color => {
      for (var i = 0; i < localSelect.length; i++) {
        localSelect[i].strokeColor = color;
      }
    });

    bus.$on("set_color_fill", color => {
      for (var i = 0; i < localSelect.length; i++) {
        localSelect[i].fillColor = color;
      }
    });

    bus.$on("set_width", width => {
      for (var i = 0; i < localSelect.length; i++) {
        localSelect[i].strokeWidth = width;
      }
    });

    bus.$on("set-cap", type => {
      for (var i = 0; i < localSelect.length; i++) {
        localSelect[i].strokeCap = type;
      }
    });

    bus.$on("flip-hor", () => {
      if (this.SELECTED.length > 0) {
        var bounds = getBounds();
        var center = bounds.center;

        for (var i = 0; i < this.SELECTED.length; i++) {
          this.SELECTED[i].scale(1, -1, center);
        }
      }
    });

    bus.$on("flip-ver", () => {
      if (this.SELECTED.length > 0) {
        var bounds = getBounds();
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
  }
};
</script>





<style scoped>
</style>