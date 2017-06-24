/* @flow */

import crash from "throw.flow"
import { turns, degrees } from "./Angle"
import type { Int, Float } from "./Number"

export interface RGBA {
  red: Int,
  green: Int,
  blue: Int,
  alpha: Float
}

export interface HSLA {
  hue: Float,
  saturation: Float,
  lightness: Float,
  alpha: Float
}

export type Color = RGBA | HSLA

interface Match<a> {
  RGBA: (color: RGBA) => a,
  HSLA: (color: HSLA) => a,
  rgb: (red: Int, green: Int, blue: Int) => a,
  rgba: (red: Int, green: Int, blue: Int, alpha: Float) => a,
  hsl: (hue: Float, saturation: Float, lightness: Float) => a,
  hsla: (hue: Float, saturation: Float, lightness: Float, alpha: Float) => a,
  _: () => a
}

export const match = <a>(match: Match<a>): ((value: mixed) => a) => value => {
  if (value instanceof HSLAColor) {
    return match.HSLA(value)
  } else if (value instanceof RGBAColor) {
    return match.RGBA(value)
  } else if (value == null) {
    return match._()
  } else if (typeof value === "object") {
    const { red, green, blue, alpha, hue, saturation, lightness } = value
    if (
      typeof red === "number" &&
      typeof green === "number" &&
      typeof blue === "number"
    ) {
      if (typeof alpha === "number") {
        return match.rgba(red, green, blue, alpha)
      } else {
        return match.rgb(red, green, blue)
      }
    } else if (
      typeof hue === "number" &&
      typeof saturation === "number" &&
      typeof lightness === "number"
    ) {
      if (typeof alpha === "number") {
        return match.hsla(hue, saturation, lightness, alpha)
      } else {
        return match.hsl(hue, saturation, lightness)
      }
    }
  }

  return match._()
}

class RGBAColor implements RGBA {
  red: Int
  green: Int
  blue: Int
  alpha: Float

  constructor(red: Int, green: Int, blue: Int, alpha: Float) {
    this.red = red
    this.green = green
    this.blue = blue
    this.alpha = alpha
  }

  static complement(red: Int, green: Int, blue: Int, alpha: Float): Color {
    const { hue, saturation, lightness } = rgba2hsla(red, green, blue, alpha)
    return HSLAColor.complement(hue, saturation, lightness, alpha)
  }
}

class HSLAColor implements HSLA {
  hue: Float
  saturation: Float
  lightness: Float
  alpha: Float

  constructor(hue: Float, saturation: Float, lightness: Float, alpha: Float) {
    this.hue = hue
    this.saturation = saturation
    this.lightness = lightness
    this.alpha = alpha
  }

  static complement(
    hue: Float,
    saturation: Float,
    lightness: Float,
    alpha: Float
  ): HSLA {
    return new HSLAColor(hue + degrees(180), saturation, lightness, alpha)
  }
}

// Create RGB colors with an alpha component for transparency.
// The alpha component is specified with numbers between 0 and 1
export const rgba = (red: Int, green: Int, blue: Int, alpha: Float): RGBA =>
  new RGBAColor(red, green, blue, alpha)

// Create RGB colors from numbers between 0 and 255 inclusive
export const rgb = (red: Int, green: Int, blue: Int): RGBA =>
  new RGBAColor(red, green, blue, 1)

/**
 * Create [HSL colors](http://en.wikipedia.org/wiki/HSL_and_HSV)
 * with an alpha component for transparency.
 */
export const hsla = (
  hue: Float,
  saturation: Float,
  lightness: Float,
  alpha: Float
): HSLA =>
  new HSLAColor(
    hue - turns(Math.floor(hue / (2 * Math.PI))),
    saturation,
    lightness,
    alpha
  )

/**
 * Create [HSL colors](http://en.wikipedia.org/wiki/HSL_and_HSV). This gives
 * you access to colors more like a color wheel, where all hues are aranged in a
 * circle that you specify with angles (radians).
 * 
 * ```js
 * const red = hsl(degrees(0), 1, 0.5)
 * const green = hsl(degrees(120), 1, 0.5)
 * const blue = hsl(degrees(240), 1, 0.5)
 * const pastelRed = hsl(degrees(0), 0.7, 0.7)
 * ```
 * 
 * To cycle through all colors, just cycle through degrees. The saturation level
 * is how vibrant the color is, like a dial between grey and bright colors. The
 * lightness level is a dial between white and black.
 */
export const hsl = (hue: Float, saturation: Float, lightness: Float): HSLA =>
  hsla(hue, saturation, lightness, 1)

/**
 * Produce a gray based on the input. 0 is white, 1 is black.
 */
export const grayscale = (value: Float): Color =>
  new HSLAColor(0, 0, 1 - value, 1)

const fmod = (f: Float, n: Int): Float => {
  const integer = Math.floor(f)
  return integer % n + f - integer
}

/**
 * ## Built-in Colors
 * 
 * These colors come from the [Tango palette](http://tango.freedesktop.org/Tango_Icon_Theme_Guidelines)
 * which provides aesthetically reasonable defaults for colors. Each color also
 * comes with a light and dark version.
 */
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

export const lightBlue = rgb(114, 159, 207)
export const blue = rgb(52, 101, 164)
export const darkBlue = rgb(32, 74, 135)

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

const hsla2rgba = (
  hue: Float,
  saturation: Float,
  lightness: Float,
  alpha: Float
): RGBA => {
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation
  const h = hue / degrees(60)
  const x = chroma * (1 - Math.abs(fmod(h, 2 - 1)))

  const [r, g, b] = h < 0
    ? [0, 0, 0]
    : h < 1
      ? [chroma, x, 0]
      : h < 2
        ? [x, chroma, 0]
        : h < 3
          ? [0, chroma, x]
          : h < 4
            ? [0, x, chroma]
            : h < 5 ? [x, 0, chroma] : h < 6 ? [chroma, 0, x] : [0, 0, 0]

  const m = lightness - chroma / 2

  const color = new RGBAColor(
    Math.round(255 * (r + m)),
    Math.round(255 * (g + m)),
    Math.round(255 * (b + m)),
    alpha
  )

  return color
}

const rgba2hsla = (red: Int, green: Int, blue: Int, alpha: Float): HSLA => {
  const [r, g, b] = [red / 255, green / 255, blue / 255]
  const max = Math.max(Math.max(r, g), b)
  const min = Math.min(Math.min(r, g), b)
  const delta = max - min

  const h = max === r
    ? fmod((g - b) / delta, 6)
    : max === g ? (b - r) / delta + 2 : (r - g) / delta + 4
  const hue = degrees(60) * h

  const lightness = (max + min) / 2
  const saturation = lightness === 0
    ? 0
    : delta / (1 - Math.abs(2 * lightness - 1))

  return new HSLAColor(hue, lightness, saturation, alpha)
}

/**
 * Convert given color into the HSL format.
 */
export const toHSL: (color: Color) => HSLA = match({
  RGBA: ({ red, green, blue, alpha }) => rgba2hsla(red, green, blue, alpha),
  rgba: rgba2hsla,
  rgb: (red, green, blue) => rgba2hsla(red, green, blue, 1),
  HSLA: hsla => hsla,
  hsla: hsla,
  hsl: hsl,
  _: crash
})

/**
 * Convert given color into the RGB format.
 */
export const toRGB: (color: Color) => RGBA = match({
  HSLA: ({ hue, saturation, lightness, alpha }) =>
    hsla2rgba(hue, saturation, lightness, alpha),
  hsla: hsla2rgba,
  hsl: (hue, saturation, lightness) => hsla2rgba(hue, saturation, lightness, 1),
  RGBA: rgba => rgba,
  rgba: rgba,
  rgb: rgb,
  _: crash
})

/**
 * Produce a "complementary color". The two colors will
 * accent each other. This is the same as rotating the hue by 180deg;
 */
export const complement: (color: Color) => Color = match({
  HSLA: ({ hue, saturation, lightness, alpha }) =>
    HSLAColor.complement(hue, saturation, lightness, alpha),
  hsla: HSLAColor.complement,
  hsl: (hue, saturation, lightness) =>
    HSLAColor.complement(hue, saturation, lightness, 1),
  RGBA: ({ red, green, blue, alpha }) =>
    RGBAColor.complement(red, green, blue, alpha),
  rgba: RGBAColor.complement,
  rgb: (red, green, blue) => RGBAColor.complement(red, green, blue, 1),
  _: crash
})
