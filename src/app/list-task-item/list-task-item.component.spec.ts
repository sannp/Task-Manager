import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListTaskItemComponent } from './list-task-item.component';

describe('ListTaskItemComponent', () => {
  let component: ListTaskItemComponent;
  let fixture: ComponentFixture<ListTaskItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListTaskItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListTaskItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
