import p5 from 'p5';

/**
 * The InteractionVolume class represents a circular area within a simulation environment,
 * primarily used for interactions within a specified volume. It is capable of drawing itself
 * as a circle on a canvas and generating random points within its area, simulating random
 * interactions within its bounds.
 *
 * Attributes:
 * - _p: A p5 instance used for drawing on the canvas.
 * - _r: The radius of the interaction volume.
 * - _x, _y: The x and y coordinates of the center of the interaction volume.
 */
export class InteractionVolume {
  private readonly _p: p5;
  private readonly _r: number;
  private readonly _x: number;
  private readonly _y: number;

  constructor(p: p5, x: number, y: number, depth: number, radius: number) {
    this._p = p;
    this._x = x;
    this._r = radius;
    this._y = y + depth + radius;
  }

  public draw(): void {
    this._p.fill('#fff');
    this._p.circle(this._x, this._y, 2 * this._r);
  }

  get randomPoint(): [number, number] {
    const angle = this._p.random(this._p.TWO_PI);
    const randomRadius = this._r * this._p.sqrt(this._p.random());
    const x = this._x + randomRadius * this._p.cos(angle);
    const y = this._y + randomRadius * this._p.sin(angle);
    return [x, y];
  }
}
