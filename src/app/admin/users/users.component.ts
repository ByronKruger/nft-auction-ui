import { Component, inject, OnInit, signal } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { UserDetails } from '../../_models/user.model';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { UserStore } from '../../store/users/users.store';
import { ChangeBackgroundService } from '../../_services/common/change-background.service';
import { MatSortModule, Sort } from '@angular/material/sort';
import { UserParams } from '../../_models/paginator';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule,
    MatSortModule, MatInputModule, MatFormField, MatProgressSpinnerModule],
  providers: [UserStore],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  userService = inject(UserService);
  users = signal<Array<UserDetails>>([{id: "", username: ""}]);
  displayedColumns: string[] = ['id', 'username'];
  userStore = inject(UserStore);
  changeBgService = inject(ChangeBackgroundService);
  userParams: UserParams = {
    nftOwnerUsername: "",
    username: ""
  };

  constructor() {
    this.getUsers();
  }

  ngOnInit(): void {
    this.changeBgService.changeBackgroundSubject$.next("vertical");
  }

  getUsers(): void {
    this.userStore.getUsers(undefined, this.userParams);
    // this.userService.getUsers().subscribe({
    //   next: (res) => this.users.set(res),
    //   error: (error) => console.error(error)
    // });
  }

  onSort(e: Sort) {
    this.userParams[e.active as keyof UserParams] = e.direction ? e.direction : "asc";
    this.getUsers();
  }

  handlePageEvent(e: PageEvent): void {
    this.userStore.getUsers({ currentPage: e.pageIndex + 1, itemsPerPage: e.pageSize });
  }

}
