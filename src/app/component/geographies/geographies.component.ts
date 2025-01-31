import { Component, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import {AfterViewInit, ViewChild} from '@angular/core';
import { Sort, MatSort, SortDirection } from '@angular/material/sort';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-geographies',
  templateUrl: './geographies.component.html',
  styleUrls: ['./geographies.component.css']
})
export class GeographiesComponent implements OnInit {
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  selectedTabIndex = 0;
  currentPageName:string="";
  tabList:string[] = [];

  countryname: string[] = ['India (71/126)', 'Malaysia  (178/178)', 'philippines (0/135)','Singapore (0/135)'];
  Sname: string[] = ['Andhra Pradesh (0/42)', 'Gujarat (36/36)','Telangana (21/22)', 'Tamil Nadu (36/36)'];
  Dname: string[] = ['Hyderabad', 'Adilabad','Warangal', 'Ranga Reddy'];
  Cname: string[] = ['Amberpet', 'Khairatabad', 'Jubilee Hills'];
  Rname:string[] = ['North 4/4)', 'East (8/8)', 'West (3/4)', 'South (8/8)']
  
  constructor(private observer: BreakpointObserver,
    private route: ActivatedRoute,) { 
      this.route.data.subscribe(v => {
    this.currentPageName = v['key'];

    let showCaseTabList: string[] = [];
    let userRolesData = JSON.parse(localStorage.getItem('userroles') ?? '[]');
      console.log(userRolesData,"SK");
      console.log(this.currentPageName,"RK");
      userRolesData.forEach(element => {
      if (element.title == this.currentPageName) {
          element.permission.forEach(item => {
            if(item.status){
              this.tabList.push(item.action.toLowerCase());
            }
        });
      }
    }) 
  }
)}

  @ViewChild(MatSort)
  sort: MatSort = new MatSort;

  ngAfterViewInit() {
    //this.dataSource.sort = this.sort;
    this.observer.observe(['(max-width: 800px)']).subscribe((res) => {
      if (res.matches) {
        this.sidenav.mode = 'over';
        this.sidenav.close();
      } else {
        this.sidenav.mode = 'side';
        this.sidenav.open();
      }
    });
  }
  userType:any;
  ngOnInit(): void {
    this.userType = localStorage.getItem('userType');
  }

  
  ToggleSideNav(value:any){
    this.sidenav.toggle()
  }
}
