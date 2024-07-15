import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BlogPostUserComponent } from './blogPostUser.component';


describe('BlogPostComponent', () => {
  let component: BlogPostUserComponent;
  let fixture: ComponentFixture<BlogPostUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogPostUserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BlogPostUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
