import { mapState, mapMutations } from "vuex";
import Utils from '@/Utils.js';
import Data from '@/Data.js';

export const GroupOperations = {
    methods: {
        GET_UNGROUPED(items) {
            if (items.length == 0) {
                return [];
            }

            let result = [];

            for (let i = 0; i < items.length; i++) {
                let item = items[i];

                if (item.type == "shape") {
                    result.push(item)
                }
                else if (item.type == "group") {
                    for (let j = 0; j < item.children.length; j++) {
                        result.push(...this.GET_UNGROUPED([item.children[j]]));
                    }
                }

                // Error catching - prevent infinite loop
                else {
                    console.error("Unknown item type! Item was: " + item);
                    return null;
                }
            }

            return result;
        }
    }
}