<template>
  <div class="pathfinder">
    <div class="row-container">
      <div v-bind:class="{ grouping:true, row: showText, column:!showText }">
        <div class="button" @click="createGroup">
          GROUP
        </div>
        <div class="button" @click="removeGroup">
          UNGROUP
        </div>
      </div>
    </div>

    <div class="grid-container">
      <div v-bind:class="{ grid: true, full: showText, collapsed: !showText }">
        <div class="desc" v-if="showText">UNITE</div>
        <div class="icon">
          <img src="@/assets/unite.png" alt="">
        </div>

        <div class="border" v-if="showText"></div>
        <div v-if="showText"></div>

        <div class="desc" v-if="showText">EXCLUDE</div>
        <div class="icon">
          <img src="@/assets/exclude.png" alt="">
        </div>

        <div class="border" v-if="showText"></div>
        <div v-if="showText"></div>

        <div class="desc" v-if="showText">INTERSECT</div>
        <div class="icon">
          <img src="@/assets/intersect.png" alt="">
        </div>

        <div class="border" v-if="showText"></div>
        <div v-if="showText"></div>

        <div class="desc" v-if="showText">SUBTRACT</div>
        <div class="icon">
          <img src="@/assets/subtract.png" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { ShapeGroup } from '@/main.js'

export default {
  name: 'PathfinderGrid',
  props: [
    'showText'
  ],
  computed: {
    ...mapState([
      'SELECTED',
      'OBJECTS'
    ])
  },
  methods: {
    ...mapMutations([
      'ADD_SHAPE',
      'DISCARD_SHAPES',
      'CLEAR_SELECT'
    ]),
    createGroup: function() {
      let _newGroup = new ShapeGroup(this.SELECTED);
      _newGroup.selected = false;
      this.DISCARD_SHAPES();
      this.ADD_SHAPE(_newGroup);
    },
    removeGroup: function() {
      for(let i=0; i<this.SELECTED.length; i++) {
        let item = this.SELECTED[i];
        if(item.type == "group") {
          this.CLEAR_SELECT();
          this.DISCARD_SHAPES([item]);
          for(let j=0; j<item.children.length; j++) {
            this.ADD_SHAPE(item.children[j]);
          }
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '@/library.scss';

.pathfinder {
  width: 100%;
  height: 100%;

  .row-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;

    .row {
      width: 85%;
      flex-direction: row;
      justify-content: space-between;
    }
  }

  .column {
    flex-direction: column;
    justify-content: center;

    > div:first-child {
      margin-bottom: 5px;
    }
  }
}
.grouping {
  display: flex;
  align-items: center;
  font-size: 0.7em;
  margin-top: 20px;
  margin-bottom: 5px;

  .button {
    background-color: $LightGray_Btn;
    color: black;
    border-radius: 3px;
    padding-top: 5px;
    padding-bottom: 5px;
    width: 6.5em;
    text-align: center;

    &:hover {
      background-color: rgb(106, 162, 247);
    }

    &:active {
      background-color: rgb(99, 145, 212);
    }
  }
}
.grid-container {
  display: flex;
  width: 100%;
  height: 9vh;
  justify-content: center;
  align-items: center;

  .full {
    display: grid;
    grid-template-columns: 1fr 0.3fr;
    grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
    row-gap: 6px;
    grid-template-areas: ". ." ". ." ". ." ". ." ". ." ". ." ". .";

    height: 3.8em;
    width: 8em;

    > .icon {
      width: 2.5em;
      height: 2.5em;
    }
  }

  .collapsed {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr 1fr 1fr;
    row-gap: 6px;
    grid-template-areas: "." "." "." ".";

    height: 5em;
    width: 3em;

    > .icon {
      width: 3em;
      height: 3em;
    }
  }
}
.grid {
  font-size: 0.7em;

  > div {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .desc {
    width: 70%;
  }

  > .icon {
    background-color: $LightGray_Btn;
    border-radius: 3px;

    img {
      max-height: 80%;
      max-width: 80%;
    }

    &:hover {
      background-color: rgb(106, 162, 247);
    }

    &:active {
      background-color: rgb(99, 145, 212);
    }
  }
}
.border {
  height: 0.8px;
  width: 70%;
  background-color: rgb(106, 162, 247);
}
</style>