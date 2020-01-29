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
import Data from '@/Data.js'
import { GuideLines } from '@/mixins/GuideLines.js';

export default {
  mixins: [GuideLines],
  name: "ArtBoard",
  computed: {
    ...mapState([
      "SELECTED_LAYER_INDEX",
      "LAYERS",
      'SCREEN_BORDER',
      'OBJECTS',
      'ACTIVE_TOOL'
      ])
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
      "DELETE_SHAPES",
      "INSERT_LAYER",
      "SET_SELECTED_LAYER_INDEX",
      "SWAP_LAYERS",
      "REFRESH_LAYER_ARRAY",
      "SET_SCREEN_BORDER",
      "ADD_SELECT"
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

    let border_w = Data.DOCUMENT_WIDTH;
    let border_h = Data.DOCUMENT_HEIGHT;

    // Set the screen border
    this.SET_SCREEN_BORDER(new Path.Rectangle({
      point: [
        Data.CENTER_HOR - border_w/2, 
        Data.CENTER_VER - border_h/2
      ],
      size: [border_w, border_h],
      strokeColor: '#969696'
    }));

    // Create UI layer and add screen border
    const UI_LAYER = project.addLayer(new Layer({
      children: [this.SCREEN_BORDER]
    }));

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

    // Create default layer
    let defaultLayer = project.addLayer(new Layer());
    defaultLayer.number = 0;
    defaultLayer.name = "Default";
    defaultLayer.activate();

    this.INSERT_LAYER(defaultLayer);

    const layerLayout = {
      0: defaultLayer
    };

    let layerCount = 1;

    let AddLayer = () => {
      let _newLayer = project.addLayer(new Layer());
      _newLayer.number = layerCount;
      _newLayer.name = "Layer " + layerCount;
      layerLayout[layerCount] = _newLayer;
      _newLayer.activate();
      this.INSERT_LAYER(_newLayer);
      layerCount++;
    };

    let RemoveLayer = (number) => {
      for(let i=0; i<layerLayout[number].children.length; i++) {
        layerLayout[number].children[i].selectable=false;
      }

      layerLayout[number].data.deleted = true;
      layerLayout[number].remove();

      this.SET_SELECTED_LAYER_INDEX(0);

      this.REFRESH_LAYER_ARRAY();
    };

    let MergeLayers = (layers, bottom_index) => {
      layers[bottom_index-1].addChildren(layers[bottom_index].children);
      RemoveLayer(layers[bottom_index].number);
    };

    let UpdateActiveLayer = (number) => {
      layerLayout[number].activate();
      this.SET_SELECTED_LAYER_INDEX(number);
    };

    let LayerSelectAll = (number) => {
      let _children = layerLayout[number].children;
      for(let i=0; i<this.OBJECTS.length; i++) {
        if(_children.includes(this.OBJECTS[i])) {
          this.ADD_SELECT(this.OBJECTS[i]);
          this.OBJECTS[i].selected = true;
        }
      }

      if(this.ACTIVE_TOOL == 'select') {
        bus.$emit('hide-transformbox');
        bus.$emit('activate-select');
      }
    }

    let getLayersFiltered = () => {
      return this.LAYERS.filter(function(el) {
        return !el.data.deleted;
      });
    }

    bus.$on("add-layer", () => {
      AddLayer();
    });
    bus.$on("remove-layer", () => {
      RemoveLayer(this.SELECTED_LAYER_INDEX);
    });
    bus.$on("merge-layers", () => {
      let number = this.SELECTED_LAYER_INDEX;
      let layersFiltered = getLayersFiltered();

      for(let i=1; i<layersFiltered.length; i++) {
        if(layersFiltered[i] == layerLayout[number]) {
          MergeLayers(layersFiltered, i);
        }
      }
    });
    bus.$on("update-active-layer", (number) => {
      UpdateActiveLayer(number);
    });
    bus.$on("layer-select-all", (number) => {
      LayerSelectAll(number);
    });
    bus.$on('move-layer-up', (number) => {
      let first_index = -1;
      let second_index = -1;
      for(let i=this.LAYERS.length-1; i >= 0; i--) {
        if(first_index == -1) {
          if(this.LAYERS[i] == layerLayout[number]) {
            first_index = i;
          }
        }
        else if(second_index == -1) {
          // Valid layer and don't allow to move above default layer
          if(!this.LAYERS[i].data.deleted && this.LAYERS[i].number != 0) {
            second_index = i;
          }
        }
      }

      if(first_index != -1 && second_index != -1) {
        this.LAYERS[second_index].insertAbove(this.LAYERS[first_index]);
        this.SWAP_LAYERS({first_index, second_index});
      }
    });
    bus.$on('move-layer-down', (number) => {
      // Don't allow to move the default layer
      if(number == 0)
        return;
      
      let first_index = -1;
      let second_index = -1;
      for(let i=0; i < this.LAYERS.length; i++) {
        if(first_index == -1) {
          if(this.LAYERS[i] == layerLayout[number]) {
            first_index = i;
          }
        }
        else if(second_index == -1) {
          if(!this.LAYERS[i].data.deleted) {
            second_index = i;
          }
        }
      }

      if(first_index != -1 && second_index != -1) {
        this.LAYERS[first_index].insertAbove(this.LAYERS[second_index]);
        this.SWAP_LAYERS({first_index, second_index});
      }
    });
    //

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

        this.updateGuidePoints();

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
