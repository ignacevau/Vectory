<template>
  <tool imgSource="tool-pointer.png" @isActive="setActive" />  
</template>





<script>
import paper from 'paper'
import Tool from '../Tool.vue'
import { mapMutations, mapState } from 'vuex'
import { bus } from '@/main.js'

export default {
  name: 'ToolPointer',
  data: function() {
    return {
      selected: null
    }
  },
  computed: {
    ...mapState([
      'TOOLPOINTER',
      'SELECTED'
    ])
  },
  components: {
    Tool
  },
  methods: {
    ...mapMutations([
      'SET_ACTIVE',
      'DESELECT'
    ]),
    setActive: function() {
      this.SET_ACTIVE("pointer")

      this.TOOLPOINTER.activate();
      if(this.SELECTED.length > 0) {
        this.selected = this.SELECTED[this.SELECTED.length-1]

        this.DESELECT()
        this.selected.selected = true
      }
    }
  },
  mounted: function() {
    var handles = []
    var handle = null
    var segment;
    var draggingHandle = false;
    var draggingSegment = false;
    var handleHitTolerance = 7

    var hitOptions = {
      segments: true,
      tolerance: 7
    };

    bus.$on("deactivate-pointer", () => {
      if(this.selected) {
        this.selected.selected = false
      }
    })

    var checkHandleHit = (_handles, mousepos) => {
      for(var i=0; i<_handles.length; i++) {
        var handleX = _handles[i].x + segment.point.x
        var handleY = _handles[i].y + segment.point.y
        if(compare(handleX, mousepos.x, handleHitTolerance) && compare(handleY, mousepos.y, handleHitTolerance)) {
          handle = _handles[i]
          break
        }
      }
    }

    var compare = (v1, v2, treshold) => {
      if(Math.abs(v2-v1) < treshold) {
        return true
      }
      return false
    }

    this.TOOLPOINTER.onMouseDown = (e) => {
      handle = null

      checkHandleHit(handles, e.point)

      if(segment && !handle) {
        segment.selected = false
      }

      if(e.item) {
        if(e.item.className == 'Path' && e.item.selected) {
          var path = e.item
          var hitResult = path.hitTest(e.point, hitOptions);

          if(hitResult) {
            if(hitResult.type == 'segment') {
              draggingSegment = true
              segment = hitResult.segment
              hitResult.segment.selected = true

              handles = [segment.handleIn, segment.handleOut]
            }
          }
        }
      }
    }

    this.TOOLPOINTER.onMouseDrag = (e) => {
      if(draggingSegment) {
        if(segment) {
          segment.point.x += e.delta.x
          segment.point.y += e.delta.y
        }
      }
      else if(handle) {
        handle.x += e.delta.x
        handle.y += e.delta.y
      }
    }

    this.TOOLPOINTER.onMouseUp = (e) => {
      handle = null
      draggingHandle = false
      draggingSegment = false
    }
  }
}
</script>





<style scoped>
</style>