import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScriptActionComponent } from './script-action.component';

describe('ScriptActionComponent', () => {
  let component: ScriptActionComponent;
  let fixture: ComponentFixture<ScriptActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScriptActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScriptActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
