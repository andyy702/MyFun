import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatesComponent } from './mates.component';

describe('MatesComponent', () => {
  let component: MatesComponent;
  let fixture: ComponentFixture<MatesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MatesComponent]
    });
    fixture = TestBed.createComponent(MatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
