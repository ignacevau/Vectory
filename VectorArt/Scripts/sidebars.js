function InitSidebars() {
    var handlerLeft = document.querySelector('#handler-left');
    var handlerRight = document.querySelector('#handler-right');
    var wrapper = handlerLeft.closest('.content');
    var sideLeft = wrapper.querySelector('.left');
    var sideRight = wrapper.querySelector('.right');

    var handlerDraggingLeft = false;
    var handlerDraggingRight = false;

    sideLeft.style.flexGrow = 0;
    sideRight.style.flexGrow = 0;
    sideLeft.style.width = 100 + 'px';
    sideRight.style.width = 100 + 'px';

    function Clamp(value, min, max){
        if(value < min){
            return min;
        }else if(value > max){
            return max;
        }else{
            return value;
        }
    }

    handlerLeft.addEventListener('mousedown', function(e) {
        handlerDraggingLeft = true;
    });

    handlerRight.addEventListener('mousedown', function(e) {
        handlerDraggingRight = true;
    });

    document.addEventListener('mousemove', function(e) {
        // Don't do anything if dragging flag is false
        if (!handlerDraggingLeft && !handlerDraggingRight) {
            return false;
        }

        // Get offset
        var containerOffsetLeft = wrapper.offsetLeft;

        // Get x-coordinate of pointer relative to container
        var pointerRelativeXpos = e.clientX - containerOffsetLeft;
        
        // Arbitrary minimum width set on the sidebar, otherwise its inner content will collapse to width of 0
        var minWidth = 50;
        var maxWidth = 100;

        // * 1px is the left/right spacing between .handler and its inner pseudo-element
        // * Set flex-grow to 0 to prevent it from growing
        if(handlerDraggingLeft) {
            sideLeft.style.width = Clamp(pointerRelativeXpos - 1, minWidth, maxWidth) + 'px';
            sideLeft.style.flexGrow = 0;
        }
        if(handlerDraggingRight) {
            sideRight.style.width = Clamp(window.innerWidth - (pointerRelativeXpos + 1), minWidth, maxWidth) + 'px';
            sideRight.style.flexGrow = 0;
        }
    });

    document.addEventListener('mouseup', function(e) {
        // Turn off dragging flag when user mouse is up
        if (handlerDraggingLeft) {
            sideLeft.style.flexGrow = 0;
            handlerDraggingLeft = false;
        }
        else if (handlerDraggingRight) {
            sideRight.style.flexGrow = 0;
            handlerDraggingRight = false;
        }
    });
}