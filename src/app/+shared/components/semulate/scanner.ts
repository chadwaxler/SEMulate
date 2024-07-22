import p5 from 'p5';

export class Scanner {
  private _p: p5;
  scannerWidth = 20;
  private _canvasWidth: number;
  private _xPosition = 0;
  private _step: number = 1;
  private _detections: number[] = [];

  constructor(p: p5, canvasWidth: number, step = 1) {
    this._p = p;
    this._canvasWidth = canvasWidth;
    this._detections = Array.from({ length: this._canvasWidth }, () => 0);
    this._xPosition = 0;
    this._step = step;
  }

  draw() {
    const w = this.scannerWidth / 2;
    this._p.fill(255);
    this._p.triangle(
      this._xPosition - w,
      0,
      this._xPosition + w,
      0,
      this._xPosition,
      50,
    );
  }

  increment() {
    this._xPosition += this._step;
    if (this._xPosition > this._canvasWidth) {
      this._xPosition = 0;
    }
  }

  setDetectionCount(index: number, value: number) {
    this._detections[index] = value;
  }

  public get xPosition() {
    return this._xPosition;
  }

  public get detections() {
    return this._detections;
  }
}
