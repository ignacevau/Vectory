import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    ACTIVE: '',

    TOOLSELECT: null,
    TOOLPOINTER: null,
    TOOLPEN: null,
    TOOLCIRCLE: null,

    OBJECTS: [],
    SELECTED: []
  },
  mutations: {
    // --- Tools ---
    SET_ACTIVE: function(state, type) {
      state.ACTIVE = type;
    },

    SET_TOOLSELECT: (state, tool) => {
      state.TOOLSELECT = tool;
    },
    SET_TOOLPOINTER: (state, tool) => {
      state.TOOLPOINTER = tool;
    },
    SET_TOOLPEN: (state, tool) => {
      state.TOOLPEN = tool;
    },
    SET_TOOLCIRCLE: (state, tool) => {
      state.TOOLCIRCLE = tool;
    },

    // --- Shapes ---
    ADD_SHAPE: (state, shape) => {
      state.OBJECTS.push(shape);
    },

    // --- Selection ---
    ADD_SELECT: (state, shape) => {
      state.SELECTED.push(shape);
    },
    CLEAR_SELECT: (state) => {
      state.SELECTED = [];
    },
    DELETE_SELECT: (state) => {
      // Count from end to begin to allow pop()
      for(var i=state.SELECTED.length-1; i>=0; i--) {
        // Destroy the shape (it's still in the objects and the selection array)
        state.SELECTED[i].remove();

        // Find the shape in the objects array
        var index = state.OBJECTS.findIndex(x => x === state.SELECTED[i]);
        // Remove it
        state.OBJECTS.splice(index, 1);

        // Remove the shape from the selection array
        state.SELECTED.pop();

      }
    }
  },
  getters: {
    clamp: (state) => (value, min, max) => {
      if(value < min){
        return min;
      }else if(value > max){
          return max;
      }
      return value;
    }
  }
})
