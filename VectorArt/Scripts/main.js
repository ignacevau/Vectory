var canvas;

function InitMain() {
    canvas = document.getElementById("canvas");
}

window.onload = function() {
    InitMain();
    InitSidebars();
    InitCanvas();
}