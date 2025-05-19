import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserServiceService } from 'src/app/services/user-service.service';

@Component({
  selector: 'xs-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent {
  username: string = '';
  password: string = '';
  signInStatus: string | null = null; // Variable to hold the sign-in status message
  showPassword: boolean = false; // Variable to control whether to show the password or not

  constructor(
    private userService: UserServiceService,
    private authService: AuthService,
    private router: Router
  ) {}

  onSignIn(form: NgForm) {
    if (form.valid) {
      if (this.authService.getIsAuthenticated()) {
        console.log('A user is already signed in. Cannot sign in again.');
        alert("A user is already signed in. Cannot sign in again, until logged out")
        return;
      }

      const username = form.value.username;
      const password = form.value.password;

      this.authService.login(username, password).subscribe(
        (response) => {
          console.log('Sign-In successful! Welcome back.');
          this.authService.signInSuccessful();

          // Store the token in local storage and the user name in AuthService
          localStorage.setItem('token', response.token);
          this.authService.setLoggedInUser(username);

          // Fetch user information separately
          this.fetchAndSetUser(username, () => {
            this.router.navigate(['/shop-view']);
          });
        },
        (error) => {
          console.error('Sign-In failed:', error);
          // Handle incorrect email/password or other errors
          alert('Sign-In failed: Possible wrong username or password\n'+ error.message);
        }
      );
    }
  }
  private fetchAndSetUser(username: string, callback: () => void) {
    this.userService.findUserByName(username).subscribe(
      (user) => {
        this.userService.setUser(user);
        console.log('Found user:', user);
        // Set the user using UserServiceService
        callback();
      },
      (error) => {
        console.error('Error fetching user:', error);
        // Handle error
        alert(error.message);
        return;
      }
    );
  }

  onButtonClicked(event: MouseEvent) {
    const button = event.target as HTMLButtonElement;
    button.classList.add('clicked');

    setTimeout(() => {
      button.classList.remove('clicked');
    }, 200); // Remove the "clicked" class after 200ms to revert the scale
  }
}

// onSignIn(form: NgForm) {
//   // Fetch the list of users from the backend using the UserServiceService
//   this.userService.getUsers().subscribe(
//     (users) => {
//       // Log all the data from the users array retrieved from the backend
//       console.log(users);

//       // Check if the provided email and password match any of the users
//       const user = users.find(
//         (u) => u.email === this.email && u.password === this.password
//       );

//       if (user) {
//         console.log('Sign-In successful! Welcome back.');
//         // Implement your logic for successful sign-in, e.g., display a message on the web saying "Welcome back"
//         // You can show a message using Angular's template binding or other UI components
//       } else {
//         console.log('Invalid email or password. Please try again.');
//         // Handle incorrect email/password, e.g., display an error message on the web
//         // You can show a message using Angular's template binding or other UI components
//       }
//     },
//     (error) => {
//       console.error('Error fetching users:', error);
//       alert(error.message);
//       // Handle error while fetching users from the backend, e.g., show an error message to the user
//     }
//   );
// }
