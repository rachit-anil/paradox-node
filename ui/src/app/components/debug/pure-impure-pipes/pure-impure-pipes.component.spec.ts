import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PureImpurePipesComponent } from './pure-impure-pipes.component';

describe('PureImpurePipesComponent', () => {
  let component: PureImpurePipesComponent;
  let fixture: ComponentFixture<PureImpurePipesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PureImpurePipesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PureImpurePipesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
