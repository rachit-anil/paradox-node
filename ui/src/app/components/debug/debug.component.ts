import {ChangeDetectionStrategy, Component, OnInit, signal, viewChild} from '@angular/core';
import {MatMenuModule} from "@angular/material/menu";
import {MatButtonModule} from "@angular/material/button";
import {CommonModule} from "@angular/common";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {DebugZoneJsComponent} from "./debug-zone-js/debug-zone-js.component";
import {DebugChangeDetectionComponent} from "./debug-change-detection/debug-change-detection.component";


@Component({
  selector: 'app-debug',
  standalone: true,
  imports: [
      DebugZoneJsComponent,
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
  ],
  templateUrl: './debug.component.html',
  styleUrl: './debug.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DebugComponent {

}
