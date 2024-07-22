import p5 from 'p5';

const DEPTH = 20;
const RADIUS = 10;

export class AreaOfEffect {
  private _p: p5;
  private _r: number;
  private _x: number;
  private _y: number;

  constructor(p: p5, x: number, y: number, depth = DEPTH, radius = RADIUS) {
    this._p = p;
    this._x = x;
    this._r = radius;
    this._y = y + depth + radius;
  }

  draw() {
    this._p.fill('#fff');
    this._p.circle(this._x, this._y, 2 * this._r);
  }

  get randomPoint() {
    const angle = this._p.random(this._p.TWO_PI);
    const randomRadius = this._r * this._p.sqrt(this._p.random());
    const x = this._x + randomRadius * this._p.cos(angle);
    const y = this._y + randomRadius * this._p.sin(angle);
    return [x, y];
  }
}
