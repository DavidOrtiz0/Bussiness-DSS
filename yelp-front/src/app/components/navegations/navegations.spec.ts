import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Navegations } from './navegations';

describe('Navegations', () => {
  let component: Navegations;
  let fixture: ComponentFixture<Navegations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Navegations]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Navegations);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
