<template>
  <div>
    <div class="title">
      <img class="img-stroke" src="@/assets/fill.png" />
      <div>FILL</div>
    </div>

    <div v-bind:class="{ 'large-grid': showText, 'small-grid': !showText, 'grid-container': true }">
      <div class="pr-left"></div>
      <div v-if="showText" class="pr-middle">Color</div>
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
      this.fillColor = value;
      this.SELECTION_SET_FILLCOLOR(value);
    },
    getFillColorUpdated: function(_new) {
      if(!_new[0]["fillColor"]._canvasStyle) {
        return 'transparent';
      }
      else {
        var sw = _new[0]["fillColor"]._canvasStyle;

        for(var i=0; i<_new.length; i++) {
          if(!_new[i]["fillColor"]._canvasStyle || _new[i]["fillColor"]._canvasStyle != sw)
            return 'none';
        }
      }

      return _new[0]["fillColor"]._canvasStyle;
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
        this.fillColor = 'transparent';
      }
      else {
        this.fillColor = this.getFillColorUpdated(_new);
      }
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
.grid-container div:first-child {
  height: 20px;
}
</style>