import p5 from 'p5';

export interface LineRegion {
  x1: number;
  x2: number;
}

// Class is used to create the geometry of the lines
// This is what numLines = 3 looks like:
//     _____       _____       _____
//    |     |     |     |     |     |
// ___|     |_____|     |_____|     |____
//
export class GeometryLines {
  private _p: p5;
  private _numLines = 2;
  private _featureHeight = 100;
  private _lineRegions: LineRegion[] = [];
  private _canvasWidth: number;
  private _canvasHeight: number;
  private _featureWidth: number;
  private _substrate: number;

  constructor(p: p5, canvasWidth: number, canvasHeight: number) {
    this._p = p;
    this._canvasWidth = canvasWidth;
    this._canvasHeight = canvasHeight;
    this._featureWidth = this._canvasWidth / (this._numLines * 2 + 1);
    this._substrate = this._canvasHeight / 1.25;
  }

  draw() {
    this._lineRegions = [];

    const w = this._featureWidth;
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

  public getRegion(xPosition: number) {
    const lineRegion = this._lineRegions.find((lineRegion) => {
      return xPosition > lineRegion.x1 && xPosition < lineRegion.x2;
    });

    if (lineRegion) {
      return {
        region: 'FEATURE',
        yGeometry: this._substrate - this._featureHeight,
      };
    }

    return {
      region: 'SUBSTRATE',
      yGeometry: this._substrate,
    };
  }

  public isPointInMaterial(x: number, y: number): boolean {
    // If below (i.e. greater than) the substrate, then it is in the material
    if (y > this._substrate) {
      return true;
    }

    // If above (i.e. less than) the feature height, then it is not in the material
    if (y < this._substrate - this._featureHeight) {
      return false;
    }

    const lineRegion = this._lineRegions.find((lineRegion) => {
      return x > lineRegion.x1 && x < lineRegion.x2;
    });

    if (lineRegion) {
      return true;
    }

    return false;
  }

  public set numLines(value: number) {
    this._numLines = value;
    this._featureWidth = this._canvasWidth / (this._numLines * 2 + 1);
  }
}
