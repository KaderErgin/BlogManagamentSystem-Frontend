import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NavbarService } from '../../../services/navbar/navbar.service';
import { TokenService } from '../../../core/services/token.service';
import { switchMap } from 'rxjs';
import { UserService } from '../../../services/user/user.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JwtService } from '../../../services/jwt/jwt.service';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet,ReactiveFormsModule,FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  navbarService=inject(NavbarService)
  tokenService=inject(TokenService)
  userService = inject(UserService)
  jwtService = inject(JwtService)
  hamburgerMenuOpen = false;
  isMenuOpen = false;
  isHovered: boolean[] = [false, false, false];
  isLoggedIn: boolean = false;
  userId: any;
  notificationId:any;
  notifications: any[] = [];
  showPopup: boolean = false;
  searchTerm: string = '';
  searchedItems:any[] = [];

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  onHover(index: number, isHover: boolean) {
    this.isHovered[index] = isHover;
  }
 
  @Output() materialTypeSelected = new EventEmitter<string>();
  constructor(
    private router: Router,
  ) { }
  
  roleCheck() {
    const token= this.tokenService.getToken();
    const decodedJwt = this.jwtService.getDecodedAccessToken(token!);
    const roles:string[] = decodedJwt["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    let isAdmin = false;
    if(roles==undefined){
      this.router.navigate(['profile/edit-profile'])
    }
    else{
         roles.forEach(item => {
        if (item == "Admin") {
            isAdmin = true;
        }
    });

    if (isAdmin) {
        this.router.navigate(['profile-admin/edit-profile']);
    } else {
        this.router.navigate(['profile/edit-profile']);
    }
    }}

checkToken() {
  const token = this.tokenService.getToken();
  if (token) {
    this.isLoggedIn = true;
  }
}
ngOnInit() {
  this.userService.getUser().pipe(
   
     
   
    
  );
  this.navbarService.isLoggedIn.subscribe(isLoggedIn => {
    this.isLoggedIn = isLoggedIn;
  });
  this.checkToken()
  };



  showNotificationPopup() {
    this.showPopup = true;
  }

  closeNotificationPopup() {
    this.showPopup = false;
  }
}
