<template>
  <div>
    <div class="title">
      <img class="img-stroke" src="@/assets/stroke.png" />
      <div>STROKE</div>
    </div>

    <div v-bind:class="{ 'large-grid': showText, 'small-grid': !showText, 'grid-container': true }">
      <div class="pr-left"></div>
      <div v-if="showText" class="pr-middle">Color</div>
      <div class="pr-right">
        <color-trigger v-bind:parentColor="strokeColor" @value-change="colorChange" />
      </div>

      <div class="border"></div>
      <div class="border" v-if="showText"></div>
      <div class="border"></div>

      <div class="pr-left"></div>
      <div v-if="showText" class="pr-middle">Width</div>
      <div class="pr-right">
        <width-input2 v-bind:parentWidth="strokeWidth"  @value-change="widthChange" />
      </div>

      <div class="border"></div>
      <div class="border" v-if="showText"></div>
      <div class="border"></div>

      <div class="pr-left"></div>
      <div v-if="showText" class="pr-middle">Type</div>
      <div class="pr-right">
        <cap-style v-bind:parentCap="capStyle" @value-change="capChange" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState, mapGetters } from 'vuex'
import ColorTrigger from '@/components/sidebar-right/stroke-grid/ColorTrigger.vue'
import WidthInput from '@/components/sidebar-right/stroke-grid/WidthInput.vue'
import WidthInput2 from '@/components/header-bar/WidthInput2.vue'
import CapStyle from '@/components/sidebar-right/stroke-grid/CapStyle.vue'

export default {
  name: 'StrokeGrid',
  components: {
    ColorTrigger,
    WidthInput,
    WidthInput2,
    CapStyle
  },
  props: [
    'showText'
  ],
  data: function() {
    return {
      strokeColor: 'transparent',
      strokeWidth: '',
      capStyle: 'none'
    }
  },
  computed: {
    ...mapState([
      'SELECTED'
    ])
  },
  methods: {
    ...mapMutations([
      'SELECTION_SET_STROKECOLOR',
      'SELECTION_SET_STROKEWIDTH',
      'SELECTION_SET_STROKECAP'
    ]),
    colorChange: function(value) {
      this.strokeColor = value;
      this.SELECTION_SET_STROKECOLOR(value);
    },
    widthChange: function(value) {
      this.strokeWidth = value;
      this.SELECTION_SET_STROKEWIDTH(value);
    },
    capChange: function(value) {
      this.capStyle = value;
      this.SELECTION_SET_STROKECAP(value);
    },
    getStrokeWidthUpdated: function(_new) {
      if(!_new[0]["strokeWidth"]) {
        return 'empty';
      }
      else {
        let sw = _new[0]["strokeWidth"];

        for(let i=0; i<_new.length; i++) {
          if(!_new[i]["strokeWidth"] || _new[i]["strokeWidth"] != sw)
            return 'none';
        }
      }

      return _new[0]["strokeWidth"];
    },
    getStrokeColorUpdated: function(_new) {
      if(!_new[0]["strokeColor"]) {
        return 'transparent';
      }
      else {
        var sw = _new[0]["strokeColor"]._canvasStyle;

        for(var i=0; i<_new.length; i++) {
          if(!_new[i]["strokeColor"]._canvasStyle || _new[i]["strokeColor"]._canvasStyle != sw)
            return 'none';
        }
      }

      return _new[0]["strokeColor"]._canvasStyle;
    },
    getCapStyleUpdated: function(_new) {
      if(!_new[0]["strokeCap"]) {
        return 'empty';
      }
      else {
        let sw = _new[0]["strokeCap"];

        for(let i=0; i<_new.length; i++) {
          if(!_new[i]["strokeCap"] || _new[i]["strokeCap"] != sw)
            return 'empty';
        }
      }

      return _new[0]["strokeCap"];
    },
    ungroup: function(items) {
      if(items.length == 0) {
        return [];
      }

      let result = [];

      for(let i=0; i<items.length; i++) {
        let item = items[i];

        if(item.type == "shape")
          result.push(item)
        else if(item.type == "group") {
          for(let j=0; j<item.children.length; j++) {
            result.push(...this.ungroup([item.children[j]]));
          }
        }

        // Error catching - prevent infinite loop
        else {
          console.error("Unknown item type!");
          return null;
        }
      }

      return result;
    }
  },
  watch: {
    SELECTED: function(_newSelection) {
      let _new = this.ungroup(_newSelection);

      if(_new.length == 0) {
        this.strokeColor = 'transparent';
        this.strokeWidth = 'empty';
        this.capStyle = 'empty';
      }
      else {
        this.strokeColor = this.getStrokeColorUpdated(_new);
        this.strokeWidth = this.getStrokeWidthUpdated(_new);
        this.capStyle = this.getCapStyleUpdated(_new);
      }
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
  max-height: 0.8em;
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
  font-size: 0.9em;
  font-family: Montserrat;
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