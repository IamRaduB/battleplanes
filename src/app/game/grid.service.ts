import { Injectable } from '@angular/core';
import { Block, BlockStates } from '../../models/block';
import { Subscription } from 'rxjs';
import { anchor, layoutMatrix, Plane, PlaneStates } from '../../models/plane';

@Injectable({ providedIn: 'root' })
export class GridService {
  size = 10;
  gutter = 2;
  blockSize = 20;
  grid: Array<Block[]>;
  hoverPlane: Plane;
  subscriptions: Subscription[];

  constructor() {
    this.grid = [];
    this.hoverPlane = new Plane();
    this.subscriptions = [];
  }

  initializeGrid() {
    // iterate through the grid cols/rows and initialize the block actor
    for (let j = 0; j < this.size; j++) {
      this.grid[j] = [];
      for (let i = 0; i < this.size; i++) {
        // provide the block with dimensions, coordinates and row-col identifiers
        const block = new Block(
          {
            width: this.blockSize,
            height: this.blockSize,
            // The block anchor point is the center of the bounding box
            // -> therefore we need to translate it by blockSize/2 in both axes
            // The gutter must be added to all block positions, except row 0/col 0
            x: this.blockSize / 2 + i * this.blockSize + (i !== 0 ? this.gutter * i : 0),
            y: this.blockSize / 2 + j * this.blockSize + (j !== 0 ? this.gutter * j : 0),
          },
          i,
          j
        );
        this.grid[j].push(block);

        // subscribe to each block's state subject to identify when the block state changes
        this.subscriptions.push(
          block.state.subscribe((state: BlockStates) => {
            this.processBlockState(block, state);
          })
        );
      }
    }
  }

  processBlockState(block: Block, state: BlockStates) {
    // when the mouse hovers over a new block
    if (state === BlockStates.HOVER_ACTIVE) {
      // first reset the previous hover plane blocks
      this.hoverPlane.blocks.forEach((block) => block.setState(BlockStates.IDLE));

      // then create the new hover plane
      this.hoverPlane = this.createHoverPlane(block);
    }
  }

  createHoverPlane(block: Block) {
    const plane: Plane = new Plane();
    let planeState = PlaneStates.HOVER;
    // iterate through the layout matrix
    console.group(`Block`, block.toString());

    layoutMatrix.forEach((row, j) => {
      // iterate through the row cells and select only the TRUE mask cells
      row.forEach((iVal, i) => {
        if (!Boolean(iVal)) {
          return;
        }
        console.log('Eligible block', i, j);
        const coordX = block.x - (anchor.x - i);
        const coordY = block.y - (anchor.y - j);

        const neighborBlock = this.getGridItems().find((b) => b.x === coordX && b.y === coordY);

        if (neighborBlock) {
          plane.addBlock(neighborBlock);
        } else {
          planeState = PlaneStates.INVALID;
        }
      });
    });

    console.groupEnd();
    plane.setState(planeState);
    return plane;
  }

  getGridItems(): Block[] {
    return this.grid.flat();
  }
}
