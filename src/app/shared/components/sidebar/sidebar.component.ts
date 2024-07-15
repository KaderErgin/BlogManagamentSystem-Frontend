import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';


import { NavbarService } from '../../../services/navbar/navbar.service';
import { UserService } from '../../../services/user/user.service';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  navbarService=inject(NavbarService)
  userService=inject(UserService)
  constructor(private router: Router) {}
  username: string="";
  lastname: string="";
  getUser() {
    this.userService.getUser().subscribe((response)=>{
      this.username = response.firstName;
      this.lastname = response.lastName;
    })
  }
  ngOnInit(): void {
    this.getUser();
  }
  navigateToBlogPost() {
    this.router.navigate(['profile/blogPost']);
  }
  navigateToEditProfile() {
    this.router.navigate(['profile/edit-profile']);
  }
  navigateToSignOut() {
    this.navbarService.setLoggedIn(false)
    this.router.navigate(['/']);
    localStorage.removeItem("Token")
  }
}
