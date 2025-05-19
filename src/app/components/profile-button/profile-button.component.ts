import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserServiceService } from 'src/app/services/user-service.service';

@Component({
  selector: 'xs-profile-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-button.component.html',
  styleUrls: ['./profile-button.component.scss'],
})
export class ProfileButtonComponent {
  constructor(
    private authService: AuthService,
    private userService: UserServiceService,
    private router: Router
  ) {}
  isDropdownOpen: boolean = false;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  public logout(): void {
    const token = localStorage.getItem('token'); // Get the token from local storage
    if (token) {
      this.authService.logout().subscribe(
        () => {
          console.log('Logged out successfully', this.authService.loggedInUser);
          this.router.navigate(['/sign-in']);
          // Perform any additional actions (e.g., clear user data, navigate to login page)
        },
        (error) => {
          console.error('Logout failed:', error);
        }
      );
    }
  }
  isAdmin(): boolean {
    const roles = this.userService.getUserRoles();
    return roles ? roles.some((role) => role.name === 'ROLE_ADMIN') : false;
  }
  isLoggedIn(): boolean {
    return this.userService.isLoggedIn();
  }
}
