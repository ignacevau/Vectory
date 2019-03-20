var canvas;
paper.install(window);

function InitMain() {
    paper.setup('canvas');
    canvas = document.getElementById('canvas');
}

window.onload = function() {
    InitMain();
    InitSidebars();

    InitToolZoom();
    InitToolSelect();
};