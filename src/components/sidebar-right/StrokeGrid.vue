<template>
  <div>
    <div class="title">
      <img class="img-stroke" src="@/assets/stroke.png" />
      <div>STROKE</div>
    </div>

    <div v-bind:class="{ 'large-grid': showText, 'small-grid': !showText, 'grid-container': true }">
      <div class="pr-left"></div>
      <div v-if="showText" class="pr-middle">COLOR</div>
      <div class="pr-right">
        <color-trigger v-bind:parentColor="strokeColor" @value-change="colorChange" />
      </div>

      <div class="border"></div>
      <div class="border" v-if="showText"></div>
      <div class="border"></div>

      <div class="pr-left"></div>
      <div v-if="showText" class="pr-middle">WIDTH</div>
      <div class="pr-right">
        <width-input />
      </div>

      <div class="border"></div>
      <div class="border" v-if="showText"></div>
      <div class="border"></div>

      <div class="pr-left"></div>
      <div v-if="showText" class="pr-middle">TYPE</div>
      <div class="pr-right">
        <cap-style />
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import ColorTrigger from '@/components/sidebar-right/stroke-grid/ColorTrigger.vue'
import WidthInput from '@/components/sidebar-right/stroke-grid/WidthInput.vue'
import CapStyle from '@/components/sidebar-right/stroke-grid/CapStyle.vue'

export default {
  name: 'StrokeGrid',
  components: {
    ColorTrigger,
    WidthInput,
    CapStyle
  },
  props: [
    'showText'
  ],
  data: function() {
    return {
      strokeColor: 'transparent'
    }
  },
  computed: {
    ...mapState([
      'SELECTED'
    ])
  },
  methods: {
    ...mapMutations([
      'SELECTION_SET_STROKECOLOR'
    ]),
    colorChange: function(value) {
      this.strokeColor = value
      this.SELECTION_SET_STROKECOLOR(value)
    }
  },
  watch: {
    SELECTED: function(_new, _old) {
      if(_new.length == 0) {
        this.strokeColor = 'rgb(94, 94, 94)'
        // this.oldColor = this.color
        return
      }
      else if(!_new[0]["strokeColor"]) {
        this.strokeColor = 'rgb(94, 94, 94)'
        // this.oldColor = this.color
        return
      }
      else {
        var sw = _new[0]["strokeColor"]._canvasStyle

        for(var i=0; i<_new.length; i++) {
          if(!_new[i]["strokeColor"]._canvasStyle || _new[i]["strokeColor"]._canvasStyle != sw) {
            this.strokeColor = 'none'
            // this.oldColor = this.color
            return
          }
        }
      }

      this.strokeColor = _new[0]["strokeColor"]._canvasStyle
      // this.oldColor = this.color
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.title {
  margin-top: 10px;
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
  height: 11vh;
  display: grid;
  grid-template-columns: 0.1fr 1fr 1fr;
  grid-template-rows: 1fr 0.1fr 1fr 0.1fr 1fr;
  grid-template-areas: ". . ." ". . ." ". . .";
}
.small-grid {
  margin-top: 10px;
  height: 11vh;
  display: grid;
  grid-template-columns: 0.1fr 1fr;
  grid-template-rows: 1fr 0.1fr 1fr 0.1fr 1fr;
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
.grid-container .pr-right {
  display: flex;
  align-items: center;
  justify-content: center;
}
.border {
  height: 0.05em;
  background-color: rgb(116, 116, 116);
}
</style>