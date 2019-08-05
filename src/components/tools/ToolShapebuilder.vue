<template>
  <tool imgSource="tool-shapebuilder.png" @isActive="setActive" />  
</template>





<script>
import paper from 'paper'
import Tool from '../Tool.vue'
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'ToolShapebuilder',
  computed: {
    ...mapState([
      'TOOLSHAPEBUILDER'
    ])
  },
  components: {
    Tool
  },
  methods: {
    ...mapMutations([
      'SET_ACTIVE',
      'ADD_SELECT',
      'CLEAR_SELECT'
    ]),
    setActive: function() {
      this.SET_ACTIVE("shapebuilder")

      this.TOOLSHAPEBUILDER.activate();
    }
  }
}
</script>





<style scoped>
</style>