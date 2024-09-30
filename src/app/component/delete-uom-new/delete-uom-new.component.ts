

import { Component, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { UomServicesService } from 'src/app/services/uom-services.service';
import { UserService } from 'src/app/services/user.service';
import { DeactiveSuccessPopComponent } from '../users/userPopups/deactive-success-pop/deactive-success-pop.component';

import { interval } from 'rxjs';
import { OtherMasterService } from 'src/app/services/other-master.service';
import { DeleteUomSuccessfullPopupComponent } from '../delete-uom-successfull-popup/delete-uom-successfull-popup.component';

@Component({
  selector: 'app-delete-uom-new',
  templateUrl: './delete-uom-new.component.html',
  styleUrls: ['./delete-uom-new.component.css']
})
export class DeleteUomNewComponent implements OnInit {
  uomId:any;
  UomName:any='';
  LoginId:any;
  constructor(private dialogRef: MatDialogRef<any>,
    private dialog: MatDialog,
    private user:UserService,
    private otherMasterService:OtherMasterService,
    private uomservise:UomServicesService,

    ) { }

  ngOnInit() {
   
    this.uomId = localStorage.getItem('niId');
    this.UomName = localStorage.getItem('Niname');

    // this.LoginId=localStorage.getItem("logInId");


  }
  closeDialog() {
    throw new Error('Method not implemented.');
  }
  close(){
    this.dialogRef.close()
  }
  deactive(){
    
    this.uomservise.deleteUom(this.uomId).subscribe((res) => {     
    });
      this.otherMasterService.filter('Register click');


    this.dialog.open(DeleteUomSuccessfullPopupComponent,{panelClass: 'deactiveSuccessPop'})
      this.otherMasterService.filter('Register click');
    this.dialogRef.close()
  }

}
