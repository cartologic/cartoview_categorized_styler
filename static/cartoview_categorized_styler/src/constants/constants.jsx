const UNIQUE_VALUES = "UNIQUE_VALUES";
const SOLID = "Solid";
const BY_VALUE = "By Value";
// const DEFAULT_PALETTE = "Burg";
const DEFAULT_PALETTE = "Prism";
const DEFAULT_COLOR = "#dddddd";
const DEFAULT_NUM_OF_CLASSES = 5;
const DEFAULTS = {
    // numOfClasses: DEFAULT_NUM_OF_CLASSES,
    stroke: SOLID,
    strokeColor: DEFAULT_COLOR,
    strokeOpacity: 1,
    strokeWidth: 1,

    fill: BY_VALUE,
    fillColor: DEFAULT_PALETTE,
    fillOpacity: 1,

    graphicName: "circle",
    pointRadius: 5,
    custom: false
};

const MAX_SIZE = 11;

const DefaultModalStyle = {
    overlay: {
        position: 'fixed',
        top: 80,
        left: 0,
        right: 0,
        bottom: 0,
        // backgroundColor: 'rgba(255,255,255,0.20)',
        zIndex: 999
    },
    content: {
        outline: 'none',
        // width: "80%",
        height: '700px',
        overflow: 'hidden',
        // margin: 'auto',
    }
}

export { UNIQUE_VALUES, SOLID, BY_VALUE, DEFAULTS, DEFAULT_NUM_OF_CLASSES, DEFAULT_PALETTE, DEFAULT_COLOR, MAX_SIZE, DefaultModalStyle }
