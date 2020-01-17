import { mapState, mapMutations } from "vuex";
import Utils from '@/Utils.js';
import paper from "paper";
import Data from '@/Data.js';

export const GuideLines = {
    computed: {
        ...mapState([
            'OBJECTS',
            'GUIDE_X_VALUES',
            'GUIDE_Y_VALUES',
            'SCREEN_BORDER'
        ])
    },
    methods: {
        ...mapMutations([
            'SET_GUIDE_X_VALUES',
            'SET_GUIDE_Y_VALUES',
            'CLEAR_GUIDE_LINES',
            'ADD_GUIDE_LINES'
        ]),
        updateGuidePoints: function() {
            let objects = Utils.getUngrouped(this.OBJECTS);
            let x_values = [];
            let y_values = [];

            for(let i=0; i<objects.length; i++) {
                let item = objects[i];

                x_values.push(item.bounds.center.x);
                x_values.push(item.bounds.leftCenter.x);
                x_values.push(item.bounds.rightCenter.x);

                y_values.push(item.bounds.center.y);
                y_values.push(item.bounds.topCenter.y);
                y_values.push(item.bounds.bottomCenter.y);
            }

            this.SET_GUIDE_X_VALUES(x_values);
            this.SET_GUIDE_Y_VALUES(y_values);
        },
        drawGuideLines: function() {
            this.CLEAR_GUIDE_LINES();
            let x_values = this.GUIDE_X_VALUES;
            let y_values = this.GUIDE_Y_VALUES;

            for(let i=0; i<y_values.length; i++) {
                // Horizontal line
                let hor_p1 = new Point(this.SCREEN_BORDER.bounds.leftCenter.x, y_values[i]);
                let hor_p2 = new Point(this.SCREEN_BORDER.bounds.rightCenter.x, y_values[i]);

                let horGL = new Path.Line(hor_p1, hor_p2);
                horGL.strokeColor = 'red';
                horGL.strokeWidth = 0.5;

                this.ADD_GUIDE_LINES([horGL]);
            }

            for(let i=0; i<x_values.length; i++) {
                // Vertical line
                let ver_p1 = new Point(x_values[i], this.SCREEN_BORDER.bounds.bottomCenter.y);
                let ver_p2 = new Point(x_values[i], this.SCREEN_BORDER.bounds.topCenter.y);

                let verGL = new Path.Line(ver_p1, ver_p2);
                verGL.strokeColor = 'red';
                verGL.strokeWidth = 0.5;

                this.ADD_GUIDE_LINES([verGL]);
            }
        },
        getGuidedPosition: function(pos) {
            const x_values = this.GUIDE_X_VALUES;
            const y_values = this.GUIDE_Y_VALUES;
            let snappedX = false;
            let snappedY = false;
            
            let guidedPoint = new Point(pos.x, pos.y);

            for(let i=0; i<x_values.length; i++) {
                if(Math.abs(x_values[i] - pos.x) < Data.SNAP_THRESHOLD) {
                    guidedPoint.x = x_values[i];
                    snappedX = true;
                }
            }
            for(let i=0; i<y_values.length; i++) {
                if(Math.abs(y_values[i] - pos.y) < Data.SNAP_THRESHOLD) {
                    guidedPoint.y = y_values[i];
                    snappedY = true;
                }
            }

            return [guidedPoint, snappedX, snappedY];
        }
    }
}