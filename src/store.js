import Vue from 'vue';
import Vuex from 'vuex';
import { bus, Layer, ShapeGroup, Action } from '@/main.js';
import { project } from 'paper';
import Utils from '@/Utils.js';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    ACTIVE_TOOL: 'select',

    LAYER_WINDOW_ACTIVE: false,
    SCREEN_BORDER: null,

    TOOLSELECT: null,
    TOOLPOINTER: null,
    TOOLPEN: null,
    TOOLCIRCLE: null,
    TOOLRECTANGLE: null,
    TOOLSHAPEBUILDER: null,
    TOOLLINE: null,

    OBJECTS: [],
    SELECTED: [],

    // Undo and redo
    ACTIONS: [],
    REDO_ACTIONS: [],

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

    // Layers
    LAYERS: [],
    SELECTED_LAYER_INDEX: 1,
    UI_LAYER: null,

    // Guide Shapes
    GUIDE_X_VALUES: [],
    GUIDE_Y_VALUES: [],
    GUIDE_LINES_Y: [],
    GUIDE_LINES_X: []
  },
  mutations: {
    // File settings
    SET_SCREEN_BORDER: function(state, path) {
      state.SCREEN_BORDER = path;
    },
    EXPORT_SVG: function(state) {
      let data = [];
      let objects = Utils.getUngrouped(state.OBJECTS);
      for(let i=0; i<objects.length; i++) {
        let item = objects[i];

        let itemData = {
          svg: item.exportSVG({asString: true}),
          selectable: item.selectable,
          type: item.type
        };

        data.push(itemData);
      }

      Utils.download('project', data);
    },
    IMPORT_SVG: function(state) {
      let _file_input = document.createElement('input');
      _file_input.type = 'file';

      _file_input.addEventListener('change', (e) => {
          let _file = e.target.files[0];

          project.clear();
          state.OBJECTS = [];
          state.SELECTED = [];

          let fs = new FileReader();
          fs.onload = () => {
            let data = JSON.parse(fs.result);

            // Add every shape from the file
            Object.keys(data).forEach(function(key, index) {
              if(data[key].type != "group") {
                project.importSVG(data[key].svg, {onLoad: (item) => {
                  item.selectable = data[key].selectable;
                  item.type = data[key].type;

                  state.OBJECTS.push(item);
                }})
              }
            });
          }
          fs.readAsText(_file);

          _file_input = null;
      });

      _file_input.click();
    },

    // --- Tools ---
    SET_ACTIVE: function(state, type) {
      let old = state.ACTIVE_TOOL
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
      if(!state.SELECTED.includes(shape))
        state.SELECTED.push(shape);
    },
    DESELECT: (state, shapes=null) => {
      if(shapes == null)
        shapes = [...state.SELECTED]

      for(var i=shapes.length-1; i>=0; i--) {
        shapes[i].selected = false;

        // Find the shape in the selected array
        let index_sel = state.SELECTED.findIndex(x => x === shapes[i]);

        // Remove it from selection array
        if(index_sel >= 0)
          state.SELECTED.splice(index_sel, 1);
      }
    },
    DELETE_SHAPES: (state, options={shapes, undo:false}) => {
      let shapes = options.shapes;
      if(shapes == null)
        shapes = [...state.SELECTED];

      let action = null;
      if(options.undo) {
        action = new Action("delete", {
          shapes: shapes,
          layers: []
        })
      }

      for(let i=0; i<shapes.length; i++) {
        if(options.undo) {
          action.data.layers.push(shapes[i].layer);
          shapes[i].visible = false;
          shapes[i].selectable = false;
          shapes[i].selected = false;
        }
        else {
          // Destroy the shape (it's still in the objects and the selection array)
          shapes[i].remove();
        }

        // Find the shape in the objects array
        let index_obj = state.OBJECTS.findIndex(x => x === shapes[i]);
        // Find the shape in the selected array
        let index_sel = state.SELECTED.findIndex(x => x === shapes[i]);

        // Remove it from the objects array
        state.OBJECTS.splice(index_obj, 1);
        // Remove it from selection array
        if(index_sel >= 0)
          state.SELECTED.splice(index_sel, 1);
      }

      if(options.undo) {
        state.ACTIONS.push(action);
        state.REDO_ACTIONS = []
      }
    },
    // Remove shapes from the objects and selection array WITHOUT DESTROYING THEM
    DISCARD_SHAPES(state, shapes=null) {
      if(shapes == null)
        shapes = [...state.SELECTED];

      for(var i=shapes.length-1; i>=0; i--) {
        // Find the shape in the objects array
        let index_obj = state.OBJECTS.findIndex(x => x === shapes[i]);
        // Find the shape in the selected array
        let index_sel = state.SELECTED.findIndex(x => x === shapes[i]);
        
        // Remove it from objects array
        state.OBJECTS.splice(index_obj, 1);
        // Remove it from selection array
        if(index_sel >= 0)
          state.SELECTED.splice(index_sel, 1);
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
    ADD_ACTION(state, action, clear_redo=true) {
      state.ACTIONS.push(action);
      if(clear_redo)
        state.REDO_ACTIONS = []
    },
    CLEAR_REDO(state) {
      state.REDO_ACTIONS = [];
    },
    REDO(state) {
      if(state.REDO_ACTIONS.length <= 0) {
        return;
      }

      let action = state.REDO_ACTIONS.pop();

      switch(action.type) {
        case "move":
          var delta = action.data.endPos.subtract(action.data.startPos);

          for(var i=0; i<action.data.paths.length; i++) {
            action.data.paths[i].translate(delta);
          }

          state.SELECTED = [...action.data.paths];
          break;

        case 'scale':
          var pivot = action.data.pivot;
          var end = action.data.handle_init;
          var init = action.data.handle_end;

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

          state.SELECTED = [...action.data.paths];
          break;

        case 'delete':
          let shapes = action.data.shapes;
          bus.$emit("redo-delete", (shapes));

          for(let i=0; i<shapes.length; i++) {
            action.data.layers.push(shapes[i].layer);
            shapes[i].visible = false;
            shapes[i].selectable = false;
            shapes[i].selected = false;

            // Find the shape in the objects array
            let index_obj = state.OBJECTS.findIndex(x => x === shapes[i]);
            // Find the shape in the selected array
            let index_sel = state.SELECTED.findIndex(x => x === shapes[i]);

            // Remove it from the objects array
            state.OBJECTS.splice(index_obj, 1);
            // Remove it from selection array
            if(index_sel >= 0)
              state.SELECTED.splice(index_sel, 1);
          }

          // Let other components know (ToolSelect -> transform box must disappear)
          bus.$emit("delete_selection");

          break;
      }

      state.ACTIONS.push(action);
    },
    UNDO(state) {
      if(state.ACTIONS.length <= 0) {
        return;
      }
      let action = state.ACTIONS.pop();
      
      switch(action.type) {
        case 'delete':
          let shapes = [...state.SELECTED];
          for(var i=shapes.length-1; i>=0; i--) {
            shapes[i].selected = false;
    
            // Find the shape in the selected array
            let index_sel = state.SELECTED.findIndex(x => x === shapes[i]);
    
            // Remove it from selection array
            if(index_sel >= 0)
              state.SELECTED.splice(index_sel, 1);
          }

          for(let i=0; i<action.data.shapes.length; i++) {
            let shape = action.data.shapes[i];
            action.data.layers[i].addChild(shape);

            // Add the shape
            state.OBJECTS.push(shape);
            state.SELECTED.push(shape);
            shape.selected = true;
            shape.selectable = true;
            shape.visible = true;
          }

          break;
        case 'move':
          var delta = action.data.startPos.subtract(action.data.endPos);

          for(var i=0; i<action.data.paths.length; i++) {
            action.data.paths[i].translate(delta);
          }

          state.SELECTED = [...action.data.paths];
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

          state.SELECTED = [...action.data.paths];
          break;
      }

      state.REDO_ACTIONS.push(action);
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
    LAYER_SELECT_ALL(state, number) {
      bus.$emit('layer-select-all', number);
    },
    REMOVE_LAYER(state) {
      if(state.SELECTED_LAYER_INDEX != 0) {
        bus.$emit('hide-transformbox');
        bus.$emit('remove-layer');
      }
    },
    MERGE_LAYERS(state) {
      bus.$emit('merge-layers');
    },
    MOVE_LAYER_UP(state) {
      bus.$emit('move-layer-up', state.SELECTED_LAYER_INDEX);
    },
    MOVE_LAYER_DOWN(state, number) {
      bus.$emit('move-layer-down', state.SELECTED_LAYER_INDEX);
    },
    SET_UI_LAYER(state, layer) {
      state.UI_LAYER = layer;
    },
    REFRESH_LAYER_ARRAY(state) {
      state.LAYERS = [...state.LAYERS];
    },
    SWAP_LAYERS(state, indexes) {
      let temp = state.LAYERS[indexes.first_index];
      state.LAYERS[indexes.first_index] = state.LAYERS[indexes.second_index];
      state.LAYERS[indexes.second_index] = temp;

      // Changing key for change detection
      state.LAYERS = [...state.LAYERS];
    },
    SET_SELECTED_LAYER_INDEX(state, value) {
      state.SELECTED_LAYER_INDEX = value;
    },

    // -- Guidelines --
    SET_GUIDE_X_VALUES(state, values) {
      state.GUIDE_X_VALUES = values;
    },
    SET_GUIDE_Y_VALUES(state, values) {
      state.GUIDE_Y_VALUES = values;
    },
    ADD_GUIDE_LINES_X(state, lines_x) {
      state.GUIDE_LINES_X.push(...lines_x);
    },
    ADD_GUIDE_LINES_Y(state, lines_y) {
      state.GUIDE_LINES_Y.push(...lines_y);
    },
    CLEAR_GUIDE_LINES_Y(state) {
      for(let i=0; i<state.GUIDE_LINES_Y.length; i++) {
        state.GUIDE_LINES_Y[i].remove();
      }

      state.GUIDE_LINES_Y = [];
    },
    CLEAR_GUIDE_LINES_X(state) {
      for(let i=0; i<state.GUIDE_LINES_X.length; i++) {
        state.GUIDE_LINES_X[i].remove();
      }

      state.GUIDE_LINES_X = [];
    }
  },
  getters: {
    clamp: () => (value, min, max) => {
      if(value < min){
        return min;
      } else if(value > max) {
        return max;
      }
      return value;
    }
  }
})
