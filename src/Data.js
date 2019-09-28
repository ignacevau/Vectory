const SIDEBAR_RIGHT_MIN_WIDTH = 120;
const SIDEBAR_RIGHT_MAX_WIDTH = 180;
const SIDEBAR_LEFT_MIN_WIDTH = 50;
const SIDEBAR_LEFT_MAX_WIDTH = 90;

export default Object.freeze({
    SIDEBAR_RIGHT_MIN_WIDTH: SIDEBAR_RIGHT_MIN_WIDTH,
    SIDEBAR_RIGHT_MAX_WIDTH: SIDEBAR_RIGHT_MAX_WIDTH,
    SIDEBAR_LEFT_MIN_WIDTH: SIDEBAR_LEFT_MIN_WIDTH,
    SIDEBAR_LEFT_MAX_WIDTH: SIDEBAR_LEFT_MAX_WIDTH,

    CENTER_HOR: (screen.width-SIDEBAR_RIGHT_MAX_WIDTH-SIDEBAR_LEFT_MIN_WIDTH)/2 + SIDEBAR_LEFT_MIN_WIDTH,
    CENTER_VER: screen.height/2 - 30,

    DOCUMENT_WIDTH: screen.width / 1.5,
    DOCUMENT_HEIGHT: screen.height / 1.5
});