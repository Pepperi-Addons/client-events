import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PepperiListContComponent } from './pepperi-list.component';

describe('PepperiListComponent', () => {
  let component: PepperiListContComponent;
  let fixture: ComponentFixture<PepperiListContComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PepperiListContComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PepperiListContComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
