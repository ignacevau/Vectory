function InitToolPointer () {
    var el = document.querySelector('#tool-pointer');

    el.addEventListener('mousedown', function(e) {
        toolPointer.activate();
        deselectTools();
        el.classList.add('tools-active');
    });
}