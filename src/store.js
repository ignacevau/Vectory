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
    SELECTED: [],

    ACTIONS: []
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
    },

    // Add an action to the undo list
    ADD_ACTION(state, action) {
      state.ACTIONS.push(action);
    },
    UNDO(state) {
      if(state.ACTIONS.length <= 0) {
        return;
      }
      var action = state.ACTIONS.pop();
      
      switch(action.type) {
        case 'move':
          var delta = action.data.startPos.subtract(action.data.endPos);

          for(var i=0; i<action.data.paths.length; i++) {
            action.data.paths[i].translate(delta);
          }

          state.SELECTED = action.data.paths;
          break;

        case 'scale':
          var pivot = action.data.pivot;
          var init = action.data.handle_init;
          var end = action.data.handle_end;

          var relH = 1;
          var relW = 1;

          if(!action.data.lockY) {
            relH = init.subtract(pivot).y / end.subtract(pivot).y;
          }
          if (!action.data.lockX) {
            relW = init.subtract(pivot).x / end.subtract(pivot).x;
          }

          for(var i=0; i<action.data.paths.length; i++) {
            action.data.paths[i].scale(relW, relH, pivot);
          }

          state.SELECTED = action.data.paths;
          break;
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
