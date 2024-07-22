import p5 from 'p5';

/**
 * The Scanner class represents a scanning mechanism in a simulation environment.
 * It is responsible for drawing a scanner shape on a canvas, incrementing its position,
 * and managing detection counts at various positions across the canvas.
 *
 * Attributes:
 * - _p: A p5 instance used for drawing on the canvas.
 * - _canvasWidth: The width of the canvas on which the scanner operates.
 * - _detections: An array to keep track of detection counts at different positions.
 * - _xPosition: The current x position of the scanner on the canvas.
 */
export class Scanner {
  private readonly _p: p5;
  private readonly _canvasWidth: number;
  private readonly _detections: number[] = [];
  private _xPosition = 0;

  constructor(p: p5, canvasWidth: number) {
    this._p = p;
    this._canvasWidth = canvasWidth;
    this._detections = Array.from({ length: this._canvasWidth }, () => 0);
    this._xPosition = 0;
  }

  public draw(): void {
    const center = this._xPosition;
    const halfScannerWidth = 10;
    const scannerHeight = 50;
    this._p.fill(255);
    this._p.triangle(
      center - halfScannerWidth,
      0,
      center + halfScannerWidth,
      0,
      center,
      scannerHeight,
    );
  }

  public increment(): void {
    this._xPosition++;
    if (this._xPosition > this._canvasWidth) {
      this._xPosition = 0;
    }
  }

  public setDetectionCount(index: number, value: number): void {
    this._detections[index] = value;
  }

  public get xPosition(): number {
    return this._xPosition;
  }

  public get detections(): number[] {
    return [...this._detections];
  }
}
