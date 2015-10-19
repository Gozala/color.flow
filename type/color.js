/* @flow */

import {Int, Float} from "./core"

export type RGBA = {
  type: "Color.RGBA",
  red: Int,
  green: Int,
  blue: Int,
  alpha: Float
}

export type HSLA = {
  type: "Color.HSLA",
  hue: Float,
  saturation: Float,
  lightness: Float,
  alpha: Float
}

export type Color
  = RGBA
  | HSLA


// ## Creation

// Create RGB colors from numbers between 0 and 255 inclusive.
export type rgb = (red:Int, green:Int, blue:Int) => Color


// Create RGB colors with an alpha component for transparency.
// The alpha component is specified with numbers between 0 and 1.
export type rgba = (red:Int, green:Int, blue:Int, alpha:Float) => Color


// Create [HSL colors](http://en.wikipedia.org/wiki/HSL_and_HSV)
// with an alpha component for transparency. This gives you access to colors
// more like a color wheel, where all hues are aranged in a circle that you
// specify with angles (radians).
//
// red = hsl(degrees(0), 1, 0.5)
// green = hsl(degrees(120), 1, 0.5)
// blue  = hsl(degrees(240), 1, 0.5)
//
// pastelRed = hsl(degrees(0), 0.7, 0.7)
//
// To cycle through all colors, just cycle through degrees. The saturation
// level is how vibrant the color is, like a dial between grey and bright
// colors. The lightness level is a dial between white and black.
export type hsl = (hue:Float, saturation:Float, lightness:Float) =>
  Color

// Create [HSL colors](http://en.wikipedia.org/wiki/HSL_and_HSV)
// with an alpha component for transparency.
export type hsla = (hue:Float, saturation:Float, lightness:Float, alpha:Float) =>
  Color

// Produce a gray based on the input. 0 is white, 1 is black.
export type grayscale = (value:Float) => Color

// Produce a "complementary color". The two colors will
// accent each other. This is the same as rotating the hue by 180&deg;
export type complement = (color:Color) => Color

// ## Extracting Colors

// Extract the components of a color in the RGB format.
export type toRGB = (color:Color) => RGBA

// Extract the components of a color in the HSL format.
export type toHSL = (color:Color) => HSLA
