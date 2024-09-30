import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewmainorderComponent } from './viewmainorder.component';

describe('ViewmainorderComponent', () => {
  let component: ViewmainorderComponent;
  let fixture: ComponentFixture<ViewmainorderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewmainorderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewmainorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
