import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BlogPostAdminComponent } from './blogPostAdmin.component';


describe('BlogPostComponent', () => {
  let component: BlogPostAdminComponent;
  let fixture: ComponentFixture<BlogPostAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogPostAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BlogPostAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
