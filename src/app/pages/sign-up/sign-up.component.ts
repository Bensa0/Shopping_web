import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { User } from 'src/app/Interfaces/user';
import { UserServiceService } from 'src/app/services/user-service.service';

@Component({
  selector: 'xs-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  showPassword = false;
  users: User[] = [];

  constructor(private userService: UserServiceService) {}

  onSignUp(form: NgForm) {
    if (form.valid) {
      // Create a new User object with the form data
      const newUser: User = {
        id: null, // The backend will generate the ID, so set it to null for now
        name: this.username,
        email: this.email,
        password: this.password,
      };

      const isUsernameTaken = this.users.some(
        (user) => user.name === this.username
      );

      if (isUsernameTaken) {
        console.log(
          'Username is already taken. Please choose a different one.'
        );
        return;
      }

      // Send the newUser object to the backend using the addUser method from the UserServiceService
      this.userService.addUser(newUser).subscribe(
        (response) => {
          console.log('SignUp success:', response);
          alert('Sign up successful! Welcome back.'); // Show a success message to the user
        },
        (error) => {
          console.error('SignUp error:', error);
          alert('Error signing up. Please try again.'); // Show an error message to the user
        }
      );
    } else {
      console.log('Form is invalid. Please fill all required fields.');
      // Add your error handling or validation messages display here
    }
  }

  onButtonClicked(event: MouseEvent) {
    const button = event.target as HTMLButtonElement;
    button.classList.add('clicked');

    setTimeout(() => {
      button.classList.remove('clicked');
    }, 200);
  }
}
