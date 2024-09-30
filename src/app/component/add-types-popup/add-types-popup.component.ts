import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';
// import { RestPwsdUserPopupComponent } from '../rest-pwsd-user-popup/rest-pwsd-user-popup.component';
import {FormControl, FormGroupDirective, NgForm, Validators} from 
             '@angular/forms';
import { RestPwsdUserPopupComponent } from '../users/userPopups/rest-pwsd-user-popup/rest-pwsd-user-popup.component';
import { ClassificationserviseService } from 'src/app/services/classificationservise.service';
import { SharedService } from 'src/app/services/shared-services.service';
import { SharedServiceAddTypesService } from 'src/app/services/shared-service-add-types.service';
import { AddTypesSuccessfulDonePopupComponent } from './add-types-successful-done-popup/add-types-successful-done-popup.component';
import { MaterialclassificationEditSuccessComponent } from '../add-cat/materialclassification-edit-success/materialclassification-edit-success.component';
@Component({
  selector: 'app-add-types-popup',
  templateUrl: './add-types-popup.component.html',
  styleUrls: ['./add-types-popup.component.css']
})
export class AddTypesPopupComponent implements OnInit {
  enterfirst:any;
  entersecond:any;
  userId:any;
  error:any='';
  LoginId:any;
  type:any;
  typeCode:any;
  numberValue:any;
  itemId:any;
  subCatId:any;
  TypeName:any;
  adminPassword:boolean =false;
  showPassword: boolean = false;
  activeTypeId:any;
  errorMsg: any;
  constructor( private dialog: MatDialog,
    private dialogRef: MatDialogRef<any>,
    private user:UserService,
    private calssification:ClassificationserviseService,
    private sharedService: SharedServiceAddTypesService,


    ) { 

   
    }


  ngOnInit(): void {
    this.LoginId=localStorage.getItem("logInId");
    this.itemId=localStorage.getItem("Catidset");
    this.numberValue = Number(this.LoginId);
    this.userId = localStorage.getItem("userID");
    this.LoginId=localStorage.getItem("logInId");
    this.subCatId=localStorage.getItem("Subcatidset");
    this.TypeName=localStorage.getItem("TypeName");
    this.activeTypeId=localStorage.getItem("activeTypeId");


    if(this.TypeName=='Edit Types'){
      this.calssification.getTypesById(this.activeTypeId).subscribe((res)=>{
this.type=res.response.typeName;
this.typeCode=res.response.typeCode;
      })
    }

  }
 

  AddCat(){
    let data={
      typeName:this.type,
      typeCode:this.typeCode,
      subcategoryid:this.subCatId,
      CreatedById:this.numberValue
      
  };
  this.calssification.addtypes(data).subscribe((res)=>{
    if (res.response.result === 'Success') {
      sessionStorage.setItem("typeName",this.type);
      sessionStorage.setItem("typeCode",this.typeCode);
      sessionStorage.setItem("subCategoryName",'');
      sessionStorage.setItem("subCategoryCode",'');
      sessionStorage.setItem("CategoryName",'');
      sessionStorage.setItem("CategoryCode",'');
    this.type='';
    this.typeCode='';
    this.sharedService.filter('Register click')
    this.dialogRef.close();

    this.dialog.open(AddTypesSuccessfulDonePopupComponent, {panelClass: 'Addtypessupop'})
    // {panelClass: 'activeSuccessPop'}

    
    }
    else{
      this.errorMsg=res.response.result;
    }
  })  
  }


  close(){
    this.dialogRef.close();

  }
  
  editType(){
    sessionStorage.setItem("typeName",this.type);
      sessionStorage.setItem("typeCode",this.typeCode);
      sessionStorage.setItem("subCategoryName",'');
      sessionStorage.setItem("subCategoryCode",'');
      sessionStorage.setItem("CategoryName",'');
      sessionStorage.setItem("CategoryCode",'');
    let data={

     TypeId:this.activeTypeId,
      TypeName:this.type,
      TypeCode:this.typeCode,
      LastModifiedById:this.numberValue
  };
  this.calssification.updateType(data).subscribe((res)=>{
    this.type='';
    this.typeCode='';
    this.dialogRef.close();
    this.sharedService.filter('Register click')
  })
  this.dialog.open(MaterialclassificationEditSuccessComponent, {panelClass: 'MLCSP'})
  // {panelClass: 'activeSuccessPop'}

  }
  restrictToAlphabets(event: any): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    input.value = value.replace(/[^a-zA-Z\s]/g, '');
     }

}

