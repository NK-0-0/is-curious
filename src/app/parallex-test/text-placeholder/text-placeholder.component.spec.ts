import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextPlaceholderComponent } from './text-placeholder.component';

describe('TextPlaceholderComponent', () => {
  let component: TextPlaceholderComponent;
  let fixture: ComponentFixture<TextPlaceholderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextPlaceholderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TextPlaceholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
