<template>
  <header class="header-bar" />
</template>

<script>
export default {
  name: 'HeaderBar'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.header-bar {
  padding: 10px;
  align-content: flex-start;
  flex: 0 1 auto;
  height: 5vh;
  width: 100%;
  background-color: rgb(94, 94, 94);
  border-bottom: 2px solid rgb(77, 77, 77);
  z-index: 1;
}
</style>
