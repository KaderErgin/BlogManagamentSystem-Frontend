import { Routes } from '@angular/router';
import { MainComponent } from './shared/components/main/main.component';
import { BlogPostComponent } from './features/blogPost/pages/blogPost/blogPost.component';
import { BlogPostUserComponent } from './features/blogPost-User/pages/blogPost-User/blogPostUser.component';
import { BlogPostAdminComponent } from './features/blogPost-Admin/pages/blogPost-Admin/blogPostAdmin.component';
import {EditUsersComponent} from './features/edit-users/pages/edit-users/edit-users.component'
import { NotfoundComponent } from './shared/components/notfound/notfound.component';
import { LoginComponent } from './shared/components/authentication/login/login.component';
import { RegisterComponent } from './shared/components/authentication/register/register.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { ProfileComponent } from './shared/components/profile/profile/profile.component';
import { ProfileAdminComponent } from './shared/components/profile-admin/profile-admin/profile-admin.component';
import { roleGuard } from './guards/role.guard';
import { EditProfileComponent } from './features/edit-profile/pages/edit-profile/edit-profile.component';

export const routes: Routes = 
[
    { path: '', component: MainComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    {path:'blogPost',component:BlogPostComponent},
   
  

    {path:'profile',component:ProfileComponent,children:[
    {path:'blogPost',component:BlogPostUserComponent},
    {path:'edit-profile',component:EditProfileComponent},
    ]},
    {path:'profile-admin',component:ProfileAdminComponent,canActivate: [roleGuard], data: { requiredRoles: ['Admin']},children:[
        {path:'edit-user',component:EditUsersComponent},
        {path:'blog-post',component:BlogPostAdminComponent},
        {path:'edit-profile',component:EditProfileComponent},
    ]},

    { path: '**', component: NotfoundComponent },
];
