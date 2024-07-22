import p5 from 'p5';

export interface LineRegion {
  x1: number;
  x2: number;
}

/**
 * This class is responsible for creating the geometry of lines on a canvas.
 * The geometry consists of a series of elevated features (lines) separated by flat substrate areas.
 * The number of lines (`numLines`) determines the pattern of these features.
 *
 * For example, with `numLines = 3`, the pattern is visualized as follows:
 *
 *     _____       _____       _____
 *    |     |     |     |     |     |
 * ___|     |_____|     |_____|     |____
 *
 * Each line represents an elevated feature, and the spaces in between represent the substrate.
 */
export class GeometryLines {
  private readonly _p: p5;
  private readonly _featureHeight = 100;
  private readonly _canvasWidth: number;
  private readonly _canvasHeight: number;
  private readonly _substrate: number;
  private _numLines = 2;
  private _featureWidth: number;
  private _lineRegions: LineRegion[] = [];

  constructor(p: p5, canvasWidth: number, canvasHeight: number) {
    this._p = p;
    this._canvasWidth = canvasWidth;
    this._canvasHeight = canvasHeight;
    this._featureWidth = this._canvasWidth / (this._numLines * 2 + 1);
    this._substrate = this._canvasHeight / 1.25;
  }

  /**
   * Draws the geometry of lines on a canvas, representing elevated features separated by flat substrate areas.
   * This method initializes the line regions array, calculates the width (`w`) and height (`h`) for the features,
   * and iterates through the number of lines to draw the sides, tops, and bottoms of each line.
   *
   * The drawing process is divided into three main parts:
   * 1. Drawing the sides of each line feature.
   * 2. Drawing the tops of the line features to create the elevated effect.
   * 3. Drawing the bottoms of the spaces between line features, representing the substrate.
   *
   * Each part uses the p5.js `line` method to draw lines on the canvas based on calculated positions.
   */
  public draw(): void {
    this._lineRegions = [];

    const w = this._featureWidth;

    // Height from the substrate to the top of the feature
    const h = this._substrate - this._featureHeight;

    // Draw line sides
    for (let i = 0; i < this._numLines * 2; i++) {
      this._p.line(w * (i + 1), this._substrate, w * (i + 1), h);
    }

    // Draw line tops
    for (let i = 0; i < this._numLines * 2; i += 2) {
      this._p.line(w * (i + 1), h, w * (i + 2), h);
      this._lineRegions.push({ x1: w * (i + 1), x2: w * (i + 2) });
    }

    // Draw line bottoms
    for (let i = 0; i < this._numLines * 2 + 1; i += 2) {
      this._p.line(w * i, this._substrate, w * (i + 1), this._substrate);
    }
  }

  public getYGeometry(xPosition: number): number {
    const lineRegion = this.findLineRegion(xPosition);
    if (lineRegion) {
      return this._substrate - this._featureHeight;
    }
    return this._substrate;
  }

  /**
   * Determines if a given point (x, y) is within the material based on its position relative to the substrate and features.
   *
   * Keep in mind that, for p5.js, the origin (0, 0) is at the top-left corner of the canvas. The y-axis increases downwards.
   *
   * The method checks three conditions to determine if the point is in the material:
   * 1. If the y-coordinate is greater than the substrate level, the point is considered to be within the material.
   * 2. If the y-coordinate is less than the height of the features above the substrate, the point is not in the material.
   * 3. If the point's x-coordinate falls within the x-coordinates of any line region (representing a feature),
   *    and its y-coordinate is between the substrate and the feature height, the point is considered to be within the material.
   *
   * @param x The x-coordinate of the point to check.
   * @param y The y-coordinate of the point to check.
   * @returns {boolean} True if the point is within the material, false otherwise.
   */
  public isPointInMaterial(x: number, y: number): boolean {
    // If below (i.e. greater than) the substrate, then it is in the material
    if (y > this._substrate) {
      return true;
    }

    // If above (i.e. less than) the feature height, then it is not in the material
    if (y < this._substrate - this._featureHeight) {
      return false;
    }

    const lineRegion = this.findLineRegion(x);

    if (lineRegion) {
      return true;
    }

    return false;
  }

  public set numLines(value: number) {
    this._numLines = value;
    this._featureWidth = this._canvasWidth / (this._numLines * 2 + 1);
  }

  private findLineRegion(xPosition: number): LineRegion | undefined {
    return this._lineRegions.find(
      (lineRegion) => xPosition > lineRegion.x1 && xPosition < lineRegion.x2,
    );
  }
}
