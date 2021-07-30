import { Actor, Color } from 'excalibur';
import { ActorArgs } from 'excalibur/dist/Actor';

export enum BlockStates {
  IDLE,
  HOVER,
  PLANE_SET,
  PLANE_HIT,
}

export const BlockColors: { [k in BlockStates]: Color } = {
  [BlockStates.IDLE]: Color.LightGray,
  [BlockStates.HOVER]: Color.Azure,
  [BlockStates.PLANE_SET]: Color.Chartreuse,
  [BlockStates.PLANE_HIT]: Color.DarkGray,
};

export class Block extends Actor {
  state = BlockStates.IDLE;
  constructor(config: ActorArgs) {
    super(config);

    this.initBlock();
  }

  initBlock() {
    this.color = this.blockColor;
  }

  get blockColor() {
    return BlockColors[this.state];
  }
}
