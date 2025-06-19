import {ChangeDetectionStrategy, ChangeDetectorRef, Component, DoCheck} from '@angular/core';
import {ImpurePipe} from "./pipes/impure.pipe";
import {PurePipe} from "./pipes/pure.pipe";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'pure-impure-pipes',
  standalone: true,
  imports: [ImpurePipe, PurePipe, MatButton],
  templateUrl: './pure-impure-pipes.component.html',
  styleUrl: './pure-impure-pipes.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PureImpurePipesComponent implements DoCheck {
  time = Date.now();

  constructor(private  cdRef: ChangeDetectorRef) {
  }

  ngDoCheck() {
    // console.log('DoCheck called - Pure Impure Pipes');
  }

  detectChanges(){
    this.cdRef.detectChanges();
  }

  reassignTime(){
    this.time = Date.now();
  }
}
