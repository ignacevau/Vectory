function InitToolSelect () {
    var el = document.querySelector('#tool-select');

    el.addEventListener('mousedown', function(e) {
        toolSelect.activate();
        deselectTools();
        el.classList.add('tools-active');
    });

    var hitOptions = {
        segments: true,
        stroke: true,
        fill: true,
        tolerance: 4
    };

    var hoverItem;
    var selectionPath;

    toolSelect.onMouseDown = function(e) {
        project.activeLayer.selected = false;
    
        selectionPath.remove();
        if (hoverItem) {
            hoverItem.selected = true;
        }
    }

    toolSelect.onMouseMove = function(e) {
        if (hoverItem) {
            hoverItem = null;
            selectionPath.remove();
        }

        if (e.item) {
            hoverItem = e.item;
            selectionPath = hoverItem.clone();
            selectionPath.strokeColor = '#33b5ff';
            selectionPath.strokeWidth = 2 / paper.view.zoom;
        }  
    }    
}