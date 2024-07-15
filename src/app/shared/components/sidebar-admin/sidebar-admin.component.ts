import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarService } from '../../../services/navbar/navbar.service';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'app-sidebar-admin',
  standalone: true,
  imports: [],
  templateUrl: './sidebar-admin.component.html',
  styleUrl: './sidebar-admin.component.css'
})
export class SidebarAdminComponent {
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
    this.router.navigate(['profile-admin/blog-post']);
  }

  navigateToEditProfile() {
    this.router.navigate(['profile-admin/edit-profile']);
  }

  navigateToEditUser() {
    this.router.navigate(['profile-admin/edit-user']);
  }

  navigateToSignOut() {
    this.navbarService.setLoggedIn(false)
    this.router.navigate(['/']);
    localStorage.removeItem("Token")
  }
}
