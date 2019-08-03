<template>
  <div class="width-input">
    <input v-model="input" type="text" class="input-width-text" ref="input" />
    <div class="value-steps">
      <div class="top">-</div>
      <div class="bottom">-</div>
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