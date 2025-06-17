import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebugZoneJsComponent } from './debug-zone-js.component';

describe('DebugZoneJsComponent', () => {
  let component: DebugZoneJsComponent;
  let fixture: ComponentFixture<DebugZoneJsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DebugZoneJsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DebugZoneJsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
