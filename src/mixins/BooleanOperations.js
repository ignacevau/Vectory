import { mapState, mapMutations } from "vuex";
import paper from 'paper';
import Utils from '@/Utils.js';
import Data from '@/Data.js';
import { GroupOperations } from '@/mixins/GroupOperations.js';

export const BooleanOperations = {
    mixins: [
        GroupOperations
    ],
    computed: {
        ...mapState([
            'SELECTED'
        ])
    },
    methods: {
        ...mapMutations([
            'DELETE_SHAPES',
            'ADD_SHAPE'
        ]),
        UNITE: function (shapes1 = null, shapes2 = null) {
            let items1, items2 = null;

            if (shapes1 == null && shapes2 == null) {
                let length = this.SELECTED.length;
                if (length >= 2) {
                    shapes1 = this.SELECTED[length-1];
                    shapes2 = this.SELECTED[length-2];
                }
                else {
                    return;
                }
            }
            else if (shapes1 == null || shapes2 == null) {
                return;
            }

            if(shapes1.type == "group")
                items1 = this.GET_UNGROUPED([shapes1]);
            else if (shapes1.type == "shape")
                items1 = [shapes1];
            else
                console.error("fuck you messed up! Unknown item type: " + shapes1.type);

            if (shapes2.type == "group")
                items2 = this.GET_UNGROUPED([shapes2]);
            else if(shapes2.type == "shape")
                items2 = [shapes2];
            else   
                console.error("fuck you messed up! Unknown item type: " + shapes2.type);

            let junk = [...items1, ...items2];

            let result = items1[0].unite(items2[0]);
            junk.push(result);
            for(let i=1; i<items1.length; i++) {
                result = result.unite(items1[i])
                junk.push(result);
            }
            for(let i=1; i<items2.length; i++) {
                result = result.unite(items2[i])
                junk.push(result);
            }
            junk.pop();

            this.DELETE_SHAPES({
                shapes: junk,
                undo: false
            });

            result.selectable = true;
            result.type = "shape";
            this.ADD_SHAPE(result);
        }
    }
}