import { JsonPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { UserStore } from '../store/users/users.store';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [JsonPipe],
  providers: [UserStore],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css'
})
export class UsersListComponent implements OnInit {
  userStore = inject(UserStore);

  ngOnInit(): void {
    // this.userStore.getUsers();
  }
  
}
