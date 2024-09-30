import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AssosiationServicesService } from 'src/app/services/assosiation-services.service';
import { PromotionSharedServicesService } from 'src/app/services/promotion-shared-services.service';
import { PromotionService } from 'src/app/services/promotion.service';
import { SharedServicesDealerService } from 'src/app/services/shared-services-dealer.service';
export interface Task {
  name: string;
  completed: boolean;
  subtasks?: Task[];
}
@Component({
  selector: 'app-addpromo-geography',
  templateUrl: './addpromo-geography.component.html',
  styleUrls: ['./addpromo-geography.component.css'],
})
export class AddpromoGeographyComponent implements OnInit {
  task: Task = {
    name: 'malaysia(3/4)',
    completed: false,
    subtasks: [
      { name: 'Kedah', completed: false },
      { name: 'Penang', completed: false },
      { name: 'Batu Refringi', completed: false },
      { name: 'Georgetown', completed: false },
    ],
  };
  indtasks: any = ['karnataka', 'AndhraPradesh', 'kerala', 'maharastra'];
  allComplete: boolean = false;
  completed: boolean = false;
  geodata: any = [];
  aarrayToPush: any = [];
  selectedcount: any = 0;
  constructor(
    private assoservice: AssosiationServicesService,
    private dialogRef: MatDialogRef<any>,
    private sharedService: PromotionSharedServicesService,
    public promotionGeoservc: PromotionService
  ) {}

  searchTerm: string = '';

  ngOnInit(): void {
    this.promotionGeography();
    let productId = localStorage.getItem('ProductStockItemIdpromo');
  }
  get filteredGeodata() {
    return this.geodata.filter(subtask => {
      // Implement your own logic for filtering, for example, based on subtask.aboveDefaultGeoName
      return subtask.aboveDefaultGeoName.toLowerCase().includes(this.searchTerm.toLowerCase());
    });
  }
  promotionGeography() {
    let promoGeographyId = this.geodata.map((x) => x.aboveDefaultGeoId);
    console.log('gepid', promoGeographyId);
    this.promotionGeoservc.Promogetgeo().subscribe((res) => {
      this.geodata = res.response;
    });
  }
  updateAllComplete(subtask: any) {
    const subtaskIndex = this.geodata.indexOf(subtask);
  
    if (subtaskIndex !== -1) {
      let selectedCount = 0;
  
      this.geodata[subtaskIndex].defaultGeography.forEach((subtask1: any) => {
        subtask1.value = subtask1.defaultGeoId === 'selectedValue'; // Change 'selectedValue' to the actual ID you are checking
  
        if (subtask1.value) {
          selectedCount++;
        }
      });
  
      this.selectedcount = selectedCount;
    }
  }
  
  someComplete(subtask: any): boolean {
    if (!subtask.defaultGeography) {
      return false;
    }
    return subtask.defaultGeography.some((t: any) => t.value) && !this.allComplete;
  }
  
  setAll(subtask: any, completed: boolean) {
    subtask.defaultGeography.forEach((t: any) => (t.value = completed));
    this.selectedcount = completed ? subtask.geoCount : 0;
  }
  
  saveGeo() {
    localStorage.setItem('geopromo1', JSON.stringify(this.aarrayToPush));
    localStorage.setItem(
      'aboveDefaultGeoOfNamepromo1',
      JSON.stringify(this.geodata[0].aboveDefaultGeoName)
    );
    localStorage.setItem(
      'selectedcountpromo1',
      JSON.stringify(this.selectedcount)
    );
    localStorage.setItem(
      'tottalgeoCountpromo1',
      JSON.stringify(this.geodata[0].geoCount)
    );

    this.sharedService.filter('Register click');
    this.dialogRef.close();
  }
}
