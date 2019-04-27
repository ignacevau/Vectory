<template>
  <div>
    <div class="title">
      <img class="img-stroke" src="@/assets/fill.png" />
      <div>FILL</div>
    </div>

    <div v-bind:class="{ 'large-grid': showText, 'small-grid': !showText, 'grid-container': true }">
      <div class="pr-left"></div>
      <div v-if="showText" class="pr-middle">COLOR</div>
      <div class="pr-right">
        <color-trigger v-bind:parentColor="fillColor" @value-change="colorChange" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import ColorTrigger from '@/components/sidebar-right/stroke-grid/ColorTrigger.vue'

export default {
  name: 'StrokeGrid',
  components: {
    ColorTrigger
  },
  props: [
    'showText'
  ],
  data: function() {
    return {
      fillColor: 'transparent'
    }
  },
  computed: {
    ...mapState([
      'SELECTED'
    ])
  },
  methods: {
    ...mapMutations([
      'SELECTION_SET_FILLCOLOR'
    ]),
    colorChange: function(value) {
      this.fillColor = value
      this.SELECTION_SET_FILLCOLOR(value)
    }
  },
  watch: {
    SELECTED: function(_new, _old) {
      if(_new.length == 0) {
        this.fillColor = 'rgb(94, 94, 94)'
        // this.oldColor = this.color
        return
      }
      else if(!_new[0]["fillColor"]) {
        this.fillColor = 'rgb(94, 94, 94)'
        // this.oldColor = this.color
        return
      }
      else {
        var sw = _new[0]["fillColor"]._canvasStyle

        for(var i=0; i<_new.length; i++) {
          if(!_new[i]["fillColor"] || _new[i]["fillColor"]._canvasStyle != sw) {
            this.fillColor = 'none'
            // this.oldColor = this.color
            return
          }
        }
      }

      this.fillColor = _new[0]["fillColor"]._canvasStyle
      // this.oldColor = this.color
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.title {
  margin-left: 5px;
  display: flex;
  justify-content: flex-start;
}
.title div {
  color: rgb(123, 175, 253); 
  border-bottom: 1px solid rgb(123, 175, 253);
  width: 100%;
  margin-left: 10px;
  font-size: 0.8em;
}

.large-grid {
  margin-top: 10px;
  height: 4vh;
  display: grid;
  grid-template-columns: 0.1fr 1fr 1fr;
  grid-template-rows: 0.5fr 1fr 1fr 1fr;
  grid-template-areas: ". . ." ". . ." ". . .";
}
.small-grid {
  margin-top: 10px;
  height: 4vh;
  display: grid;
  grid-template-columns: 0.1fr 1fr;
  grid-template-rows: 0.5fr 1fr 1fr 1fr;
  grid-template-areas: ". ." ". ." ". .";
}
.img-stroke {
  width: 25px;
  height: 18px;
}
.grid-container > div {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}
.grid-container .pr-left {
  width: 30px;
}
.grid-container .pr-middle {
  justify-content: flex-end;
  font-size: 0.7em;
}
.grid-container div:first-child {
  height: 20px;
}
</style>