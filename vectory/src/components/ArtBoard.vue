<template>
  <div class="art-board">
    <canvas id="canvas" class="canvas" resize></canvas>
  </div>
</template>

<script>
import paper from 'paper'
import { mapMutations } from 'vuex'
import { bus } from '@/main.js'

export default {
  name: 'ArtBoard',
  methods: {
    ...mapMutations([
      'SET_TOOLSELECT',
      'SET_TOOLPOINTER',
      'SET_TOOLPEN',
      'SET_TOOLCIRCLE',
      'DELETE_SELECT'
    ])
  },
  mounted: function() {
    // Setting up PaperJS and settings
    Number.prototype.clamp = function(min, max) {
      return Math.min(Math.max(this, min), max);
    };

    paper.install(window);
    paper.setup('canvas');

    settings.handleSize = 6;
    // Value is not static (updated with zoom)
    settings.hitTolerance = 7;

    var self = this;

    var toolSelect = new Tool();
    var toolPointer = new Tool();
    var toolPen = new Tool();
    var toolCircle = new Tool();

    self.SET_TOOLSELECT(toolSelect);
    self.SET_TOOLPOINTER(toolPointer);
    self.SET_TOOLPEN(toolPen);
    self.SET_TOOLCIRCLE(toolCircle);

    var view = paper.view;
    var offset = 0
    var canvas = document.querySelector('#canvas');





    // --- Zoom ---

    // Firefox
    canvas.onwheel = function(e) {
      bus.$emit('zoom');
      e.preventDefault();

      var mousePos = new Point(e.clientX, e.clientY);
      updateZoom(e.deltaY, mousePos);
    }

    function updateZoom(delta, mousePos) {
        var mouseViewPos = view.viewToProject(mousePos);
        [view.zoom, offset] = changeZoomStable(view.zoom, delta, view.center, mouseViewPos);
        view.center = view.center.add(offset);
        view.draw();

        // Pretty much hardcoded, this is to adjust the hitTolerance in respect to the zoom
        settings.hitTolerance = (7 / (view.zoom)).clamp(0, 17);
    }

    function getNewZoom(oldZoom, delta) {
        var factor = 1.05;

        if (delta > 0) {
            return oldZoom / factor;
        }
        else if (delta < 0) {
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





    // --- Key checks ---
    document.onkeydown = (e) => {
      if(e.code == 'Delete') {
        self.DELETE_SELECT();

        // Let other components know (ToolSelect -> transform box must disappear)
        bus.$emit('delete_selection');
      }
    };
  }
}
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
