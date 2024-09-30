import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';

import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

import tippy, { hideAll } from 'tippy.js'; 
import { ActivatepopUpComponent } from '../component/users/userPopups/activatepop-up/activatepop-up.component';
import { DeactivateUserpopupComponent } from '../component/users/userPopups/deactivate-userpopup/deactivate-userpopup.component';
import { EditPopupComponent } from '../component/users/userPopups/edit-popup/edit-popup.component';
import { PswResetPopupComponent } from '../component/users/userPopups/psw-reset-popup/psw-reset-popup.component';
import { DownloadInvoiceComponentComponent } from '../download-invoice-component/download-invoice-component.component';
import { ViewInvoiceComponentComponent } from '../view-invoice-component/view-invoice-component.component';
import { OrdersApisService } from '../services/orders-apis.service';
import { SharedService } from '../services/shared-services.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-invoice-action',
  templateUrl: './invoice-action.component.html',
  styleUrls: ['./invoice-action.component.css']
})
export class InvoiceActionComponent implements OnInit,  AfterViewInit {
  private params;
  public isOpen = false;
  private tippyInstance;
  selected:boolean=false;

  ngOnInit(){}
  @ViewChild('content') container;

  @ViewChild('trigger') button;

  constructor(private changeDetector: ChangeDetectorRef,
    private dialog: MatDialog, 
    private http:OrdersApisService,
    private SpinnerService: NgxSpinnerService,
    private SS:SharedService) {}

  ngAfterViewInit(): void {
    this.tippyInstance = tippy(this.button.nativeElement);
    this.tippyInstance.disable();
  }

  agInit(params) {
    this.params = params;
  }


  configureTippyInstance() {
    this.tippyInstance.enable();
    this.tippyInstance.show();

    this.tippyInstance.setProps({
      trigger: 'manual',
      placement: 'left',
      theme: 'user-tippy',
      arrow: false,
      interactive: true,
      appendTo: document.body,
      hideOnClick: false,
      offset: [-50, 110],
      onShow: (instance) => {
        hideAll({ exclude: instance });
      },
      onClickOutside: (instance, event) => {
        this.isOpen = false;
        instance.unmount();
      },
    });
  }

  editUser(){
   
    this.dialog.open( ViewInvoiceComponentComponent,{width: '1400px',height:'560px'});
    this.isOpen = false;
  }
 
  resetpws(){
    this.dialog.open(DownloadInvoiceComponentComponent,{width: '1400px',height:'560px'});
    this.isOpen = false;
  }

  deleteupload(){
    this.SpinnerService.show()
    let userId = localStorage.getItem('logInId')
    let guid = this.params.data.id
    const payload ={
      "currentUserId":Number(userId),
      "GUID":guid
    }
   console.log(payload);
   this.http.deleteshipment(payload).subscribe({
    next:(res:any)=>{
      console.log(res);
      this.SS.reloadgrid()
      this.SpinnerService.hide()
    }
   })
  }
  tickmark(){
    this.selected = true;
  }
  togglePopup() {
    this.isOpen = !this.isOpen;
    this.changeDetector.detectChanges();
    if (this.isOpen) {
      let data:any = localStorage.setItem('session','');
      this.configureTippyInstance();
      this.tippyInstance.setContent(this.container.nativeElement);
    } else {
      this.tippyInstance.unmount();
    }
  }



}

