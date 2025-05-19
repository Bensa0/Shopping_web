import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserServiceService } from 'src/app/services/user-service.service';
import { User } from 'src/app/Interfaces/user';
import { FormsModule } from '@angular/forms';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'xs-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, OverlayPanelModule, ButtonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private userService: UserServiceService
  ) {}

  user: User = this.userService.getUser()!;
  activeTab: string = 'profile'; // Initialize it with the default active tab

  ngOnInit(): void {
    if (this.user == undefined) this.user = this.userService.getGuest()!;
    console.log(this.user);
  }

  setActiveTab(tabId: string) {
    this.activeTab = tabId;
    const navLinks = this.el.nativeElement.querySelectorAll('nav a');
    navLinks.forEach((link: HTMLElement) => {
      link.classList.remove('active');
    });

    const activeLink = this.el.nativeElement.querySelector(`#${tabId}`);
    if (activeLink) {
      activeLink.classList.add('active');
    }

    const rightboxChildren =
      this.el.nativeElement.querySelectorAll('.rightbox > *');
    rightboxChildren.forEach((child: HTMLElement) => {
      if (child.classList.contains(tabId)) {
        this.renderer.removeClass(child, 'noshow');
      } else {
        this.renderer.addClass(child, 'noshow');
      }
    });
  }

  onNavLinkClick(event: Event, tabId: string) {
    event.preventDefault();
    this.setActiveTab(tabId);

    // Add logic here for any other actions you want to perform on click
  }
  updateUserName(newName: string) {
    // Get the user's ID and call the service to update the name
    const userId = this.userService.getUser()?.id; // Get the user's ID
    if (userId) {
      this.userService.updateUserName(userId, newName).subscribe(
        (updatedUser) => {
          console.log(updatedUser);
          // Handle the successful update here
          // You can update the user object in your component if needed
          // For example: this.user = updatedUser;
        },
        (error) => {
          // Handle the error here
          console.error('Error updating name:', error);
        }
      );
    }
  }
  updatedName: string = ''; //this.user.name;
  updatedEmail: string = ''; //this.user.email;

  // Function to print the input text to the console
  printInputText(text: string) {
    console.log('Input Text:', text);
  }
}
