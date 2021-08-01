import { Component, OnInit } from '@angular/core';
import { Color, Engine } from 'excalibur';
import { GridService } from './grid.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  engine: Engine | undefined;

  constructor(private gridService: GridService) {
    gridService.initializeGrid();
  }

  async ngOnInit() {
    this.engine = new Engine({
      width: 800,
      height: 600,
      canvasElementId: 'bp-canvas',
      backgroundColor: Color.fromHex('323232'),
    });

    this.gridService.getGridItems().forEach((block) => {
      this.engine!.add(block);
    });

    await this.engine.start();
  }
}
