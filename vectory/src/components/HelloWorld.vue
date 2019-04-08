<template>
  <div class="hello">
    <art-board />

    <header-bar />

    <div class="content">
      <sidebar-left />

      <div class="main" ref="main">
        <footer-bar />
      </div>

      <sidebar-right />
    </div>

  </div>
</template>

<script>
import ArtBoard from '@/components/ArtBoard.vue'
import SidebarLeft from '@/components/SidebarLeft.vue'
import SidebarRight from '@/components/SidebarRight.vue'
import HeaderBar from '@/components/HeaderBar.vue'
import FooterBar from '@/components/FooterBar.vue'

export default {
  name: 'HelloWorld',
  components: {
    SidebarLeft,
    SidebarRight,
    HeaderBar,
    FooterBar,
    ArtBoard
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hello {
  display: flex;
  min-height: 5vh;
  flex-direction: column;
  z-index: 1;
}
.main {
  background-color: rgba(224, 224, 224, 0);
  flex: 5;
  display: flex;
  flex-direction: column-reverse;
  z-index: 1;
  pointer-events: none;
}
.content {
    min-height: 95vh;
    display: flex;
    z-index: 1;
    pointer-events: none;
}
</style>
