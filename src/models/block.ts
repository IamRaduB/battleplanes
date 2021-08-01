import { Actor, ActorArgs, Color, Engine } from 'excalibur';
import { BehaviorSubject, Observable } from 'rxjs';

export enum BlockStates {
  IDLE = 'idle',
  HOVER_ACTIVE = 'hover_active',
  HOVER_PASSIVE = 'hover_passive',
  INVALID = 'invalid',
  PLANE_SET = 'plane_set',
  PLANE_HIT = 'plane_hit',
}

export const BlockColors: { [k in BlockStates]: Color } = {
  [BlockStates.IDLE]: Color.fromHex('8CBCFA'),
  [BlockStates.HOVER_ACTIVE]: Color.fromHex('EEFABE'),
  [BlockStates.HOVER_PASSIVE]: Color.fromHex('EEFABE'),
  [BlockStates.INVALID]: Color.fromHex('6A87AD'),
  [BlockStates.PLANE_SET]: Color.fromHex('EEFABE'),
  [BlockStates.PLANE_HIT]: Color.DarkGray,
};

export class Block extends Actor {
  _state: BehaviorSubject<BlockStates> = new BehaviorSubject<BlockStates>(BlockStates.IDLE);

  constructor(config: ActorArgs, private coordX: number, private coordY: number) {
    super(config);
  }

  onInitialize(_engine: Engine) {
    this.enableCapturePointer = true;
    this.capturePointer.captureMoveEvents = true;
    this.handleEvents();
  }

  handleEvents() {
    this.on('pointerenter', (ev) => {
      this.setState(BlockStates.HOVER_ACTIVE);
    });

    this.on('pointerleave', (ev) => {
      this.setState(BlockStates.IDLE);
    });

    this.on('pointerup', (ev) => {
      this.setState(BlockStates.PLANE_SET);
    });
  }

  onPostDraw(_ctx: CanvasRenderingContext2D, _delta: number) {
    this.color = this.blockColor;
  }

  get blockColor() {
    return BlockColors[this._state.value];
  }

  get state(): Observable<BlockStates> {
    return this._state.asObservable();
  }

  setState(state: BlockStates) {
    if ([BlockStates.PLANE_SET, BlockStates.PLANE_HIT].includes(this._state.value)) {
      return;
    }
    this._state.next(state);
  }

  get x() {
    return this.coordX;
  }

  set x(value: number) {
    this.coordX = value;
  }

  get y() {
    return this.coordY;
  }

  set y(value: number) {
    this.coordY = value;
  }

  toString() {
    return {
      x: this.x,
      y: this.y,
      state: this._state.value,
    };
  }
}
