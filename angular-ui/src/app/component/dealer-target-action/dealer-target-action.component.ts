import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import tippy, { hideAll } from 'tippy.js';
import { EditDealerTargetComponent } from '../edit-dealer-target/edit-dealer-target.component';

@Component({
  selector: 'app-dealer-target-action',
  templateUrl: './dealer-target-action.component.html',
  styleUrls: ['./dealer-target-action.component.css'],
})
export class DealerTargetActionComponent implements OnInit {
  private params;
  public isOpen = false;
  private tippyInstance;
  offsetValue: number[] = [];

  constructor(
    private changeDetector: ChangeDetectorRef,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {
    this.route.data.subscribe((v) => {
      console.log('v', v);
      let menuList = v['promotionList'];
      let showCaseMenuList: string[] = [];
      let userRolesData = JSON.parse(localStorage.getItem('userroles') ?? '[]');
      userRolesData.forEach((element) => {
        if (element.title == v['key']) {
          element.permission.forEach((item) => {
            if (
              menuList.indexOf(item.action.toLowerCase()) !== -1 &&
              item.status
            ) {
              showCaseMenuList.push(item.action);
            }
          });
        }
      });
      switch (showCaseMenuList.length) {
        case 4:
          this.offsetValue = [-100, 100];
          break;
        case 3:
          this.offsetValue = [-72, 100];
          break;
        case 2:
          this.offsetValue = [-42, 100];
          break;
        case 1:
          this.offsetValue = [-15, 100];
          break;

        default:
          this.offsetValue = [-100, 100];
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

  year: any;
  ngOnInit(): void {}
  @ViewChild('content') container;

  @ViewChild('trigger') button;
  showedit: boolean = true;
  configureTippyInstance() {
    // alert(currentFinancialYear)
    this.tippyInstance.enable();
    this.tippyInstance.show();
    this.year = JSON.parse(localStorage.getItem('financialyear') || 'null');
    this.showedit = this.params.data.isShowEdit;
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
  edit() {
    this.dialog.open(EditDealerTargetComponent, {
      minWidth: '95vw',
      height: '95vh',
      data:this.params.data
    });
    this.isOpen = false;
    localStorage.setItem('dealerTargetSetItem', 'edit');
    localStorage.setItem('dealerTargetaddorderdit', 'Edit');
  }
  view() {
    this.dialog.open(EditDealerTargetComponent, {
      minWidth: '95vw',
      height: '95vh',
    });
    this.isOpen = false;
    localStorage.setItem('dealerTargetSetItem', 'view');
    localStorage.setItem('dealerTargetaddorderdit', 'View');
  }

  togglePopup() {
    this.isOpen = !this.isOpen;
    this.changeDetector.detectChanges();
    if (this.isOpen) {
      this.configureTippyInstance();
      this.tippyInstance.setContent(this.container.nativeElement);
    } else {
      this.tippyInstance.unmount();
    }
  }
}
