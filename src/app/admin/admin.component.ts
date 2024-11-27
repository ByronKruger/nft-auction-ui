import { CommonModule, NgFor } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ChangeBackgroundService } from '../_services/common/change-background.service';
import { NavigationService } from '../_services/common/navigation.service';
import { MenuItem } from './admin.model';
// <mat-icon svgIcon="chevron-right" class="white-icon" aria-hidden="false" aria-label="xyz"></mat-icon>

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterLink, CommonModule, RouterOutlet,
    MatButtonModule, NgFor, MatIconModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit{
  private router = inject(Router);
  private navSerivce = inject(NavigationService);
  
  navigated = signal<boolean>(false);
  navigatedArea = signal<string>("");
  changeBgService = inject(ChangeBackgroundService);
  // previouslyNavigated = computed(() => {
  //   if (this.navigated()) return false;
  //   return false;
  // });
  menuItems = signal<Array<MenuItem>>([
    {route: "admin/mint", label: "Mint NFT", iconName: "mint-nft-d"}, 
    {route: "admin/start-auction", label: "Start Auction", iconName: "start-auction-d"}, 
    {route: "admin/auction", label: "Active Auction", iconName: "active-auction-d"}, 
    {route: "admin/nfts", label: "View NFTs", iconName: "nfts-d"}, 
    {route: "admin/users", label: "View Users", iconName: "users-d"}
  ]);
  bgImageStyles: Array<Record<string, string>> = [];

  ngOnInit(): void {
    this.navSerivce.navigatedSubject$.subscribe(_ => this.navigated.set(true));
    this.changeBgService.changeBackgroundSubject$.next("horizontal");
    this.setBgImgStyle();
    console.log("this.bgImageStyles[0]");
    console.log(this.bgImageStyles[0]);
    console.log(this.bgImageStyles[1]);
  }

  setBgImgStyle() {
    for (let i = 0; i < this.menuItems().length; i++) {
      if (i === 0 || i === 2) 
        this.bgImageStyles.push( {'background-image': 'url("../../assets/imgs/white-square-a.png")'});
      else if (i === 3) 
        this.bgImageStyles.push( {'background-image': 'url("../../assets/imgs/white-square-2a.png")'});
      else 
        this.bgImageStyles.push( {'background-image': 'url("../../assets/imgs/white-square-1a.png")'});
    }
  }

  navigate(route: MenuItem) {
    this.navigated.set(true);
    this.navigatedArea.set(route.label);
    this.router.navigateByUrl(route.route);
  }

  onBack() {
    this.navigated.set(false);
    this.router.navigateByUrl("admin");
    this.changeBgService.changeBackgroundSubject$.next("horizontal");
  }
  
}
