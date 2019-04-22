<template>
  <tool imgSource="tool-line.png" @isActive="setActive" />  
</template>





<script>
import paper from 'paper'
import Tool from '../Tool.vue'
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'ToolLine',
  computed: {
    ...mapState([
      'ACTIVE',
      'TOOLLINE'
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
      this.SET_ACTIVE("line")

      this.TOOLLINE.activate();
    }
  }
}
</script>





<style scoped>
</style>