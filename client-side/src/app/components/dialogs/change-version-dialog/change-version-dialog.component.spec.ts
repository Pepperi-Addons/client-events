import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeVersionDialogComponent } from './change-version-dialog.component';

describe('ChangeVersionDialogComponent', () => {
  let component: ChangeVersionDialogComponent;
  let fixture: ComponentFixture<ChangeVersionDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeVersionDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeVersionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
