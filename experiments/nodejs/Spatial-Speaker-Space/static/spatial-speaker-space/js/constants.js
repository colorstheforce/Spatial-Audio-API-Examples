const SPEAKER_AVATAR_RADIUS_M = 0.20;
const AUDIENCE_AVATAR_RADIUS_M = 0.15;
const MIN_VOLUME_DB = -96;
const MAX_VOLUME_DB = 0;
const PEAK_TIMEOUT_MS = 1000;
const MAX_VOLUME_DB_AVATAR_RADIUS_MULTIPLIER = 1.8;
const DEFAULT_USER_COLOR_HEX = "#FF0000";
const CLOSE_ENOUGH_M = 0.005;
const AUDIENCE_RADIUS_M = 0;
const SPEAKER_RADIUS_M = 1.0;
const VIRTUAL_SPACE_DIMENSIONS_PER_SIDE_M = Math.max(AUDIENCE_RADIUS_M, SPEAKER_RADIUS_M) * 3;
const DRAW_SCALE_ARCS = true;
const SCALE_ARC_STROKE_WIDTH_PX = 1.0;
const SCALE_ARC_INFO = [
    {
        radius: SPEAKER_RADIUS_M,
        color: "#DFC2F2",
    },
    {
        radius: AUDIENCE_RADIUS_M,
        color: "#CFB3CD",
    },
];
const SCALE_ARC_LABEL_PADDING_PX = 20;
const SCALE_ARC_LABEL_COLOR_HEX = "#BBBBBB";
const SCALE_ARC_LABEL_FONT = '14px sans-serif';
const MY_AVATAR_STROKE_HEX_MUTED = "#FF0000";
const MY_AVATAR_STROKE_HEX_UNMUTED = "#FFFFFF";
const OTHER_AVATAR_STROKE_HEX = "#000000";
const RECORDING_AVATAR_HEX = "#FF0000";
const AVATAR_STROKE_WIDTH_PX = 5.0;
const ORIENTATION_CIRCLE_RADIUS_DIVISOR = 4;
const MY_AVATAR_LABEL_FONT = '14px sans-serif';
const MY_AVATAR_LABEL_Y_OFFSET_PX = 6;
const MY_AVATAR_LABEL = `you`;
const DIRECTION_CLOUD_RADIUS_MULTIPLIER = 2;
const AVATAR_HOVER_HIGHLIGHT_RADIUS_ADDITION_M = 0.1;

let PHYSICS = {};
PHYSICS.PHYSICS_TICKRATE_MS = 16;

let SIGNALS = {};
SIGNALS.RANDOM_START_DISTANCE_M = SPEAKER_AVATAR_RADIUS_M * 2;
SIGNALS.RECEIVE_DISTANCE_M = SPEAKER_AVATAR_RADIUS_M;