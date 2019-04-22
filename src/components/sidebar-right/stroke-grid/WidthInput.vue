<template>
  <div class="width-input">
    <input v-model="input" type="text" class="input-width-text" ref="input" />
    <div>
      <span style="line-height: 15px;"><b>⌃</b></span>
      <span style="line-height: 5px;"><b>⌄</b></span>
    </div>
  </div>
</template>

<script>
import { bus } from '@/main.js'
import { mapState } from 'vuex'

export default {
  name: 'WidthInput',
  data: function() {
    return {
      input: ''
    }
  },
  watch: {
    input: function(_new, _old) {
      if(_new == "0") {
        bus.$emit('set_width', 0)
      }
      else if(this.checkNumber(_new)) {
        bus.$emit('set_width', _new)
      }
    },
    SELECTED: function(_new, _old) {
      if(_new.length == 0) {
        this.input = ''
        return
      }
      else {
        var sw = _new[0].strokeWidth

        for(var i=0; i<_new.length; i++) {
          if(_new[i].strokeWidth != sw) {
            this.input = '?'
            return
          }
        }
      }

      this.input = _new[0].strokeWidth
    }
  },
  computed: {
    ...mapState([
      'SELECTED'
    ])
  },
  methods: {
    checkNumber: function(n) {
      return Number(n)
    }
  },
  mounted: function() {
    var input = this.$refs["input"]

    document.addEventListener('click', (e) => {
      if(!input.contains(e.target)) {
        resetFocus();
      }
    })

    let resetFocus = () => {
      input.blur()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
span {
  width: 10px;
  height: 10px;
  text-align: center;
  font-size: 0.7em;
  color: rgb(106, 162, 247);
}
span:hover {
  cursor: pointer;
}
.width-input {
  display: flex;
  margin-left: 8px;
}
.width-input div {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
input {
  width: 27px;
  height: 18px;
  background-color: rgb(94, 94, 94);
  border: 0px solid black;
  border-bottom: 2px solid rgb(106, 162, 247);
  color: rgb(255, 255, 255);
  font-family: Comfortaa;
  text-align: center;
}
input:hover {
  background-color: rgb(112, 112, 112);
}
</style>