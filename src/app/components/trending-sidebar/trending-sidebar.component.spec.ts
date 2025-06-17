import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrendingSidebarComponent } from './trending-sidebar.component';

describe('TrendingSidebarComponent', () => {
  let component: TrendingSidebarComponent;
  let fixture: ComponentFixture<TrendingSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrendingSidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrendingSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
