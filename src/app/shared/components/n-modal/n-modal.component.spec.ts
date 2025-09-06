import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NModalComponent } from './n-modal.component';

describe('NModalComponent', () => {
  let component: NModalComponent;
  let fixture: ComponentFixture<NModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});