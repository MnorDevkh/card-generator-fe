import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentLookup } from './student-lookup';

describe('StudentLookup', () => {
  let component: StudentLookup;
  let fixture: ComponentFixture<StudentLookup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentLookup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentLookup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
