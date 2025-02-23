import { Point3D, Quaternion } from "hifi-spatial-audio";
import { physicsController, twoDimensionalRenderer, uiController } from "..";

function sanitizeAngleDegrees(v: number): number {
    // in the case v is Infinity or Nan,  let's special case
    if (isNaN(v) || v === Infinity) {
        return 0.0;
    } else if (v === -Infinity) {
        return -0.0;
    } else {
        // bring the value in the range ]-360, 360[
        // if v is < 0 then it will cycle in ]-360, 0]
        // if v is > 0 then it will cycle in [0, 360[
        return v % 360.0;
    }
}

export class OrientationEuler3D {
    /**
     * Consider an aircraft: "Pitch" is defined as "nose up/down about the axis running from wing to wing".
     * **Negative pitch** means that the aircraft moves its nose **closer to the ground**.
     * **Positive pitch** means that the aircraft moves its nose **away from the ground**.
     * Units here are degrees.
     */
    pitchDegrees: number;
    /**
     * Consider an aircraft: "Yaw" is defined as "nose left/right about the axis running up and down".
     * **Negative yaw** means that the aircraft will rotate **clockwise** when viewing the aircraft from above.
     * **Positive yaw** means that the aircraft will rotate **counter-clockwise** when viewing the aircraft from above.
     * Units here are degrees.
     */
    yawDegrees: number;
    /**
     * Consider an aircraft: "Roll" is defined as "rotation about the axis running from nose to tail".
     * **Positive roll** means that the aircraft's **right wing will move closer to the ground**.
     * **Negative roll** means that the aircraft's **left wing will move closer to the ground**.
     * Units here are degrees.
     */
    rollDegrees: number;

    /**
     * Construct a new `OrientationEuler3D` object. All parameters are optional. Unset parameters will be set to `0`. Remember, all units for member variables are `degrees`.
     */
    constructor({ pitchDegrees = 0, yawDegrees = 0, rollDegrees = 0 }: { pitchDegrees?: number, yawDegrees?: number, rollDegrees?: number } = {}) {
        this.pitchDegrees = sanitizeAngleDegrees(pitchDegrees);
        this.yawDegrees = sanitizeAngleDegrees(yawDegrees);
        this.rollDegrees = sanitizeAngleDegrees(rollDegrees);
    }
}

export interface DataToTransmitToHiFi {
    position?: Point3D;
    orientation?: Quaternion;
}

export interface CanvasPX {
    x: number;
    y: number;
}

// Adapted from https://gist.github.com/gre/1650294 and http://gizma.com/easing/
export class EasingFunctions {
    // no easing, no acceleration
    static easeLinear = (t: number) => t;
    // accelerating from zero velocity
    static easeInQuad = (t: number) => t * t;
    // decelerating to zero velocity
    static easeOutQuad = (t: number) => t * (2 - t);
    // acceleration until halfway; then deceleration
    static easeInOutQuad = (t: number) => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    // accelerating from zero velocity 
    static easeInCubic = (t: number) => t * t * t;
    // decelerating to zero velocity 
    static easeOutCubic = (t: number) => (--t) * t * t + 1;
    // acceleration until halfway; then deceleration 
    static easeInOutCubic = (t: number) => t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    // accelerating from zero velocity 
    static easeInQuart = (t: number) => t * t * t * t;
    // decelerating to zero velocity 
    static easeOutQuart = (t: number) => 1 - (--t) * t * t * t;
    // acceleration until halfway; then deceleration
    static easeInOutQuart = (t: number) => t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
    // accelerating from zero velocity
    static easeInQuint = (t: number) => t * t * t * t * t;
    // decelerating to zero velocity
    static easeOutQuint = (t: number) => 1 + (--t) * t * t * t * t;
    // acceleration until halfway; then deceleration 
    static easeInOutQuint = (t: number) => t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
    // decelerating to zero velocity
    static easeOutExponential = (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export class Utilities {
    constructor() {

    }

    static clamp(value: number, min: number, max: number) {
        return Math.min(Math.max(value, min), max);
    }

    static linearScale(factor: number, minInput: number, maxInput: number, minOutput: number, maxOutput: number, clampInput: boolean = false) {
        if (clampInput) {
            factor = Utilities.clamp(factor, minInput, maxInput);
        }

        return minOutput + (maxOutput - minOutput) *
            (factor - minInput) / (maxInput - minInput);
    }

    static logarithmicScale(factor: number, minInput: number, maxInput: number, minOutput: number, maxOutput: number) {
        minOutput = Math.log(minOutput);
        maxOutput = Math.log(maxOutput);

        let scale = (maxOutput - minOutput) / (maxInput - minInput);

        return Math.exp(minOutput + scale * (factor - minInput));
    }

    static getRandomFloat(min: number, max: number) {
        return Math.random() * (max - min) + min;
    }

    static hexColorFromString(string: string) {
        if (!string) {
            return "#FFFFFF";
        }

        let hash = 0;
        for (let i = 0; i < string.length; i++) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash); // eslint-disable-line
        }

        let color = (hash & 0x00FFFFFF)
            .toString(16)
            .toUpperCase();

        return "#" + "000000".substring(0, 6 - color.length) + color;
    }

    static hexToRGB(colorHex: string) {
        if (!colorHex) {
            colorHex = "#FFFFFF";
        }

        colorHex = colorHex.slice(1);
        const hexBaseValue = 16;
        let splitHexValues = colorHex.match(/^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i);
        let red = parseInt(splitHexValues[1], hexBaseValue);
        let green = parseInt(splitHexValues[2], hexBaseValue);
        let blue = parseInt(splitHexValues[3], hexBaseValue);

        return {
            red: red,
            green: green,
            blue: blue
        }
    }

    static RGBtoHSV(rgb: any) {
        let r = rgb.r;
        let g = rgb.g;
        let b = rgb.b;

        let h;
        let s;
        let v;

        let maxColor = Math.max(r, g, b);
        let minColor = Math.min(r, g, b);
        let delta = maxColor - minColor;

        // Calculate hue
        // To simplify the formula, we use 0-6 range.
        if (delta === 0) {
            h = 0;
        } else if (r === maxColor) {
            h = (6 + (g - b) / delta) % 6;
        } else if (g === maxColor) {
            h = 2 + (b - r) / delta;
        } else if (b === maxColor) {
            h = 4 + (r - g) / delta;
        } else {
            h = 0;
        }
        // Then adjust the range to be 0-1
        h = h / 6;

        // Calculate saturation
        if (maxColor != 0) {
            s = delta / maxColor;
        } else {
            s = 0;
        }

        // Calculate value
        v = maxColor / 255;

        return { h: h, s: s, v: v };
    }

    static RGBAtoHex(rgba: any, ignoreAlpha: boolean) {
        let hexR = Number(rgba.r).toString(16);
        if (hexR.length < 2) {
            hexR = "0" + hexR;
        }
        let hexG = Number(rgba.g).toString(16);
        if (hexG.length < 2) {
            hexG = "0" + hexG;
        }
        let hexB = Number(rgba.b).toString(16);
        if (hexB.length < 2) {
            hexB = "0" + hexB;
        }
        let hexA;
        if (rgba.a && !ignoreAlpha) {
            hexA = Number(rgba.a).toString(16);
            if (hexA.length < 2) {
                hexA = "0" + hexA;
            }
        }

        if (hexA) {
            return `#${hexR}${hexG}${hexB}${hexA}`;
        } else {
            return `#${hexR}${hexG}${hexB}`;
        }
    }

    static getPixelDataFromCanvasImageData(imageData: Uint8ClampedArray, x: number, y: number, width: number) {
        let red = imageData[y * (width * 4) + x * 4];
        let green = imageData[y * (width * 4) + x * 4 + 1];
        let blue = imageData[y * (width * 4) + x * 4 + 2];
        let alpha = imageData[y * (width * 4) + x * 4 + 3];

        return {
            r: red,
            g: green,
            b: blue,
            a: alpha
        };
    }

    static getConstrastingTextColor(rgb: any) {
        // HSP Color Model equation from http://alienryderflex.com/hsp.html
        // The three constants (.299, .587, and .114) represent the different degrees to which each of the primary (RGB) colors 
        // affects human perception of the overall brightness of a color.  Notice that they sum to 1.
        let perceivedBrightnessDegreeRed = 0.299;
        let perceivedBrightnessDegreeGreen = 0.587;
        let perceivedBrightnessDegreeBlue = 0.114;

        let brightness = Math.sqrt(
            perceivedBrightnessDegreeRed * (rgb.red * rgb.red) +
            perceivedBrightnessDegreeGreen * (rgb.green * rgb.green) +
            perceivedBrightnessDegreeBlue * (rgb.blue * rgb.blue)
        );

        // Using the HSP value, determine whether the color is light or dark
        let medianBrightnessValue = 127.5;
        if (brightness > medianBrightnessValue) {
            return "#000000";
        }
        else {
            return "#FFFFFF";
        }
    }

    static getInitials(name: string) {
        if (!name) {
            return "";
        }

        name = name.toString();

        let textWords = name.split(" ");
        textWords = textWords.splice(0, 2);
        textWords.forEach((word, idx) => { const symbols = [...word]; textWords[idx] = symbols[0]; });
        return textWords.join("").toUpperCase();
    }

    static getDistanceBetween2DPoints(x1: number, y1: number, x2: number, y2: number) {
        let xMovement = x2 - x1;
        let yMovement = y2 - y1;

        return Math.sqrt((xMovement *= xMovement) + (yMovement *= yMovement));
    }

    static randomIntBetween(min: number, max: number) {
        return Math.floor(Utilities.randomFloatBetween(min, max));
    }

    static randomFloatBetween(min: number, max: number) {
        return (Math.random() * (max - min)) + min;
    }

    static generateUUID(trimBrackets?: boolean) {
        let i = 0;
        let generatedUUID = "";
        let baseString;
        if (trimBrackets) {
            baseString = '{xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx}';
        } else {
            baseString = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
        }
        while (i++ < 38) {
            let c = baseString[i - 1], r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            generatedUUID += (c == '-' || c == '4') ? c : v.toString(16)
        }

        return generatedUUID;
    }

    static rotateAroundPoint(cx: number, cy: number, x: number, y: number, angleDegrees: number) {
        let radians = (Math.PI / 180) * angleDegrees,
            cos = Math.cos(radians),
            sin = Math.sin(radians),
            nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
            ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
        return [nx, ny];
    }

    static inFrontOf(startPoint: Point3D, distance: number, angleRadians: number) {
        angleRadians -= Math.PI / 2;

        return new Point3D({
            "x": startPoint.x + distance * Math.cos(angleRadians),
            "y": startPoint.y,
            "z": startPoint.z + distance * Math.sin(angleRadians)
        });
    }

    static normalModeCanvasPXToM(canvasPX: CanvasPX) {
        let pxPerM = physicsController.pxPerMCurrent;
        let canvasOffsetPX = twoDimensionalRenderer.canvasOffsetPX;
        let cameraPositionNoOffsetM = twoDimensionalRenderer.cameraPositionNoOffsetM;
        let yawOrientationRadians = twoDimensionalRenderer.canvasRotationDegrees * Math.PI / 180;

        if (pxPerM === undefined || canvasOffsetPX === undefined || cameraPositionNoOffsetM === undefined || yawOrientationRadians === undefined) {
            return;
        }

        let translatedCanvasPX = {
            x: canvasPX.x - canvasOffsetPX.x - cameraPositionNoOffsetM.x * pxPerM,
            y: canvasPX.y - canvasOffsetPX.y - cameraPositionNoOffsetM.z * pxPerM
        };

        // console.log(translatedCanvasPX)

        let rotatedCanvasPX = {
            x: translatedCanvasPX.x * Math.cos(yawOrientationRadians) - translatedCanvasPX.y * Math.sin(yawOrientationRadians),
            y: translatedCanvasPX.x * Math.sin(yawOrientationRadians) + translatedCanvasPX.y * Math.cos(yawOrientationRadians)
        };

        // console.log(rotatedCanvasPX)

        let pointM = {
            x: rotatedCanvasPX.x / pxPerM + cameraPositionNoOffsetM.x,
            z: rotatedCanvasPX.y / pxPerM + cameraPositionNoOffsetM.z
        };
        // console.log(pointM)
        // console.log('')

        return pointM;
    }

    /**
     * @returns If the point is within the rectangle, returns the distance from the center of the rectangle. Else, returns `undefined`. 
     */
    static pointIsWithinRectangle({ point, rectCenter, rectDimensions }: { point: Point3D, rectCenter: Point3D, rectDimensions: Point3D }) {
        if (!(point && rectCenter && rectDimensions)) {
            return false;
        }

        if (point.x <= rectCenter.x + rectDimensions.x / 2 &&
            point.x >= rectCenter.x - rectDimensions.x / 2 &&
            point.z <= rectCenter.z + rectDimensions.z / 2 &&
            point.z >= rectCenter.z - rectDimensions.z / 2) {
            return Utilities.getDistanceBetween2DPoints(point.x, point.z, rectCenter.x, rectCenter.z);
        } else {
            return undefined;
        }
    }

    static getGesturePointFromEvent(evt: MouseEvent | TouchEvent) {
        let point = {
            x: 0,
            y: 0
        };

        if (typeof (TouchEvent) !== "undefined" && evt instanceof TouchEvent) {
            // Prefer Touch Events
            point.x = evt.targetTouches[0].clientX;
            point.y = evt.targetTouches[0].clientY;
        } else {
            // Either Mouse event or Pointer Event
            point.x = (<MouseEvent>evt).clientX;
            point.y = (<MouseEvent>evt).clientY;
        }

        return point;
    }

    static enumKeys<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
        return Object.keys(obj).filter(k => Number.isNaN(+k)) as K[];
    }

    // Code adapted from daviestar at https://stackoverflow.com/a/45894506/9722373
    static fit(contains: boolean, parentWidth: number, parentHeight: number, childWidth: number, childHeight: number, scale = 1, offsetX = 0.5, offsetY = 0.5) {
        const childRatio = childWidth / childHeight
        const parentRatio = parentWidth / parentHeight
        let width = parentWidth * scale
        let height = parentHeight * scale

        if (contains ? (childRatio > parentRatio) : (childRatio < parentRatio)) {
            height = width / childRatio
        } else {
            width = height * childRatio
        }

        return {
            width,
            height,
            offsetX: (parentWidth - width) * offsetX,
            offsetY: (parentHeight - height) * offsetY
        }
    }

    /**
     * Adapted from Juan Mendez at https://stackoverflow.com/a/3368118/9722373.
     * Draws a rounded rectangle using the current state of the canvas.
     * If you omit the last three params, it will draw a rectangle
     * outline with a 5 pixel border radius
     * @param {CanvasRenderingContext2D} ctx
     * @param {Number} x The top left x coordinate
     * @param {Number} y The top left y coordinate
     * @param {Number} width The width of the rectangle
     * @param {Number} height The height of the rectangle
     * @param {Number} [radius = 5] The corner radius; It can also be an object 
     *                 to specify different radii for corners
     * @param {Number} [radius.tl = 0] Top left
     * @param {Number} [radius.tr = 0] Top right
     * @param {Number} [radius.br = 0] Bottom right
     * @param {Number} [radius.bl = 0] Bottom left
     * @param {Boolean} [fill = false] Whether to fill the rectangle.
     * @param {Boolean} [stroke = true] Whether to stroke the rectangle.
     */
    static roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: any, fill = false, stroke = true) {
        if (typeof radius === 'number') {
            radius = { tl: radius, tr: radius, br: radius, bl: radius };
        } else {
            let defaultRadius: any = { tl: 0, tr: 0, br: 0, bl: 0 };
            for (let side in defaultRadius) {
                radius[side] = radius[side] || defaultRadius[side];
            }
        }
        ctx.beginPath();
        ctx.moveTo(x + radius.tl, y);
        ctx.lineTo(x + width - radius.tr, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
        ctx.lineTo(x + width, y + height - radius.br);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
        ctx.lineTo(x + radius.bl, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
        ctx.lineTo(x, y + radius.tl);
        ctx.quadraticCurveTo(x, y, x + radius.tl, y);
        ctx.closePath();
        if (fill) {
            ctx.fill();
        }
        if (stroke) {
            ctx.stroke();
        }
    }
}