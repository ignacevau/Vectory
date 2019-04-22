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
      'ACTIVE',
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
      'ADD_SHAPE',
      'CLEAR_SELECT'
    ]),
    setActive: function() {
      this.SET_ACTIVE("pointer")

      this.TOOLPOINTER.activate();
      if(this.SELECTED.length > 0) {
        this.selected = this.SELECTED[this.SELECTED.length-1]

        this.CLEAR_SELECT()
        this.selected.fullySelected = true
        this.selected.selected = true
      }
    }
  },
  mounted: function() {
    var handle;

    bus.$on("deactivate-pointer", () => {
      if(this.selected) {
        this.selected.fullySelected = false
      }
    })

    this.TOOLPOINTER.onMouseDown = (e) => {
      handle = null
      if(e.item) {
        if(e.item.className == 'Path' && e.item.fullySelected) {
          var path = e.item
          var hitResult = path.hitTest(e.point, { handles: true, tolerance: 10 });
          if(hitResult) {
            console.log('k')
            if(hitResult.type == 'handle-in') {
              handle = hitResult.segment.handleIn
            }
            else {
              handle = hitResult.segment.handleOut
            }
          }
        }
      }
    }

    this.TOOLPOINTER.onMouseDrag = (e) => {
      if(handle) {
        handle.x += e.delta.x
        handle.y += e.delta.y
      }
    }

    this.TOOLPOINTER.onMouseUp = (e) => {
      handle = null
    }
  }
}
</script>





<style scoped>
</style>