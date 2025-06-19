import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateRenderingMechanismsComponent } from './template-rendering-mechanisms.component';

describe('TemplateRenderingMechanismsComponent', () => {
  let component: TemplateRenderingMechanismsComponent;
  let fixture: ComponentFixture<TemplateRenderingMechanismsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateRenderingMechanismsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemplateRenderingMechanismsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
