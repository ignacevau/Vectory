<template>
  <div class="width-input">
    <input v-model="input" type="text" class="input-width-text" ref="input" />
    <div class="value-steps">
      <div class="top" @click="increment">-</div>
      <div class="bottom" @click="decrement">-</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WidthInput2',
  props: [
    'parentWidth',
    'startValue'
  ],
  data: function() {
    return {
      input: ''
    }
  },
  watch: {
    input: function(_new, _old) {
      if(this.checkNumber(_new)) {
        this.$emit('value-change', _new);
      }
      else if(_new != '' && _new != '?') {
        this.input = _old;
      }
    },
    parentWidth: function(_new, _old) {
      if(_new == 'none') {
        this.input = '?';
      }
      else if(_new == 'empty') {
        this.input = '';
      }
      else {
        this.input = _new;
      }
    }
  },
  methods: {
    checkNumber: function(n) {
      return !isNaN(parseInt(n)) && Number(n);
    },
    increment: function() {
      if(this.checkNumber(this.input)) {
        this.input++;
      }
    },
    decrement: function() {
      if(this.checkNumber(this.input) && this.input != 1) {
        this.input--;
      }
    }
  },
  mounted: function() {
    // Set the input value to a starting value if specified
    if (this.checkNumber(this.startValue)) {
      this.input = this.startValue;
    }

    // Remove focus when clicked outside
    const input = this.$refs["input"]

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
<style scoped lang="scss">
@import '@/library.scss';

.width-input {
  display: flex;
  margin-left: 5px;
  width: 51.8px;
  height: 18px;

  input {
    width: 70%;
    height: 100%;
    border-width: 0px;
    color: white;
    font-family: Montserrat;
    font-size: 13px;
    background-color: rgb(139, 139, 139);
    text-align: center;
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
  }

  .value-steps {
    width: 30%;
    height: 100%;
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;

    div {
      font-size: 12px;
      line-height: 0.8em;
      height: 50%;
      width: 100%;
      color: white;
      text-align: center;
      background-color: $DarkGray;
      cursor: pointer;

      &:hover {
        background-color: rgb(94, 94, 94);
      }
    }

    .top {
      border-top-right-radius: 3px;
    }
    .bottom {
      border-bottom-right-radius: 3px;
    }
  }
}

</style>