import {AfterContentInit, Component, ContentChild, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'template-rendering-mechanisms',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './template-rendering-mechanisms.component.html',
  styleUrl: './template-rendering-mechanisms.component.scss'
})
export class TemplateRenderingMechanismsComponent implements OnInit, OnDestroy, AfterContentInit {
  @ContentChild('contentChild') contentChild!: ElementRef;
  showConsoleLogs= true;

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  ngAfterContentInit(): void {
    if(this.showConsoleLogs) console.log(this.contentChild);
  }
}
