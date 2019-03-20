function InitZoom () {
    view = paper.view;

    // Firefox
    document.querySelector('#canvas').onwheel = function(e) {
        e.preventDefault();

        var mousePos = new Point(e.clientX, e.clientY);
        updateZoom(e.deltaY, mousePos);
    }

    function updateZoom(delta, mousePos) {
        var mouseViewPos = view.viewToProject(mousePos);
        [view.zoom, offset] = changeZoomStable(view.zoom, delta, view.center, mouseViewPos);
        view.center = view.center.add(offset);
        view.draw();

        // Pretty much hardcoded, this is to adjust the hitTolerance in respect to the zoom
        settings.hitTolerance = (7 / (view.zoom)).clamp(0, 17);
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