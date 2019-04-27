<template>
  <footer class="footer-bar" />
</template>

<script>
export default {
  name: 'FooterBar'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.footer-bar {
  width: 100%;
  height: 30px;
  background-color: rgb(77, 77, 77);
  border-top: 2px solid rgb(39, 39, 39);
  z-index: 1;
  pointer-events: all;
}
</style>
