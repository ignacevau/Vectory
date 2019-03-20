function InitToolPen () {
    var el = document.querySelector('#tool-pen');

    el.addEventListener('mousedown', function(e) {
        toolPen.activate();
        deselectTools();
        el.classList.add('tools-active');
    });

    var oldPath;
    var newPath;
    var delta = 0;

    toolPen.onMouseDown = function(e) {
        newPath = new Path();
        newPath.strokeColor = 'black';

        delta = 0;

        if(oldPath)
            oldPath.selected = false;
    }

    toolPen.onMouseDrag = function(e) {
        newPath.add(e.point);
        delta += e.delta.length;
    }

    toolPen.onMouseUp = function(e) {
        // Don't create an object for a click
        if (delta < 3) {
            newPath.remove();
            return;
        }

        newPath.smooth();
        newPath.simplify();
        newPath.selected = true;

        oldPath = newPath;

        objects.push(newPath);
    }
}