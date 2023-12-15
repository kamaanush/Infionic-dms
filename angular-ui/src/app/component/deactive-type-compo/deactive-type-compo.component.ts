
import { Component, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { ClassificationserviseService } from 'src/app/services/classificationservise.service';
import { SharedServiceAddSubService } from 'src/app/services/shared-service-add-sub.service';
import { SharedServiceAddTypesService } from 'src/app/services/shared-service-add-types.service';
import { SharedService } from 'src/app/services/shared-services.service';
import { TaxTemplateServiceService } from 'src/app/services/tax-template-service.service';
import { UserService } from 'src/app/services/user.service';
import { SuccessDeactivateTaxComponentComponent } from '../success-deactivate-tax-component/success-deactivate-tax-component.component';
import { ActiveSuccessPopComponent } from '../users/userPopups/active-success-pop/active-success-pop.component';
import { DeactiveSuccessPopComponent } from '../users/userPopups/deactive-success-pop/deactive-success-pop.component';
@Component({
  selector: 'app-deactive-type-compo',
  templateUrl: './deactive-type-compo.component.html',
  styleUrls: ['./deactive-type-compo.component.css']
})
export class DeactiveTypeCompoComponent implements OnInit {
  employeeId:any;
  employeename:any
  LoginId:any;
  taxId:any;
  taxTemplateName:any;
  activeTypeId:any;
  activeTypeName:any;
  activeTypeIsActive:any;
  headername:any;

  constructor(private dialogRef: MatDialogRef<any>,
    private dialog: MatDialog,
    private user:UserService,
    private sharedService: SharedServiceAddTypesService,
    private tax:TaxTemplateServiceService,
    private calssification:ClassificationserviseService,
    ) { }

  ngOnInit(): void {
    
    this.LoginId=localStorage.getItem("logInId");
    // console.log('itemin cat',item)
    // localStorage.setItem('activeCatId',item.catId);
    // localStorage.setItem('activeCatName',item.catName)
    // localStorage.setItem('activeCatIsActive',item.isActive)

    this.activeTypeId=localStorage.getItem("activeTypeId");
    this.activeTypeName=localStorage.getItem("activeTypeName");
    this.activeTypeIsActive=localStorage.getItem("activeTypeIsActive");
if(this.activeTypeIsActive == 'false'){
  this.headername= 'Activate'
}
else{
  this.headername= 'De-activate'

}
  }
  close(){
    this.dialogRef.close()
  }
  deactive(){
    if(this.activeTypeIsActive == 'false'){
      const data1={
        TypeId:this.activeTypeId,
        logedUserId:this.LoginId,
        status:"Activate"
      }

this.calssification.deactivateType(data1).subscribe((res)=>{
  if(res.response.result=='successfully Deactivated' || res.response.result=='successfully Activated')
  {
    this.sharedService.filter('Register click')
    this.dialogRef.close();
    this.dialog.open(ActiveSuccessPopComponent, {panelClass: 'MLCSP'})
  }
  else
  {
    alert(res.response.result);
    this.dialogRef.close();
  }
  // this.sharedService.filter('Register click')
  // this.dialogRef.close();
});
// this.dialog.open(ActiveSuccessPopComponent, {panelClass: 'MLCSP'})
// {panelClass: 'activeSuccessPop'}
    }
    else{
      const data1={
        TypeId:this.activeTypeId,
        logedUserId:this.LoginId,
        status:"Deactivate"
          }
          
    this.calssification.deactivateType(data1).subscribe((res)=>{
      if(res.response.result=='successfully Deactivated' || res.response.result=='successfully Activated')
      {
        this.dialog.open(DeactiveSuccessPopComponent, {panelClass: 'deaeSuPop'});
        this.sharedService.filter('Register click')
      this.dialogRef.close();
      }
      // this.sharedService.filter('Register click')
      // this.dialogRef.close();
  
      else
      {
        alert(res.response.result);
        this.dialogRef.close();
      }
    
    })
    // this.dialog.open(DeactiveSuccessPopComponent, {panelClass: 'deaeSuPop'});
    // {panelClass: 'deactiveSuccessPop'}
        }

    }

}


