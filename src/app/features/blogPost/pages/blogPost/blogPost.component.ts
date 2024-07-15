import { Component, HostListener, OnInit,ViewChild,ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { token } from '../../../bms-token/services/constants';
import { TokenService } from '../../../../core/services/token.service';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '../../../jwt-service/services/jwt.service';
import { JwtTokenService } from '../../../../../jwttoken.service';
import { UserService } from '../../../../services/user/user.service';
import { BlogPost } from '../../../../models/blogPost/BlogPost';
@Component({
  selector: 'app-blogPost',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blogPost.component.html',
  styleUrls: ['./blogPost.component.css'],
})
export class BlogPostComponent implements OnInit {
  selectedIndex: number | null = null;
  BlogPost: any[] = [];
  editingBlogPost: any = null;
  isEditing: boolean = false;
  blogPosts: any[] = [];
  Comment: any[] = [];
  editingComment: any = null;
  commentContent: string = '';
  addBlogPostFormOpen: boolean = false;
  allBlogPosts: any[] = []; // Tüm blog gönderilerini saklamak için yeni bir alan
  filteredBlogPosts: BlogPost[] = []; 
  token: string = '';
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  constructor(private httpClient: HttpClient, private tokenService: TokenService,private jwtService: JwtService,JwtTokenService:JwtTokenService, private userService: UserService) {}

  ngOnInit(): void {
    this.fetchBlogPost();
  }
  toggleAddBlogPostForm(): void {
    this.addBlogPostFormOpen = !this.addBlogPostFormOpen;
  }
  addBlogPost(newBlogPost: any): void {
    const token = this.tokenService.getToken();
    if (!token) {
      console.error('Token bulunamadı.');
      return;
    }
    
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    this.userService.getUser().subscribe(
      (user: any) => {
        if (!user || !user.id) {
          console.error('UserID bulunamadı.');
          return;
        }
  
        const userId = user.id;
        const releaseDate = new Date().toISOString(); 

        const newBlogPostWithUserId = {
          ...newBlogPost,
          userId: userId,
          releaseDate:releaseDate,

        };
  
        this.httpClient.post(`http://localhost:60805/api/BlogPosts/`, newBlogPostWithUserId, { headers }).subscribe(
          (data: any) => {
            console.log('Yeni Blog Gönderisi Eklendi:', data);
            this.BlogPost.push(data); 
            this.addBlogPostFormOpen = false;
          },
          (error) => {
            console.error('Yeni Blog Gönderisi Ekleme Hatası:', error);
          }
        );
      },
      (error) => {
        console.error('Kullanıcı bilgileri alınamadı:', error);
      }
    );
    
  }
  
  

  fetchBlogPost(): void {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.httpClient
      .get('http://localhost:60805/api/BlogPosts?PageIndex=0&PageSize=12', { headers })
      .subscribe(
        (data: any) => {
          console.log('API Yanıtı:', data);
          this.BlogPost = data.items;
          this.filteredBlogPosts = data.items;

          this.BlogPost.forEach((blogPost, index) => {
            this.fetchUserDetails(blogPost.userId, index);
          });


          this.fetchComments();
        },
        (error) => {
          console.error('Blog Yazıları Getirme Hatası:', error);
        }
      );
  }

  fetchUserDetails(userId: string, postIndex: number): void {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.httpClient.get(`http://localhost:60805/api/Users/${userId}`, { headers }).subscribe(
      (data: any) => {
        console.log('Kullanıcı Detayları:', data);
        const blogPost = this.BlogPost[postIndex];
        if (blogPost) {
          blogPost.firstName = data.firstName;
          blogPost.lastName = data.lastName;
          console.log('Güncellenmiş Blog Yazısı:', blogPost);
        }
      },
      (error) => {
        console.error('Kullanıcı Detayları Getirme Hatası:', error);
      }
    );
  }

  fetchComments(): void {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.httpClient.get(`http://localhost:60805/api/Comments/?PageIndex=0&PageSize=20`, { headers }).subscribe(
      (response: any) => {
        console.log('Yorumlar:', response);
        const comments = response.items;
        this.BlogPost.forEach((blogPost, index) => {
          blogPost.comments = comments.filter((comment: any) => comment.blogPostId === blogPost.id);
          blogPost.comments.forEach((comment: any) => {
            this.fetchCommentUserDetails(comment);
          });
        });
      },
      (error) => {
        console.error('Yorumları Getirme Hatası:', error);
      }
    );
  }

  fetchCommentUserDetails(comment: any): void {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.httpClient.get(`http://localhost:60805/api/Users/${comment.userId}`, { headers }).subscribe(
      (data: any) => {
        console.log('Yorum Kullanıcı Detayları:', data);
        comment.firstName = data.firstName;
        comment.lastName = data.lastName;
      },
      (error) => {
        console.error('Yorum Kullanıcı Detayları Getirme Hatası:', error);
      }
    );
  }

  editBlogPost(blogPost: any): void {
    console.log('editBlogPost fonksiyonu çağrıldı, blogPost:', blogPost);
    if (blogPost) {
      this.editingBlogPost = { ...blogPost };
      console.log('editingBlogPost:', this.editingBlogPost);
      this.isEditing = true;
    } else {
      console.error('Düzenlenecek blog yazısı bulunamadı.');
    }
  }

  onInputChange(event: Event, field: string): void {
    const inputElement = event.target as HTMLInputElement;
    this.editingBlogPost[field] = inputElement.value;
  }

  updateBlogPost(): void {
    if (this.editingBlogPost) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      this.httpClient
        .put(`http://localhost:60805/api/BlogPosts/`, this.editingBlogPost, { headers })
        .subscribe(
          (data: any) => {
            console.log('Blog Gönderisi Güncellendi:', data);
            const index = this.BlogPost.findIndex((blog) => blog.id === this.editingBlogPost.id);
            if (index !== -1) {
              this.BlogPost[index] = { ...this.editingBlogPost };
            }
            this.isEditing = false; 
          },
          (error) => {
            console.error('Blog Gönderisi Güncelleme Hatası:', error);
          }
        );
    }
  }

  editComment(comment: any): void {
    if (comment) {
      this.editingComment = comment.id;
    } else {
      console.error('Düzenlenecek yorum bulunamadı.');
    }
  }

  updateComment(comment: any, updatedCommentContent: string): void {
    if (comment && updatedCommentContent.trim()) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      const updateData = {
        id: comment.id,
        blogPostId: comment.blogPostId,
        userId: comment.userId,
        commentDate: comment.commentDate,
        commentContent: updatedCommentContent
      };
  
      this.httpClient
        .put(`http://localhost:60805/api/Comments/`, updateData, { headers })
        .subscribe(
          (data: any) => {
            console.log('Yorum Güncellendi:', data);
  
            // Yerel olarak yorumu güncelle
            const blogPost = this.BlogPost.find(post => post.id === comment.blogPostId);
            if (blogPost) {
              const updatedComment = blogPost.comments.find((c: any) => c.id === comment.id);
              if (updatedComment) {
                updatedComment.commentContent = updatedCommentContent;
              }
            }
  
  
            this.editingComment = null;
          },
          (error) => {
            console.error('Yorum Güncelleme Hatası:', error);
  
          }
        );
    } else {
      console.error('Güncelleme için gerekli veriler eksik veya geçersiz.');
    }
  }
  

  @HostListener('document:click', ['$event'])
  clickOutside(event: any): void {
    if (!event.target.closest('.card-container')) {
      this.clearSelection();
    }
  }

  toggleSelected(event: MouseEvent, index: number): void {
    event.stopPropagation();
    this.selectedIndex = this.selectedIndex === index ? null : index;
  }

  clearSelection(): void {
    if (!this.isEditing) { 
      this.selectedIndex = null;
      this.editingBlogPost = null;
    }
  }

  

  addComment(blogPostId: string, commentInputValue: string): void {
    const token = this.tokenService.getToken();
    if (!token) {
      console.error('Token bulunamadı.');
      return;
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    this.userService.getUser().subscribe(user => {
      if (!user || !user.id) {
        console.error('UserID bulunamadı.');
        return;
      }
  
      const userId = user.id; 
      const commentDate = new Date().toISOString(); 
  
      const newComment = {
        blogPostId: blogPostId,
        userId: userId, 
        commentDate: commentDate,
        commentContent: commentInputValue.trim()
      };
  
      this.httpClient.post(`http://localhost:60805/api/Comments/`, newComment, { headers }).subscribe(
        (data: any) => {
          console.log('Yorum Eklendi:', data);
        },
        (error) => {
          console.error('Yorum Ekleme Hatası:', error);
        }
      );
    });
  }
  searchBlogPosts(searchTerm: string): void {
    if (!searchTerm) {
      this.filteredBlogPosts = [...this.BlogPost];
    } else {
      const lowerCaseSearch = searchTerm.toLowerCase();
      this.filteredBlogPosts = this.BlogPost.filter(post =>
        post.title.toLowerCase().includes(lowerCaseSearch)
      );
    }
  }
  
  

  cancelEditComment(): void {
    this.editingComment = null;
  }
  cancelEditBlogPost(): void {
  this.editingBlogPost = null;
  this.isEditing = false;
}
deleteComment(comment: any): void {
  if (!comment) {
    console.error('Silinecek yorum bulunamadı.');
    return;
  }

  const token = this.tokenService.getToken();
  if (!token) {
    console.error('Token bulunamadı.');
    return;
  }

  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  this.httpClient.delete(`http://localhost:60805/api/Comments/${comment.id}`, { headers }).subscribe(
    () => {
      console.log('Yorum başarıyla silindi:', comment);

      // Yorumun bulunduğu blog gönderisinden yorumu kaldır
      const blogPost = this.BlogPost.find(post => post.id === comment.blogPostId);
      if (blogPost) {
        blogPost.comments = blogPost.comments.filter((c: any) => c.id !== comment.id);
      }
    },
    (error) => {
      console.error('Yorum silme hatası:', error);
    }
  );
}

  
}

