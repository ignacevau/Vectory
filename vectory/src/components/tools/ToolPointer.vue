<template>
  <tool imgSource="tool-pointer.png" @isActive="setActive" />  
</template>





<script>
import paper from 'paper'
import Tool from '../Tool.vue'
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'ToolPointer',
  computed: {
    ...mapState([
      'ACTIVE',
      'TOOLPOINTER'
    ])
  },
  components: {
    Tool
  },
  methods: {
    ...mapMutations([
      'SET_ACTIVE',
      'ADD_SHAPE'
    ]),
    setActive: function() {
      this.SET_ACTIVE("pointer")

      this.TOOLPOINTER.activate();
    }
  },
  mounted: function() {
    var self = this;
  }
}
</script>





<style scoped>
</style>