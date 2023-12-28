import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AssosiationServicesService } from 'src/app/services/assosiation-services.service';

@Component({
  selector: 'app-view-association',
  templateUrl: './view-association.component.html',
  styleUrls: ['./view-association.component.css']
})
export class ViewAssociationComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any){}

  ngOnInit(): void {
    console.log(this.data);
  }

}
