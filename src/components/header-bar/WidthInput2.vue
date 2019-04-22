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
export default {
  name: 'WidthInput2',
  props: [
    'parentWidth'
  ],
  data: function() {
    return {
      input: 1,
      old: 1
    }
  },
  watch: {
    input: function(_new, _old) {
      if(this.checkNumber(_new)) {
        this.$emit('value-change', _new)
        this.old = _old
      }
    },
    parentWidth: function(_new, _old) {
      this.input = _new
    }
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

      if(!this.checkNumber(this.input)) {
        this.input = this.old
        this.$emit('value-change', this.input)
      }
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
  font-size: 1.3em;
  align-items: center;
}
input {
  width: 40px;
  height: 18px;
  background-color: rgb(94, 94, 94);
  border: 0px solid black;
  color: rgb(255, 255, 255);
  font-family: Comfortaa;
  background-color: rgb(112, 112, 112);
  text-align: center;
  border-radius: 3px;
}
</style>