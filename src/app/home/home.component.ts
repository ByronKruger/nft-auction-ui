import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user/user.service';
import { ReportingService } from '../_services/common/reporting.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private router = inject(Router);
  private userService = inject(UserService);
  private reporting = inject(ReportingService);
  
  ngOnInit(): void {
    this.reporting.addUnitOfWork('topLevelFunctionCategory', "home");
    if (this.userService.roles().includes("ADMIN")) this.router.navigateByUrl("admin");
  }
  
}
