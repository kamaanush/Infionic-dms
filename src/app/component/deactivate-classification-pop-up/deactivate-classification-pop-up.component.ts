import { Component, OnInit } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogConfig,
} from '@angular/material/dialog';
import { ClassificationserviseService } from 'src/app/services/classificationservise.service';
import { SharedService } from 'src/app/services/shared-services.service';
import { TaxTemplateServiceService } from 'src/app/services/tax-template-service.service';
import { UserService } from 'src/app/services/user.service';
import { SuccessDeactivateTaxComponentComponent } from '../success-deactivate-tax-component/success-deactivate-tax-component.component';
import { ActiveSuccessPopComponent } from '../users/userPopups/active-success-pop/active-success-pop.component';
import { DeactiveSuccessPopComponent } from '../users/userPopups/deactive-success-pop/deactive-success-pop.component';
@Component({
  selector: 'app-deactivate-classification-pop-up',
  templateUrl: './deactivate-classification-pop-up.component.html',
  styleUrls: ['./deactivate-classification-pop-up.component.css'],
})
export class DeactivateClassificationPopUpComponent implements OnInit {
  employeeId: any;
  employeename: any;
  LoginId: any;
  taxId: any;
  taxTemplateName: any;
  activeCatId: any;
  activeCatName: any;
  activeCatIsActive: any;
  headername: any;

  constructor(
    private dialogRef: MatDialogRef<any>,
    private dialog: MatDialog,
    private user: UserService,
    private sharedService: SharedService,
    private tax: TaxTemplateServiceService,
    private calssification: ClassificationserviseService
  ) {}

  ngOnInit(): void {
    this.LoginId = localStorage.getItem('logInId');
    // console.log('itemin cat',item)
    // localStorage.setItem('activeCatId',item.catId);
    // localStorage.setItem('activeCatName',item.catName)
    // localStorage.setItem('activeCatIsActive',item.isActive)

    this.activeCatId = localStorage.getItem('activeCatId');
    this.activeCatName = localStorage.getItem('activeCatName');
    this.activeCatIsActive = localStorage.getItem('activeCatIsActive');

    if (this.activeCatIsActive == 'false') {
      this.headername = 'Activate';
    } else {
      this.headername = 'De-activate';
    }
  }
  close() {
    this.dialogRef.close();
  }
  deactive() {
    if (this.activeCatIsActive == 'false') {
      const data1 = {
        CategoryId: this.activeCatId,
        logedUserId: this.LoginId,
        status: 'Activate',
      };

      this.calssification.deactivate(data1).subscribe((res) => {
        console.log(res.response.result);
        if(res.response.result=='successfully Deactivated' || res.response.result=='successfully Activated' ){
          this.sharedService.filter('Register click');
          this.dialog.open(ActiveSuccessPopComponent, {
            panelClass: 'ActiveSuccessPopComponent',
          });
          this.dialogRef.close();
        }else{
          alert(res.response.result)
        }
      });
      // this.dialog.open(ActiveSuccessPopComponent, {
      //   panelClass: 'ActiveSuccessPopComponent',
      // });
      // {panelClass: 'activeSuccessPop'}
      this.sharedService.filter('Register click');
      this.dialogRef.close();
    } else {
      const data1 = {
        CategoryId: this.activeCatId,
        logedUserId: this.LoginId,
        status: 'Deactivate',
      };
      this.calssification.deactivate(data1).subscribe((res) => {
        console.log(res.response.result);
        if(res.response.result=='successfully Deactivated' || res.response.result=='successfully Activated' ){
          this.sharedService.filter('Register click');
          this.sharedService.filter('Register click');
      this.dialog.open(DeactiveSuccessPopComponent, {
        panelClass: 'deaeSuPop',
      });
          this.dialogRef.close();
        }else{
          alert(res.response.result)
        }
      });
      // this.sharedService.filter('Register click');
      // this.dialog.open(DeactiveSuccessPopComponent, {
      //   panelClass: 'deaeSuPop',
      // });
      // {panelClass: 'deactiveSuccessPop'}
      this.sharedService.filter('Register click');
      this.dialogRef.close();
    }
  }
}
