import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebugChangeDetectionComponent } from './debug-change-detection.component';

describe('DebugChangeDetectionComponent', () => {
  let component: DebugChangeDetectionComponent;
  let fixture: ComponentFixture<DebugChangeDetectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DebugChangeDetectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DebugChangeDetectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
