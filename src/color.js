/* @flow */

import {turns, degrees} from "./angle"
import panic from "outthrow"


/*::
import type {Int, Float} from "./core"
import type {Color, RGBA, HSLA} from "./color"
*/


class RGBAColor {
  /*::
  red: Int;
  green: Int;
  blue: Int;
  alpha: Float;
  */
  constructor(red/*:Int*/, green/*:Int*/, blue/*:Int*/, alpha/*:Float*/) {
    this.red = red
    this.green = green
    this.blue = blue
    this.alpha = alpha
  }
  static toHSLA ({red, green, blue, alpha}/*:RGBA*/)/*:HSLA*/ {
    const [r, g, b] = [red/255, green/255, blue/255]
    const max = Math.max(Math.max(r, g), b)
    const min = Math.min(Math.min(r, g), b)
    const delta = max - min

    const h = max === r ? fmod(((g - b) / delta), 6) :
              max === g ? (((b - r) / delta) + 2) :
              ((r - g) / delta) + 4
    const hue = degrees(60) * h

    const lightness = (max + min) / 2
    const saturation = lightness === 0 ? 0 :
                       delta / (1 - Math.abs(2 * lightness - 1))

    return new HSLAColor(hue, lightness, saturation, alpha)
  }
}
const isRGBA =
  value =>
  ( value instanceof RGBAColor
  ? true
  : ( value != null &&
      typeof(value.red) === "number" &&
      typeof(value.green) === "number" &&
      typeof(value.blue) === "number" &&
      typeof(value.alpha) === "number"
    )
  )


class HSLAColor {
  /*::
  hue: Float;
  saturation: Float;
  lightness: Float;
  alpha: Float;
  */
  constructor(hue/*:Float*/, saturation/*:Float*/, lightness/*:Float*/, alpha/*:Float*/) {
    this.hue = hue
    this.saturation = saturation
    this.lightness = lightness
    this.alpha = alpha
  }
  static complement({hue, saturation, lightness, alpha}/*:HSLA*/)/*:HSLA*/ {
    return new HSLAColor
    ( hue + degrees(180)
    , saturation
    , lightness
    , alpha
    )
  }
  static toRGBA({hue, saturation, lightness, alpha}/*:HSLA*/)/*:RGBA*/ {
    const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation
    const h = hue / degrees(60)
    const x = chroma * (1 - Math.abs(fmod(h, 2 - 1)))

    const [r, g, b] = h < 0 ? [0, 0, 0] :
                      h < 1 ? [chroma, x, 0] :
                      h < 2 ? [x, chroma, 0] :
                      h < 3 ? [0, chroma, x] :
                      h < 4 ? [0, x, chroma] :
                      h < 5 ? [x, 0, chroma] :
                      h < 6 ? [chroma, 0, x] :
                      [0, 0, 0]

    const m = lightness - chroma / 2

    const color = new RGBAColor
    ( Math.round(255 * (r + m))
    , Math.round(255 * (g + m))
    , Math.round(255 * (b + m))
    , alpha
    )

    return color
  }
}

const isHSLA =
  value =>
  ( value instanceof HSLAColor
  ? true
  : ( value != null &&
      typeof(value.hue) === "number" &&
      typeof(value.saturation) === "number" &&
      typeof(value.lightness) === "number" &&
      typeof(value.alpha) === "number"
    )
  )

// Create RGB colors with an alpha component for transparency.
// The alpha component is specified with numbers between 0 and 1
export const rgba =
  ( red/*:Int*/
  , green/*:Int*/
  , blue/*:Int*/
  , alpha/*:Float*/
  )/*:RGBA*/ =>
  new RGBAColor
  ( red
  , green
  , blue
  , alpha
  )


// Create RGB colors from numbers between 0 and 255 inclusive
export const rgb =
  ( red/*:Int*/
  , green/*:Int*/
  , blue/*:Int*/
  )/*:RGBA*/ =>
  new RGBAColor
  ( red
  , green
  , blue
  , 1
  )

// Create [HSL colors](http://en.wikipedia.org/wiki/HSL_and_HSV)
// with an alpha component for transparency.
export const hsla =
  ( hue/*:Float*/
  , saturation/*:Float*/
  , lightness/*:Float*/
  , alpha/*:Float*/
  )/*:HSLA*/ =>
  new HSLAColor
  ( hue - turns(Math.floor(hue / (2 * Math.PI)))
  , saturation
  , lightness
  , alpha
  )

// Create [HSL colors](http://en.wikipedia.org/wiki/HSL_and_HSV). This gives
// you access to colors more like a color wheel, where all hues are aranged in a
// circle that you specify with angles (radians).
//
//     const red = hsl(degrees(0), 1, 0.5)
//     const green = hsl(degrees(120), 1, 0.5)
//     const blue = hsl(degrees(240), 1, 0.5)
//     const pastelRed = hsl(degrees(0), 0.7, 0.7)
//
// To cycle through all colors, just cycle through degrees. The saturation level
// is how vibrant the color is, like a dial between grey and bright colors. The
// lightness level is a dial between white and black.
export const hsl =
  ( hue/*:Float*/
  , saturation/*:Float*/
  , lightness/*:Float*/
  )/*:HSLA*/ =>
  hsla(hue, saturation, lightness, 1)

// Produce a gray based on the input. 0 is white, 1 is black.
export const grayscale =
  (value:Float)/*:Color*/ =>
  new HSLAColor(0, 0, 1 - value, 1)

// Produce a "complementary color". The two colors will
// accent each other. This is the same as rotating the hue by 180&deg;
export const complement =
  (color/*:Color*/)/*:Color*/ =>
  HSLAColor.complement(toHSL(color))


// Convert given color into the HSL format.
export const toHSL =
  (color/*:Color*/)/*:HSLA*/ =>
  ( color instanceof HSLAColor
  ? color
  : color instanceof RGBAColor
  ? RGBAColor.toHSLA(color)
  : ( color != null &&
      typeof(color.hue) === "number" &&
      typeof(color.saturation) === "number" &&
      typeof(color.lightness) === "number" &&
      typeof(color.alpha) === "number"
    )
  // @FlowIssue: Still not convinced we have all properties
  ? (color/*:HSLA*/)
  : ( color != null &&
      typeof(color.red) === "number" &&
      typeof(color.green) === "number" &&
      typeof(color.blue) === "number" &&
      typeof(color.alpha) === "number"
    )
  // @FlowIssue: Still not convinced we have all properties
  ? RGBAColor.toHSLA((color/*:RGBA*/))
  : panic(TypeError("Passed argument is not a valid color value"))
  )

// Convert given color into the RGB format.
export const toRGB =
  (color/*:Color*/)/*:RGBA*/ =>
  ( color instanceof HSLAColor
  ? HSLAColor.toRGBA(color)
  : color instanceof RGBAColor
  ? color
  : ( color != null &&
      typeof(color.hue) === "number" &&
      typeof(color.saturation) === "number" &&
      typeof(color.lightness) === "number" &&
      typeof(color.alpha) === "number"
    )
  // @FlowIssue: Still not convinced we have all properties
  ? HSLAColor.toRGBA((color/*:RGBA*/))
  : ( color != null &&
      typeof(color.red) === "number" &&
      typeof(color.green) === "number" &&
      typeof(color.blue) === "number" &&
      typeof(color.alpha) === "number"
    )
  // @FlowIssue: Still not convinced we have all properties
  ? (color/*:RGBA*/)
  : panic(TypeError("Passed argument is not a valid color value"))
  )

const fmod =
  (f/*:Float*/, n/*:Int*/)/*:Float*/ => {
    const integer = Math.floor(f)
    return integer % n + f - integer
  }




// ## Built-in Colors

// These colors come from the [Tango palette](http://tango.freedesktop.org/Tango_Icon_Theme_Guidelines)
// which provides aesthetically reasonable defaults for colors. Each color also
// comes with a light and dark version.

export const lightRed = rgb(239, 41, 41)
export const red = rgb(204, 0, 0)
export const darkRed = rgb(164, 0, 0)

export const lightOrange = rgb(252, 175, 62)
export const orange = rgb(245, 121, 0)
export const darkOrange = rgb(206, 92, 0)


export const lightYellow = rgb(255, 233, 79)
export const yellow = rgb(237, 212, 0)
export const darkYellow = rgb(196, 160, 0)

export const lightGreen = rgb(138, 226, 52)
export const green = rgb(115, 210, 22)
export const darkGreen = rgb(78, 154, 6)

export const lightBlue  = rgb(114, 159, 207)
export const blue = rgb(52, 101, 164)
export const darkBlue  = rgb(32, 74, 135)

export const lightPurple = rgb(173, 127, 168)
export const purple = rgb(117, 80, 123)
export const darkPurple = rgb(92, 53, 102)

export const lightBrown = rgb(233, 185, 110)
export const brown = rgb(193, 125, 17)
export const darkBrown = rgb(143, 89, 2)

export const black = rgb(0, 0, 0)
export const white = rgb(255, 255, 255)

export const lightGrey = rgb(238, 238, 236)
export const grey = rgb(211, 215, 207)
export const darkGrey = rgb(186, 189, 182)


export const lightCharcoal = rgb(136, 138, 133)
export const charcoal = rgb(85, 87, 83)
export const darkCharcoal = rgb(46, 52, 54)
