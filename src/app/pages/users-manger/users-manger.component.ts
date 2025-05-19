import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { TreeNode } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TreeTableModule } from 'primeng/treetable';
import { Role } from 'src/app/Interfaces/role';
import { User } from 'src/app/Interfaces/user';
import { RoleService } from 'src/app/services/role.service';
import { UserServiceService } from 'src/app/services/user-service.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    SkeletonModule,
    TreeTableModule,
    ButtonModule,
    FormsModule,
  ],
  templateUrl: './users-manger.component.html',
  styleUrls: ['./users-manger.component.scss'],
})
export class UsersMangerComponent implements OnInit {
  marginStyles = { 'margin-top': '25px' };
  users: TreeNode[] = [];
  tempUsers!: User[];
  userKeys!: string[];
  message: string = 'test message';
  isFirstTimeSubscription: boolean = true;
  isLoading: boolean = true;
  showAddForm: boolean = false;
  showEditForm: boolean = false;
  selectedUser!: User;
  showPassword: boolean = false;
  showEditPassword: boolean = false;
  keysWhitelist: string[] = ['id', 'email', 'name', 'roles'];

  selectedRoleId!:number;
  selectedUserId!:number;
  selectedRole!:any;

  constructor(private userService: UserServiceService,private roleService:RoleService) {}
  roles: Role[] = [];

  ngOnInit(): void {
    this.getUsers();
    this.loadRoles();
  }
  loadRoles(): void {
    this.roleService.getRoles().subscribe(
      (roles: Role[]) => {
        this.roles = roles;
      },
      (error) => {
        console.error('Error loading roles:', error);
      }
    );
  }
  assignRole() {
    if (this.selectedRoleId && this.selectedUserId) {
      this.roleService.assignRoleToUser(this.selectedRoleId, this.selectedUserId)
        .subscribe(
          () => {
            console.log('Role assigned successfully');
            // Handle success, e.g., display a success message or update user data
          },
          (error) => {
            console.error('Error assigning role:', error);
            // Handle error, e.g., display an error message
          }
        );
    }
  }


  fetchUsers(): void {
    this.isLoading = true;

    this.userService.getUsersJson().subscribe(
      (users) => {
        this.users = this.transformData(users);
        this.createBulkUsers(users);
        this.isLoading = false;

        if (this.isFirstTimeSubscription) {
          this.userKeys = this.getKeys(this.users[0].data);
          this.isFirstTimeSubscription = false;
        } else {
          console.log(
            'fetchUsers(): Not the first time subscription. isFirstTimeSubscription:',
            this.isFirstTimeSubscription
          );
        }
      },
      (error) => {
        console.error('fetchUsers(): Error fetching users from JSON:', error);
        this.isLoading = false;
      }
    );
  }
  addUsersFun(users: TreeNode[]) {
    this.userService.addUsers(users).subscribe(
      (response) => {
        console.log('fetchUsers(): Users added successfully:', response);
      },
      (error) => {
        console.error('fetchUsers(): Error adding users:', error);
      }
    );
  }
  createBulkUsers(users: any) {
    this.userService.addBulkUsers(users).subscribe(
      (users: User[]) => {
        console.log('Users created:', users);
      },
      (error) => {
        console.error('Error creating users:', error);
      }
    );
  }


  getKeys(user: User | undefined): string[] {
    if (user) {
      return Object.keys(user).filter((key) =>
        this.keysWhitelist.includes(key)
      );
    } else {
      return [];
    }
  }

  getUsers(): void {
    this.isLoading = true; // Start loading
    this.userService.getUsers().subscribe(
      (users) => {
        this.users = this.transformData(users);
        this.users = this.filterNodesWithNoParents(this.users); // Filter out nodes with no parents
        this.isLoading = false; // Stop loading after data is received
        if (this.isFirstTimeSubscription) {
          if (this.users && this.users.length > 0 && this.users[0].data) {
            this.userKeys = this.getKeys(users[2]);
            this.isFirstTimeSubscription = false;
          } else {
            console.error('No users found.');
            this.userKeys = this.keysWhitelist;
          }
        } else {
          console.log(this.isFirstTimeSubscription);
        }
      },
      (error) => {
        console.error('Error while fetching users:', error);
        this.isLoading = false; // Stop loading on error
      }
    );
  }
  transformData(users: any[]): TreeNode[] {
    return users.map((user) => {
      return {
        data: user,
        children: this.transformData(user.children || []),
      };
    });
  }
  filterNodesWithNoParents(treeNodes: TreeNode[]): TreeNode[] {
    return treeNodes.filter((node) => !node.data.parent_id);
  }
  closeAddForm() {
    this.showAddForm = false;
  }
  HandleOnAddClick() {
    // this.router.navigate(['/sign-up']);
    this.showAddForm = true;
  }
  HandleOnEditClick(user: User) {
    this.selectedUser = user;
    this.showEditForm = true;
  }

  closeEditForm() {
    this.showEditForm = false;
  }

  onEditUser(user: User): void {
    if (user) {
      user.roles =  [this.findRoleById(parseInt(this.selectedRole)),]
      this.userService.editUser(user).subscribe({
        next: (response: User) => {
          console.log("response",response)
          this.getUsers();
          this.closeEditForm(); // Close the form
        },
        error: (error: any) => {
          alert(error.message);
        },
      });
    }
  }

  HandleOnDeleteClick(user: any) {
    let id = user.node.data.id;

    this.userService.deleteUser(id).subscribe({
      next: (response: void) => {
        this.getUsers();
      },
      error: (error: any) => {
        alert(error.message);
      },
    });
  }

  maskPassword(key: string, value: string | null): string {
    if (key === 'password' && value) {
      return '*'.repeat(value.length);
    }
    return value || '';
  }

  generateUser(): void {
    if (this.users.length === 0) {
      alert('No users found. Please add a user manually.');
      return;
    }
    const lastUserIndex = this.users.length - 1;
    const lastUser = this.users[lastUserIndex].data;

    if (lastUser) {
      const newUser: User = {
        id: lastUser.id ? lastUser.id + 1 : null,
        name: this.incrementNumericValue(lastUser.name),
        email: this.incrementNumericValue(lastUser.email),
        password: this.incrementNumericValue(lastUser.password),
      };

      this.userService.addUser(newUser).subscribe(
        (response) => {
          console.log('User added successfully:', response);
          this.getUsers(); // Refresh the user list
          this.closeAddForm(); // Close the form
        },
        (error) => {
          console.error('Error adding user:', error);
          alert('Error adding user. Please try again.'); // Show an error message to the user
        }
      );
    }
  }

  incrementNumericValue(value: string): string {
    const numericRegex = /\d+/g;
    return value.replace(numericRegex, (match) => {
      const numericValue = parseInt(match);
      return (numericValue + 1).toString();
    });
  }
  findRoleById(id: number): Role | undefined {
    return this.roles.find(role => role.id === id);
  }

  public onAddUser(addForm: NgForm): void {
    if (addForm.valid) {
      // Create a new User object with the form data
      const newUser: User = {
        id: null, // The backend will generate the ID, so set it to null for now
        name: addForm.value.name,
        email: addForm.value.email,
        password: addForm.value.password,
        roles: [this.findRoleById(parseInt(addForm.value.role)),]
      };

      // Check if the username is already taken
      const isUsernameTaken = this.users.some(
        (user) => user.data.name === newUser.name
      );

      if (isUsernameTaken) {
        alert(
          'Username is already taken. Please choose a different one.'
        );
        return;
      }

      // Send the newUser object to the backend using the addUser method from the UserServiceService
      this.userService.addUser(newUser).subscribe(
        (response) => {
          console.log('User added successfully:', response);
          this.getUsers(); // Refresh the user list
          this.closeAddForm(); // Close the form
        },
        (error) => {
          console.error('Error adding user:', error);
          alert('Error adding user. Please try again.'); // Show an error message to the user
        }
      );
    } else {
      console.log('Form is invalid. Please fill all required fields.');
      // Add your error handling or validation messages display here
    }
  }
}

