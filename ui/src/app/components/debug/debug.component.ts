import {
  AfterContentInit, AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef, NgZone,
  OnInit,
  signal,
  ViewChild,
  viewChild
} from '@angular/core';
import {MatMenuModule} from "@angular/material/menu";
import {MatButtonModule} from "@angular/material/button";
import {CommonModule} from "@angular/common";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {DebugChangeDetectionComponent} from "./debug-change-detection/debug-change-detection.component";
import {PureImpurePipesComponent} from "./pure-impure-pipes/pure-impure-pipes.component";
import {LifeCycleHooksComponent} from "./life-cycle-hooks/life-cycle-hooks.component";
import {
  TemplateRenderingMechanismsComponent
} from "./template-rendering-mechanisms/template-rendering-mechanisms.component";
import {RxjsComponent} from "./rxjs/rxjs.component";


@Component({
  selector: 'app-debug',
  standalone: true,
  imports: [
      LifeCycleHooksComponent,
      DebugChangeDetectionComponent,
    MatSidenavModule,
    MatMenuModule,
    CommonModule,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    PureImpurePipesComponent,
    TemplateRenderingMechanismsComponent,
    RxjsComponent
  ],
  templateUrl: './debug.component.html',
  styleUrl: './debug.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DebugComponent implements OnInit, AfterViewInit{
  @ViewChild('cdComponent') cdComponent!: LifeCycleHooksComponent;
  fakeInputProperty = ['hello'];
  fakeFruits = [
    {name: 'apple', qty: 2},
    {name: 'grapes', qty: 3},
    {name: 'mango', qty: 4},
  ];
constructor(private ngZone: NgZone) {
}
  changeFakeInputPropertyReference(){
    this.fakeInputProperty = ['hi'];
  }

  changeNestedValueInInputProperty(){
    this.fakeFruits[1].qty+= 1;
    // setTimeout(()=>{
    // this.ngZone.runOutsideAngular(() => {
    //   this.cdComponent.cdRef.markForCheck();
    // });

    // },2000);
  }

  ngAfterViewInit(): void {
    // console.log(this.cdComponent);
  }

  ngOnInit(): void {
  }
}
