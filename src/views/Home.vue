<template>
  <div class="home">
    <HelloWorld />
  </div>
</template>

<script>
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'home',
  components: {
    HelloWorld
  },
  methods: {
    test: function() {
      alert("test")
    }
  }
}
</script>

<style>
* {
  box-sizing: border-box;
}
body {
  margin: 0;
}
</style>

