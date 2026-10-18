import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StickersMemesComponent } from './stickers-memes.component';

describe('StickersMemesComponent', () => {
  let component: StickersMemesComponent;
  let fixture: ComponentFixture<StickersMemesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StickersMemesComponent]
    });
    fixture = TestBed.createComponent(StickersMemesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
