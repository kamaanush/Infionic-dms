import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';

import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { ActivatepopUpComponent } from '../users/userPopups/activatepop-up/activatepop-up.component';
import { DeactivateUserpopupComponent } from '../users/userPopups/deactivate-userpopup/deactivate-userpopup.component';
import { MaterialAddEditpopupComponent } from '../materials-list/material-add-editpopup/material-add-editpopup.component';
import tippy, { hideAll } from 'tippy.js';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-material-list-action',
  templateUrl: './material-list-action.component.html',
  styleUrls: ['./material-list-action.component.css']
})
export class MaterialListActionComponent implements OnInit {
  private params;
  public isOpen = false;
  private tippyInstance;
  unActiveList: any;
  offsetValue: number[] = [];
  DeactiveDealer: any;
  constructor(private changeDetector: ChangeDetectorRef, private route: ActivatedRoute, private dialog: MatDialog) {

    this.route
      .data
      .subscribe(v => {
        let menuList = v['materialMenuList'];
        let showCaseMenuList: string[] = [];
        let userRolesData = JSON.parse(localStorage.getItem('userroles') ?? '[]');
        userRolesData.forEach(element => {
          if (element.title == v['key']) {
            element.permission.forEach(item => {

              if (menuList && menuList.indexOf(item.action.toLowerCase()) !== -1 && item.status) {
                showCaseMenuList.push(item.action);
              }
            })
          }
        })
        console.log(showCaseMenuList.length);
        switch (showCaseMenuList.length) {
          case 4:
            this.offsetValue = [-100, 200];
            break;
          case 3: //223.333px 
            this.offsetValue = [-100, 200];
            break;
          case 2: // 252
            this.offsetValue = [-73, 200];
            break;
          case 1:
            this.offsetValue = [-44, 200];
            break;

          default:
            this.offsetValue = [-100, 200];
            break;
        }
      });
  }

  ngAfterViewInit(): void {
    this.tippyInstance = tippy(this.button.nativeElement);
    this.tippyInstance.disable();
  }

  agInit(params) {
    this.params = params;
  }

  ngOnInit(): void {
  }
  @ViewChild('content') container;

  @ViewChild('trigger') button;
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
      offset: this.offsetValue,
      onShow: (instance) => {
        hideAll({ exclude: instance });
      },
      onClickOutside: (instance, event) => {
        this.isOpen = false;
        instance.unmount();
      },
    });
  }
  togglePopup() {
    this.isOpen = !this.isOpen;
    this.changeDetector.detectChanges();
    if (this.isOpen) {
      this.unActiveList = "MaterialList"
      localStorage.setItem('session', this.unActiveList);
      this.configureTippyInstance();
      this.tippyInstance.setContent(this.container.nativeElement);
      const rowData = this.params.node.data;
      if (rowData.statusName === 'Active') {
        this.DeactiveDealer = true;
      } else if (rowData.statusName === 'Inactive') {
        this.DeactiveDealer = false;
      }
    } else {
      this.tippyInstance.unmount();
    }
  }
  edit() {
    localStorage.setItem("Edit", 'Edit')
    let dialogRef = this.dialog.open(MaterialAddEditpopupComponent, {
      // width: '100vw',
      maxWidth: '80vw',
      maxHeight: '99vh',
      panelClass: 'material-add-edit'
    });
    this.isOpen = false;
    dialogRef.afterClosed().subscribe((res) => {

      localStorage.setItem('Edit', '');

    })
  }
  deactive() {
    this.dialog.open(DeactivateUserpopupComponent);
    this.isOpen = false;
  }

  activate() {
    this.dialog.open(ActivatepopUpComponent);
    this.isOpen = false;
  }
}
