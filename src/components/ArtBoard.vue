<template>
  <div class="art-board">
    <canvas id="canvas" class="canvas" resize></canvas>
  </div>
</template>

<script>
import paper from "paper";
import { mapState, mapMutations } from "vuex";
import { bus } from "@/main.js";
import { get } from "http";

export default {
  name: "ArtBoard",
  computed: {
    ...mapState(["SELECTED_LAYER_INDEX"])
  },
  methods: {
    ...mapMutations([
      "SET_TOOLSELECT",
      "SET_TOOLPOINTER",
      "SET_TOOLPEN",
      "SET_TOOLCIRCLE",
      "SET_TOOLRECTANGLE",
      "SET_TOOLSHAPEBUILDER",
      "SET_TOOLLINE",
      "DELETE_SHAPES"
    ])
  },
  mounted: function() {
    // Clamp prototype
    Number.prototype.clamp = function(min, max) {
      return Math.min(Math.max(this, min), max);
    };

    const canvas = document.querySelector("#canvas");

    //#region PaperJS setup
    paper.install(window);
    paper.setup("canvas");

    paper.settings.handleSize = 8;
    paper.settings.hitTolerance = 7; /*value updated with zoom*/

    const view = paper.view;

    const toolSelect = new Tool();
    const toolPointer = new Tool();
    const toolPen = new Tool();
    const toolCircle = new Tool();
    const toolRectangle = new Tool();
    const toolShapebuilder = new Tool();
    const toolLine = new Tool();

    // Set global store references
    this.SET_TOOLSELECT(toolSelect);
    this.SET_TOOLPOINTER(toolPointer);
    this.SET_TOOLPEN(toolPen);
    this.SET_TOOLCIRCLE(toolCircle);
    this.SET_TOOLRECTANGLE(toolRectangle);
    this.SET_TOOLSHAPEBUILDER(toolShapebuilder);
    this.SET_TOOLLINE(toolLine);
    //


    //#region Layers
    let AddLayer = () => {
      let _newLayer = project.addLayer(new Layer());
      _newLayer.activate();
    };

    let RemoveLayer = () => {
      for(let i=0; i<project.activeLayer.children.length; i++) {
        project.activeLayer.children[i].selectable=false;
      }
      project.activeLayer.remove();
    };

    let UpdateActiveLayer = () => {
      project.layers[this.SELECTED_LAYER_INDEX].activate();
    };

    bus.$on("add-layer", () => {
      AddLayer();
    });
    bus.$on("remove-layer", () => {
      RemoveLayer();
    });
    bus.$on("update-active-layer", () => {
      UpdateActiveLayer();
    });
    //

    // Add first layer
    AddLayer();

    //#region Zoom
    let zoomOffset = 0;

    canvas.onwheel = function(e) {
      bus.$emit("zoom");
      e.preventDefault();

      const mousePos = new Point(e.clientX, e.clientY);
      updateZoom(e.deltaY, mousePos);
    };

    function updateZoom(delta, mousePos) {
      const mouseViewPos = view.viewToProject(mousePos);
      [view.zoom, zoomOffset] = changeZoomStable(
        view.zoom,
        delta,
        view.center,
        mouseViewPos
      );
      view.center = view.center.add(zoomOffset);
      view.draw();

      // Pretty much hardcoded, this is to adjust the hitTolerance in respect to the zoom
      settings.hitTolerance = (7 / view.zoom).clamp(0, 17);
    }

    function getNewZoom(oldZoom, delta) {
      const factor = 1.05;

      if (delta > 0) {
        return oldZoom / factor;
      } else if (delta < 0) {
        return oldZoom * factor;
      }
    }

    function changeZoomStable(oldZoom, delta, c, p) {
      var newZoom = getNewZoom(oldZoom, delta).clamp(0.2, 10);
      var beta = oldZoom / newZoom;
      var pc = p.subtract(c);
      var a = p.subtract(pc.multiply(beta)).subtract(c);

      return [newZoom, a];
    }
    //

    //#region Key-Handling
    var keys = {
      del: false,
      shift: false,
      control: false,
      z: false
    };

    let keyHandler = e => {
      if (!keys.del && e.code == "Delete" && !keys.control && !keys.shift) {
        keys.del = true;
        this.DELETE_SHAPES();

        // Let other components know (ToolSelect -> transform box must disappear)
        bus.$emit("delete_selection");
      } else if (!keys.shift && e.code == "ShiftLeft") {
        keys.shift = true;
        bus.$emit("shift");
      } else if (!keys.control && e.code == "ControlLeft") {
        keys.control = true;
        bus.$emit("control");
      } else if (!keys.z && e.key == "z") {
        keys.z = true;
      }

      if (keys.z && keys.control) {
        bus.$emit("undo");
      }
    };

    // --- Key checks ---
    document.onkeydown = keyHandler;

    document.onkeyup = function(e) {
      if (e.code == "ControlLeft") {
        bus.$emit("control_up");
      }

      if (e.key == "z") {
        keys.z = false;
        return;
      }
      if (e.code == "Delete") {
        keys.del = false;
      }

      keys.control = false;
      keys.shift = false;
      keys.del = false;
      keys.z = false;
    };
    //
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.canvas {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 0;
}
</style>
