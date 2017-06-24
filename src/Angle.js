/* @flow */

import type { Int, Float } from "./Number"

export const turns = (n: Float): Float => 2 * Math.PI * n

export const degrees = (n: Float): Float => n * Math.PI / 180
