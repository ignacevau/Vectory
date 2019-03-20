function InitToolShape () {
    var el = document.querySelector('#tool-shape');

    el.addEventListener('mousedown', function(e) {
        toolShape.activate();
        deselectTools();
        el.classList.add('tools-active');
    });

    var newPath;
    var oldPath;
    var middle;

    toolShape.onMouseDown = function(e) {
        newPath = new Path();

        middle = e.point;

        if(oldPath)
            oldPath.selected = false;
    }

    toolShape.onMouseDrag = function(e) {
        newPath.remove();
        newPath = Path.Circle(middle, middle.subtract(e.point).length);
        newPath.strokeColor = 'black';
    }

    toolShape.onMouseUp = function(e) {
        // Don't create an object for a click
        if (e.delta.length < 3) {
            newPath.remove();
            return;
        }

        newPath.selected = true;
        oldPath = newPath;

        objects.push(newPath);
    }
}