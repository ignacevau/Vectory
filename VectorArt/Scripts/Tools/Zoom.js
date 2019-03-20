function InitToolZoom () {
    // Testing for the canvas resizing
    var path;

    path = new Path.Circle(new Point(300, 300), 40);
    path.fillColor = 'black';


    view = paper.view;

    // Firefox
    document.querySelector('.main').onwheel = function(e) {
        e.preventDefault();
        // Don't zoom when the mouse is on the footer
        if (e.target.localName === 'footer') {
            return;
        }

        var mousePos = new Point(e.clientX, e.clientY);
        updateZoom(e.deltaY, mousePos);
    }

    function updateZoom(delta, mousePos) {
        var mouseViewPos = view.viewToProject(mousePos);
        [view.zoom, offset] = changeZoomStable(view.zoom, delta, view.center, mouseViewPos);
        view.center = view.center.add(offset);
        view.draw();
    }

    function getNewZoom(oldZoom, delta) {
        factor = 1.05;

        if (delta > 0) {
            return oldZoom / factor;
        }
        else if (delta < 0) {
            return oldZoom * factor;
        }
    }

    function changeZoomStable(oldZoom, delta, c, p) {
        var newZoom = getNewZoom(oldZoom, delta);
        var beta = oldZoom / newZoom;
        var pc = p.subtract(c);
        var a = p.subtract(pc.multiply(beta)).subtract(c);

        return [newZoom, a];
    }
}