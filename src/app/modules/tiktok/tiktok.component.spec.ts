import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiktokComponent } from './tiktok.component';

describe('TiktokComponent', () => {
  let component: TiktokComponent;
  let fixture: ComponentFixture<TiktokComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TiktokComponent]
    });
    fixture = TestBed.createComponent(TiktokComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
