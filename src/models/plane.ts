import { Block, BlockStates } from './block';
import { vec } from 'excalibur';
import { BehaviorSubject } from 'rxjs';

export enum PlaneStates {
  HOVER = 'hover',
  INVALID = 'invalid',
  PLANE_SET = 'plane_set',
  PLANE_HIT = 'plane_hit',
}

export const layoutMatrix = [
  [0, 0, 1, 0, 0],
  [1, 1, 1, 1, 1],
  [0, 0, 1, 0, 0],
  [0, 1, 1, 1, 0],
];

export const anchor = vec(2, 1);

export class Plane {
  blocks: Block[];
  _state: BehaviorSubject<PlaneStates> = new BehaviorSubject<PlaneStates>(PlaneStates.HOVER);

  constructor() {
    this.blocks = [];
  }

  addBlock(block: Block) {
    this.blocks.push(block);
  }

  setBlocks(blocks: Block[]) {
    this.blocks = blocks;
  }

  setState(state: PlaneStates) {
    this._state.next(state);

    this.notifyBlocks();
  }

  notifyBlocks() {
    this.blocks.forEach((block) => {
      switch (this._state.value) {
        case PlaneStates.HOVER:
          block.setState(BlockStates.HOVER_PASSIVE);
          break;
        case PlaneStates.INVALID:
          block.setState(BlockStates.INVALID);
          break;
        default:
          block.setState(BlockStates.IDLE);
      }
    });
  }

  toString() {
    return this.blocks.map((block) => block.toString());
  }
}
