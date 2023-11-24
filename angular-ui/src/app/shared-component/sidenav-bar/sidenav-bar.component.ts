import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';


interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}
@Component({
  selector: 'app-sidenav-bar',
  templateUrl: './sidenav-bar.component.html',
  styleUrls: ['./sidenav-bar.component.css']
})
export class SidenavBarComponent implements OnInit {
  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter()
  mobMuenuStatus = true;
  toggle = true;
  status = "Enable";
  panelOpenState: boolean = true;
  collapsed = false;

  screenWidth = 0;
  sideBarOpen = true;

  userRoles;
  viewMenuList:any = [];

  constructor(private loginService: LoginService,private router: Router) { }

  showSettingsMenuURLS = ['/dashbord/materials','/dashbord/user', '/dashbord/geographies', '/dashbord/other-masters']
  expandSettingsPannel = false;
  ngOnInit(): void {
    if (localStorage.getItem('userroles')) {
      this.userRoles = JSON.parse(localStorage.getItem('userroles') ?? '[]');
      this.updateUserRoleMenu();
    }
    this.loginService.userRolesSubject.subscribe(res => {
      // console.log(res);
      this.userRoles = res;
      this.updateUserRoleMenu();
    });

    console.log(this.router);

    if(this.showSettingsMenuURLS.indexOf(this.router.url) != -1){
      this.expandSettingsPannel = true;
    }
    


  }
  updateUserRoleMenu() {
    this.viewMenuList = [];
    this.userRoles.forEach(element => {
      if (element.viewPage) {
        this.viewMenuList.push(element.title);
      }
    });
  }
  mobBurgerMenuAction() {
    console.log('g');
    this.mobMuenuStatus = !this.mobMuenuStatus;
  }
  closeBurgerMenu() {
    this.mobMuenuStatus = false;
  }
  enableDisableRule() {
    this.toggle = !this.toggle;
    this.status = this.toggle ? "Enable" : "Disable";
  }


  closePanel() {
    this.panelOpenState = true;
  }
  toogleCollapsed(): void {
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
  }
  //   close(): void{
  //  this.collapsed = false;
  //  this.onToggleSideNav.emit({collapsed:this.collapsed, screenWidth: this.screenWidth});
  //   }
}