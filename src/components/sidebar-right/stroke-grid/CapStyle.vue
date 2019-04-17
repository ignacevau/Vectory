<template>
  <div class="cap-style">
    <div class="cap" @click="showWindow">
      <img src="@/assets/cap_none.png" v-if="type == 'none' ? true : false" />
      <img src="@/assets/cap_butt.png" v-if="type == 'butt' ? true : false" />
      <img src="@/assets/cap_round.png" v-if="type == 'round' ? true : false" />
      <img src="@/assets/cap_square.png" v-if="type == 'square' ? true : false" />
    </div>
    <div ref="window" class="select" v-bind:style="{ 'display': active }" >
      <img src="@/assets/cap_butt.png" @click="changeType('butt')" />
      <img src="@/assets/cap_round.png" @click="changeType('round')" />
      <img src="@/assets/cap_square.png" @click="changeType('square')" />
    </div>
  </div>
</template>

<script>
import { bus } from '@/main.js'
import { mapState } from 'vuex'

export default {
  name: 'CapStyle',
  data: function() {
    return {
      window: false,
      type: 'none'
    }
  },
  methods: {
    hideWindow: function() {
      this.window = false
    },
    showWindow: function() {
      this.window = true
    },
    changeType: function(type) {
      this.type = type
      bus.$emit('set-cap', type)
      this.hideWindow()
    }
  },
  watch: {
    SELECTED: function(_new, _old) {
      if(_new.length == 0) {
        this.type = 'none'
        return
      }
      else {
        var sw = _new[0]["strokeCap"]

        for(var i=0; i<_new.length; i++) {
          if(_new[i]["strokeCap"] != sw) {
            this.type = 'none'
            return
          }
        }
      }

      this.type = _new[0]["strokeCap"]
    }
  },
  computed: {
    ...mapState([
      'SELECTED'
    ]),
    active: function() {
      if(this.window)
        return ''
      return 'none'
    }
  },
  mounted: function() {
    var wd = this.$refs["window"];
    
    document.addEventListener('mousedown', (e) => {
      if(window && !wd.contains(e.target)) {
        this.hideWindow();
      }
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.cap-style {
  display: flex;
  justify-content: center;
}
.cap {
  height: 25px;
  width: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 3px;
}
.cap:hover {
  background-color: rgb(124, 124, 124);
}
.cap img {
  height: 20px;
  width: 22px;
}
.select {
  width: 90px;
  height: 25px;
  background-color: rgb(94, 94, 94);
  position: absolute;
  margin-left: -30px;
  border-radius: 5px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  box-shadow: 0px 0px 10px 5px rgba(0, 0, 0, 0.233);
  border: 2px solid rgb(106, 162, 247);
}
.select img {
  width: 22px;
  height: 20px;
}
.select img:hover {
  border: 2px solid rgb(94, 94, 94);
}
</style>