import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpBubble } from './help-bubble';

describe('HelpBubble', () => {
  let component: HelpBubble;
  let fixture: ComponentFixture<HelpBubble>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelpBubble]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpBubble);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
