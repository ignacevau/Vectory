import Vue from 'vue'
import Vuex from 'vuex'
import { bus, Layer, ShapeGroup } from '@/main.js'
import { project } from 'paper';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    ACTIVE_TOOL: 'select',

    LAYER_WINDOW_ACTIVE: false,

    TOOLSELECT: null,
    TOOLPOINTER: null,
    TOOLPEN: null,
    TOOLCIRCLE: null,
    TOOLRECTANGLE: null,
    TOOLSHAPEBUILDER: null,
    TOOLLINE: null,

    OBJECTS: [],
    SELECTED: [],

    ACTIONS: [],

    // Window toggles
    COLORPICKER_ACTIVE: false,
    FILEDROPDOWN_ACTIVE: false,


    // Tools settings
    PEN_WIDTH: 1,
    PEN_OPACITY: 1,
    PEN_STROKECOLOR: 'black',
    PEN_FILLCOLOR: 'transparent',

    CIRCLE_WIDTH: 1,
    CIRCLE_OPACITY: 1,
    CIRCLE_STROKECOLOR: 'black',
    CIRCLE_FILLCOLOR: 'transparent',

    RECTANGLE_WIDTH: 1,
    RECTANGLE_OPACITY: 1,
    RECTANGLE_STROKECOLOR: 'black',
    RECTANGLE_FILLCOLOR: 'transparent',

    LINE_WIDTH: 1,
    LINE_OPACITY: 1,
    LINE_STROKECOLOR: 'black',

    // General
    LAYERS: [],
    SELECTED_LAYER_INDEX: 1
  },
  mutations: {
    // --- Tools ---
    SET_ACTIVE: function(state, type) {
      var old = state.ACTIVE_TOOL
      state.ACTIVE_TOOL = type;

      if(old == "select" && type != "select") {
        bus.$emit("deactivate-select");
      }
      if(old == "pointer" && type != "pointer") {
        bus.$emit("deactivate-pointer")
      }
    },

    SET_LAYER_WINDOW_ACTIVE: function(state, value) {
      state.LAYER_WINDOW_ACTIVE = value;
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
    SET_TOOLRECTANGLE: (state, tool) => {
      state.TOOLRECTANGLE = tool;
    },
    SET_TOOLSHAPEBUILDER: (state, tool) => {
      state.TOOLSHAPEBUILDER = tool
    },
    SET_TOOLLINE: (state, tool) => {
      state.TOOLLINE = tool
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
    DELETE_SHAPES: (state, shapes=state.SELECTED) => {
      // Count from end to begin to allow pop()
      for(var i=shapes.length-1; i>=0; i--) {
        // Destroy the shape (it's still in the objects and the selection array)
        shapes[i].remove();

        // Find the shape in the objects array
        var index = state.OBJECTS.findIndex(x => x === shapes[i]);
        // Remove it
        state.OBJECTS.splice(index, 1);

        // Remove the shape from the selection array
        shapes.pop();
      }
    },
    DISCARD_SHAPES(state, shapes=[...state.SELECTED]) {
      // Count from end to begin to allow pop()
      for(var i=shapes.length-1; i>=0; i--) {
        // Find the shape in the objects array
        var index = state.OBJECTS.findIndex(x => x === shapes[i]);
        // Remove it
        state.OBJECTS.splice(index, 1);

        // Remove the shape from the selection array
        shapes.pop();
      }
    },

    SELECTION_SET_STROKECOLOR(state, value) {
      bus.$emit('set_color_stroke', value);
    },
    SELECTION_SET_STROKEWIDTH(state, value) {
      bus.$emit('set_width_stroke', value);
    },
    SELECTION_SET_STROKECAP(state, value) {
      bus.$emit('set_cap_stroke', value);
    },
    SELECTION_SET_FILLCOLOR(state, value) {
      bus.$emit('set_color_fill', value);
    },
    SELECTION_SET_OPACITY(state, value) {
      bus.$emit('set_opacity', value);
    },

    PEN_SET_WIDTH(state, value) {
      state.PEN_WIDTH = value
    },
    PEN_SET_OPACITY(state, value) {
      state.PEN_OPACITY = value
    },
    PEN_SET_STROKECOLOR(state, value) {
      state.PEN_STROKECOLOR = value
    },
    PEN_SET_FILLCOLOR(state, value) {
      state.PEN_FILLCOLOR = value
    },

    CIRCLE_SET_WIDTH(state, value) {
      state.CIRCLE_WIDTH = value
    },
    CIRCLE_SET_OPACITY(state, value) {
      state.CIRCLE_OPACITY = value
    },
    CIRCLE_SET_STROKECOLOR(state, value) {
      state.CIRCLE_STROKECOLOR = value
    },
    CIRCLE_SET_FILLCOLOR(state, value) {
      state.CIRCLE_FILLCOLOR = value
    },

    RECTANGLE_SET_WIDTH(state, value) {
      state.RECTANGLE_WIDTH = value
    },
    RECTANGLE_SET_OPACITY(state, value) {
      state.RECTANGLE_OPACITY = value
    },
    RECTANGLE_SET_STROKECOLOR(state, value) {
      state.RECTANGLE_STROKECOLOR = value
    },
    RECTANGLE_SET_FILLCOLOR(state, value) {
      state.RECTANGLE_FILLCOLOR = value
    },

    LINE_SET_WIDTH(state, value) {
      state.LINE_WIDTH = value
    },
    LINE_SET_OPACITY(state, value) {
      state.LINE_OPACITY = value
    },
    LINE_SET_STROKECOLOR(state, value) {
      state.LINE_STROKECOLOR = value
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

          if(action.data.shift) {
            if(action.data.lockY) {
              relH = relW;
            }
            else if(action.data.lockX) {
              relW = relH;
            }
          }

          for(var i=0; i<action.data.paths.length; i++) {
            action.data.paths[i].scale(relW, relH, pivot);
          }

          state.SELECTED = action.data.paths;
          break;
      }
    },


    // Toggle windows
    HIDE_COLORPICKER(state) {
      state.COLORPICKER_ACTIVE = false
    },
    SHOW_COLORPICKER(state) {
      state.COLORPICKER_ACTIVE = true
    },
    TRIGGER_FILEDROPDOWN(state) {
      state.FILEDROPDOWN_ACTIVE = !state.FILEDROPDOWN_ACTIVE;
    },

    //Layers
    ADD_LAYER(state) {
      bus.$emit('add-layer');
    },
    INSERT_LAYER(state, layer) {
      state.LAYERS.push(layer);
      state.SELECTED_LAYER_INDEX = layer.number;
    },
    SELECT_LAYER(state, number) {
      bus.$emit('update-active-layer', number);
    },
    REMOVE_LAYER(state) {
      if(state.SELECTED_LAYER_INDEX != 0) {
        bus.$emit('hide-transformbox');
        bus.$emit('remove-layer');
      }
    },
    SET_SELECTED_LAYER_INDEX(state, value) {
      state.SELECTED_LAYER_INDEX = value;
    }
  },
  getters: {
    clamp: () => (value, min, max) => {
      if(value < min){
        return min;
      } else if(value > max){
        return max;
      }
      return value;
    }
  }
})
