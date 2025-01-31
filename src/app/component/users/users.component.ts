import { Component, OnInit } from '@angular/core';
import { AddUserPopupComponent } from './userPopups/add-user-popup/add-user-popup.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Sort, MatSort, SortDirection } from '@angular/material/sort';
import { GuiColumn, GuiColumnMenu, GuiPaging, GuiPagingDisplay, GuiSearching, GuiSorting } from '@generic-ui/ngx-grid';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ITooltipParams, PaginationNumberFormatterParams, } from 'ag-grid-community';
import { SharedService } from 'src/app/services/shared-services.service';
import * as XLSX from 'xlsx';

export interface PeriodicElement {

  name: any;
  position: string;
  weight: number;
  symbol: string;
  emailid: any;
  phonenum: number;
  status: any;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: '6004005001', name: 'Rajasheka S', weight: 1.0079, symbol: 'Customer', emailid: 'you@smartgig', phonenum: 9448282822, status: 'Active' },
  { position: '6004005002', name: 'Manoranjan B', weight: 1.0079, symbol: 'Dealer', emailid: 'you@smartgig', phonenum: 9448282822, status: 'Inactive' },
  { position: '6004005003', name: 'Vishnu M', weight: 1.0079, symbol: 'Admin', emailid: 'you@smartgig', phonenum: 9448282822, status: 'Active' },
  { position: '6004005004', name: 'Mahendra S', weight: 1.0079, symbol: 'Dealer', emailid: 'you@smartgig', phonenum: 9448282822, status: 'Invited' },
  { position: '6004005005', name: 'Veerendra kr', weight: 1.0079, symbol: 'Admin', emailid: 'you@smartgig', phonenum: 9448282822, status: 'Locked' },
  { position: '6004005006', name: 'mahathi Br', weight: 1.0079, symbol: 'Admin', emailid: 'you@smartgig', phonenum: 9448282822, status: 'Active' },
  { position: '6004005007', name: 'chetheshwar T', weight: 1.0079, symbol: 'Admin', emailid: 'you@smartgig', phonenum: 9448282822, status: 'Locked' },
  { position: '6004005008', name: 'Swami swami', weight: 1.0079, symbol: 'Admin', emailid: 'you@smartgig', phonenum: 9448282822, status: 'Locked' },

  { position: '6004005006', name: 'narendra gs', weight: 1.0079, symbol: 'Admin', emailid: 'you@smartgig', phonenum: 9448282822, status: 'Locked' },

  { position: '6004005006', name: 'prajwal vT', weight: 1.0079, symbol: 'Admin', emailid: 'you@smartgig', phonenum: 9448282822, status: 'Locked' },

];
import { EditPopupComponent } from './userPopups/edit-popup/edit-popup.component';
import { UomPopupComponent } from './userPopups/uom-popup/uom-popup.component';
import { EditUomPopupComponent } from './userPopups/edit-uom-popup/edit-uom-popup.component';
import { AddTaxTemplateComponent } from './userPopups/add-tax-template/add-tax-template.component';
import { AddcurrencyComponent } from './userPopups/addcurrency/addcurrency.component';
import { EditTaxTemplateComponent } from './userPopups/edit-tax-template/edit-tax-template.component';
import { DeletecomponentComponent } from '../deletecomponent/deletecomponent.component';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CellClassParams, CellClassRules, CellClickedEvent, CellValueChangedEvent, ColDef, Color, FirstDataRenderedEvent, GridReadyEvent, RowValueChangedEvent, SideBarDef, GridApi, GridOptions, ModuleRegistry, ColumnResizedEvent, Grid, } from 'ag-grid-community';
import { BehaviorSubject, Observable } from 'rxjs';
import { AgGridAngular } from 'ag-grid-angular';
import { UserService } from 'src/app/services/user.service';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { PopupCellRendererComponent } from '../popup-cell-renderer/popup-cell-renderer.component';
import * as moment from 'moment';
import { UseractionComponent } from '../useraction/useraction.component';
import { NgxSpinnerService } from 'ngx-spinner';

// uncomment this based on need****sainathreddy***
// import { parseMessage } from '@angular/localize/src/utils';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  // clickEventSubscription:Subscription;

  @ViewChild(AddUserPopupComponent) child;

  private gridApi!: GridApi;
  paginationPageSize = 10;
  myForm: any = FormGroup;
  myForms: any = FormGroup;
  disabled = false;
  ShowFilter = false;
  StatusFilter = false;
  limitSelection = false;
  statusSelection = false;
  cities: any = [];
  status: any = [];
  selectedItems: any = [];
  selectedStatus: any = [];
  userTypes: any = [];
  statusTypes: any = [];
  searchText: any;
  dropdownSettings: IDropdownSettings = {};
  dropdownSettings1: IDropdownSettings = {};

  gridOptions: GridOptions = {
    defaultColDef: {
      resizable: true,
    },
    onCellClicked: (event: CellClickedEvent) => console.log('Cell was clicked'),
    // set background colour on every row, this is probably bad, should be using CSS classes
    rowStyle: { background: 'black' },

    // set background colour on even rows again, this looks bad, should be using CSS classes


    // other grid options ...
  }

  // status:any;

  // Data that gets displayed in the grid
  public rowData5 = [];
  public popupParent: HTMLElement = document.body;
  columnDefs: ColDef[] = [

    {
      headerName: "User ID",
      field: 'employeeCode', type: ['nonEditableColumn'], 
      // sort: 'desc',
      tooltipField: "employeeCode",cellStyle: { color: '#686E74' }, maxWidth: 200,

    },

    { headerName: "Username", field: 'userName',cellStyle: { color: '#686E74' }, type: ['nonEditableColumn'], tooltipField: "userName", },


    { headerName: "Role", field: 'roleName',cellStyle: { color: '#686E74' }, type: ['nonEditableColumn'], tooltipField: "roleName", },
    { headerName: "Dealer Name", field: 'customerName',cellStyle: { color: '#686E74' }, type: ['nonEditableColumn'], tooltipField: "userName", },
    {
      headerName: "Email ",
      field: 'email', type: ['nonEditableColumn'],cellStyle: { color: '#686E74' },
      tooltipField: "email",
      // flex: 1,
    },

    {
      headerName: "Phone No",
      field: 'mobile', type: ['nonEditableColumn','rightAligned'],cellStyle: { color: '#686E74' },
      tooltipField: "mobile"
    },

    {
      headerName: "Last Login",
      field: 'lastLoginDate',cellStyle: { color: '#686E74' }, type: ['nonEditableColumn'],
      cellRenderer: function dateFormtter(params) {
        if (params.value == null) {
          return params.value = ''
        }
        else {
          return moment(params.value).format('DD-MMM -YY')

        }
      },
      tooltipValueGetter: (params: ITooltipParams) => moment(params.value).format('DD-MMM-YY'),
    },

    // suppressMovable:true,
    {
      headerName: "Status",
      field: 'statusName',
      maxWidth: 109,
      type: ['nonEditableColumn'],
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ['Active', 'Inactive', 'Invited', 'Locked',],
      },
      cellClass: params => {
        return params.value == 'Inactive' ? 'my-class-1' : params.value == 'Active' ? 'my-class-2' : params.value == 'Invited' ? 'my-class-3' : 'my-class-4'
      },
      
      tooltipField: "statusName",
    },
    {
      headerName: '',
      colId: 'action',
      cellRenderer: UseractionComponent,
      editable: false,
      maxWidth: 60
    },

  ];


  rowData: any;
  rowData1 = [];
  employeeName: any;
  public defaultColDef: ColDef = {
    suppressSizeToFit: true,

    width: 400,
    filter: 'agTextColumnFilter',
    flex: 1,
    resizable: true,
    sortable: true,
    lockVisible:true,
  };


  public columnTypes: {
    [key: string]: ColDef;
  } = {
      numberColumn: { width: 130, filter: 'agNumberColumnFilter' },
      medalColumn: { width: 100, columnGroupShow: 'open', filter: false },
      nonEditableColumn: { editable: false },
      dateColumn: {
        // specify we want to use the date filter
        filter: 'agDateColumnFilter',
        // add extra parameters for the date filter
        filterParams: {
          // provide comparator function
          comparator: (filterLocalDateAtMidnight: Date, cellValue: string) => {
            const dateParts = cellValue.split('/');
            const day = Number(dateParts[0]);
            const month = Number(dateParts[1]) - 1;
            const year = Number(dateParts[2]);
            const cellDate = new Date(year, month, day);
            // Now that both parameters are Date objects, we can compare
            if (cellDate < filterLocalDateAtMidnight) {
              return -1;
            } else if (cellDate > filterLocalDateAtMidnight) {
              return 1;
            } else {
              return 0;
            }
          },
        },
      },
    };

  public rowGroupPanelShow = 'always';
  public pivotPanelShow = 'always';

  displayedColumns: string[] = ['position', 'name', 'symbol', 'email', 'phonenum', 'login', 'status', 'edit'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  toppings = new FormControl('');
  toppings1 = new FormControl('');

  toppingList: any = [];

  toppingList1: any = [];
  filterDictionary: any;
  sideBarOpen = true;
  scrolledIndex = 0;
  defaultPageSize = 12;
  paginationScrollCount: any;

  @ViewChild(MatSidenav)


  sidenav!: MatSidenav;
  roleName: any;
  statusname: any;
  props: any;
  msg1: any;
  msg: any;
  userId: any;
  roleArray: any[] = [];
  statusArray: any = [];
  messages: any[] = [];
  stayScrolledToEnd = true;
  message: boolean = false;
  message1: boolean = true;


  currentPageName;


  paginationNumberFormatter: (
    params: PaginationNumberFormatterParams
  ) => string = (params: PaginationNumberFormatterParams) => {
    return '[' + params.value.toLocaleString() + ']';
  };

  start: number = 0;
  limit: number = 15;
  end: number = this.limit + this.start;

  gridsOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      editable: true,
      suppressMenu: true,
      filter: true,
      floatingFilter: true,
      filterParams: { buttons: ['clear'] }
    },
    headerHeight: 60,
    animateRows: true,
    pagination: false,
    paginationAutoPageSize: false,
  }

  instancePopup: any = null;

  constructor(public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private _liveAnnouncer: LiveAnnouncer,
    private user: UserService,
    private observer: BreakpointObserver,
    private fb: FormBuilder,
    private sharedService: SharedService,
    private SpinnerService: NgxSpinnerService
  ) {
    this.route.data.subscribe(v => {
      this.currentPageName = v['key'];
      let actionColumn = v['usersMenuList'];
      let showCaseMenuList: string[] = [];
      let userRolesData = JSON.parse(localStorage.getItem('userroles') ?? '[]');

      userRolesData.forEach(element => {
        if (element.title == this.currentPageName) {
          this.columnDefs = this.columnDefs.filter(x => {
            if (x.colId != 'action' || element == undefined || element == null) return true;

            element.permission.forEach(item => {
              if (actionColumn.indexOf(item.action.toLowerCase()) !== -1 && item.status) {
                showCaseMenuList.push(item.action);
              }
            })
            return showCaseMenuList.length !== 0;
          });
        }
      })
      console.log("showCaseMenuList.length", showCaseMenuList.length);
      
    })

    this.sharedService.listen().subscribe((m: any) => {
      // console.log(m)
      this.getusertabeldata();
    })
    this.sharedService.getClickEvent().subscribe(() => {
      this.getusertabeldata()
    })
    sort: [];
  }


  @ViewChild(MatSort)
  sort: MatSort = new MatSort;

  ngAfterViewInit() {


    this.dataSource.sort = this.sort;
    this.observer.observe(['(max-width: 800px)']).subscribe((res) => {
      if (res.matches) {
        this.sidenav.mode = 'over';
        this.sidenav.close();
      } else {
        this.sidenav.mode = 'side';
        this.sidenav.open();
      }
    });
    this.message = this.child?.message
    console.log('parent is working', this.message)
  }



  ngOnInit(): void {

    this.getusertabeldata();
    this.roleItems();
    this.statusItems();

    this.myForm = this.fb.group({
      city: [this.selectedItems]
    });
    this.myForms = this.fb.group({
      citys: [this.selectedItems]
    });
  }

  scrolledIndexChange(i): void {
    this.scrolledIndex = i;
  }

  editfn() {
    // alert('guru')
  }

  onSelectAll(items: any) {
    console.log('onSelectAll', items);
  }
  onStatusAll(items: any) {
    console.log('onSelectAll', items);
  }
  toogleShowFilter() {
    this.ShowFilter = !this.ShowFilter;
    this.dropdownSettings = Object.assign({}, this.dropdownSettings, { allowSearchFilter: this.ShowFilter });
  }

  handleLimitSelection() {
    if (this.limitSelection) {
      this.dropdownSettings = Object.assign({}, this.dropdownSettings, { limitSelection: 2 });
    } else {
      this.dropdownSettings = Object.assign({}, this.dropdownSettings, { limitSelection: null });
    }
  }
  toogleStatusFilter() {
    this.StatusFilter = !this.StatusFilter;
    this.dropdownSettings1 = Object.assign({}, this.dropdownSettings1, { allowSearchFilter: this.StatusFilter });
  }

  handleStatusSelection() {
    if (this.statusSelection) {
      this.dropdownSettings1 = Object.assign({}, this.dropdownSettings1, { statusSelection: 2 });
    } else {
      this.dropdownSettings1 = Object.assign({}, this.dropdownSettings1, { statusSelection: null });
    }

  }

  refresh() {
    this.toppings = new FormControl(this.toppingList);
    this.toppings1 = new FormControl(this.toppingList1);
    this.searchText = '';
    this.myForm = this.fb.group({
      city: [this.selectedItems]
    });
    this.myForms = this.fb.group({
      citys: [this.selectedItems]
    });

    const data = {
      userTypes: [],
      statuss: [],
      search: '',

    }
    const searchInput = document.getElementById('searchInput') as HTMLInputElement;   if (searchInput) {     searchInput.value = this.searchText;   }
    this.user.getuserDeatilsUser(data).subscribe((res) => {
      this.rowData5 = res.response;
    });
    this.getusertabeldata();
  }

  getusertabeldata() {
    this.SpinnerService.show(); 
    const data = {
      userTypes: [],
      statuss: [],
    }
    this.user.getuserDeatilsUser(data).subscribe((res) => {

      this.rowData5 = res.response;

      this.SpinnerService.hide(); 
    });
  }
  makeCellClicked() {
  }
  roleItems() {
    this.user.getroleDetails().subscribe((res: any) => {
      let localdata = res.response;
      console.log('checkdata', localdata)

      this.toppingList = localdata.map((data: { roleId: any; roleName: any; }) => {
        return { roleId: data.roleId, roleName: data.roleName };
      });

      if (!this.toppingList?.length) {
        this.toppingList = localdata.map((role: { designationName: any; }) => {
          return role.designationName;
        });
      }
      this.toppingList.push()
      this.toppingList.forEach(element => {
        return this.roleArray.push(element.roleId);
        // console.log('rolecheck',rolecheck)

      })
      console.log('rolearray', this.roleArray)

      // this.toppingList = res.response;
      this.toppings = new FormControl(this.toppingList);

      console.log('rolelist', this.toppingList)
      this.dropdownSettings = {
        singleSelection: false,
        idField: 'roleId',
        textField: 'roleName',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 1,
        allowSearchFilter: false
      };
      this.selectedItems = [];
    });
  }

  handleRowDataChanged(event) {
    const index = this.messages.length - 1;
    if (this.stayScrolledToEnd) {
      //this.gridOptions.ensureIndexVisible(index, 'bottom');
    }
  }

  handleScroll(event) {
    if (this.instancePopup && this.instancePopup.isOpen) {
      this.instancePopup.togglePopup();
      this.instancePopup = null;
    }

    const grid = document.getElementById('gridContainer');
    if (grid) {
      const gridBody = grid.querySelector('.ag-body-viewport') as any;
      const scrollPos = gridBody.offsetHeight + event.top;
      const scrollDiff = gridBody.scrollHeight - scrollPos;
      //const api =  this.rowData5;
      this.stayScrolledToEnd = (scrollDiff <= this.paginationPageSize);
      this.paginationScrollCount = this.rowData5.length;
    }
  }



  statusItems() {
    this.user.getstatusDeatils().subscribe((res: any) => {
      this.toppingList1 = res.response;
      console.log('we have to check here', this.toppingList1)
      this.toppingList1.forEach(element => {
        return this.statusArray.push(element.statusId);

      })
      console.log('statusArray', this.statusArray)
      // this.toppingList = res.response;
      this.dropdownSettings1 = {
        singleSelection: false,
        idField: 'statusId',
        textField: 'statusName',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 1,
        allowSearchFilter: false
      };
      this.selectedStatus = [];
      this.toppings1 = new FormControl(this.toppingList1);

    });
  }
  roleFilter(data: any) {
    console.log('data', data)
    this.roleName = this.toppings.value;
    this.user.UserFilterServices(this.roleName, this.statusname).subscribe((res: any) => {
      this.rowData = res.response;


    });
    console.log('rolename', this.rowData)
  }
  onItemSelect(item: any) {
    this.userTypes.push(item.roleId);

    const data = {
      userTypes: this.userTypes,
      statuss: this.statusTypes,
      search: this.searchText,

    }
    this.user.getuserDeatilsUser(data).subscribe((res) => {
      this.rowData5 = res.response;
    });
    console.log('rolefilter', this.userTypes)
    console.log('onItemSelect', item);
  }

  onItemSelectOrAll(item: any) {
    this.userTypes = this.roleArray;
    const data = {
      userTypes: this.userTypes,
      statuss: this.statusTypes,
      search: this.searchText,

    }
    this.user.getuserDeatilsUser(data).subscribe((res) => {
      this.rowData5 = res.response;
    });

  }

  onItemDeSelectOrAll(item: any) {
    const data = {
      userTypes: this.userTypes,
      statuss: [],
      search: this.searchText,

    }
    this.user.getuserDeatilsUser(data).subscribe((res) => {
      this.rowData5 = res.response;
    });
    console.log('rolefilter', this.userTypes)
    console.log('onItemSelect', item);
  }



  onItemDeSelectOrAllStatus(item: any) {
    const data = {
      userTypes: this.userTypes,
      statuss: [],
      search: this.searchText,

    }
    this.user.getuserDeatilsUser(data).subscribe((res) => {
      this.rowData5 = res.response;
    });
    console.log('rolefilter', this.userTypes)
  }


  onItemSelectOrAllStatus(item: any) {
    this.statusTypes = this.statusArray;
    const data = {
      userTypes: this.userTypes,
      statuss: this.statusTypes,
      search: this.searchText,

    }
    this.user.getuserDeatilsUser(data).subscribe((res) => {
      this.rowData5 = res.response;
    });
    console.log('rolefilter', this.statusTypes)
  }

  onStatusSelect(item: any) {
    this.statusTypes.push(item.statusId);

    const data = {
      userTypes: this.userTypes,
      statuss: this.statusTypes,
      search: this.searchText,
    }
    this.user.getuserDeatilsUser(data).subscribe((res) => {
      this.rowData5 = res.response;
    });

  }

  onItemDeSelect(item: any) {

    this.userTypes.forEach((element, index) => {
      if (element == item.roleId) this.userTypes.splice(index, 1);
    });
    console.log(' this.userTypes', this.userTypes)

    // this.userTypes.pop(item.roleId);
    const data = {
      userTypes: this.userTypes,
      statuss: this.statusTypes,
      search: this.searchText,

    }
    this.user.getuserDeatilsUser(data).subscribe((res) => {
      this.rowData5 = res.response;
    });

  }



  onStatusDeSelect(item: any) {
    this.statusTypes.forEach((element, index) => {
      if (element == item.statusId) this.statusTypes.splice(index, 1);
    });
    // this.statusTypes.pop(item.statusId);
    console.log(' this.statusTypes', this.userTypes)
    const data = {
      userTypes: this.userTypes,
      statuss: this.statusTypes,
      search: this.searchText,

    }
    this.user.getuserDeatilsUser(data).subscribe((res) => {
      this.rowData5 = res.response;
    });
    console.log('rolefilter', this.userTypes)
    console.log('onItemSelect', item);
  }

  applyFilter(event: Event) {


    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  addUser() {
    this.dialog.open(AddUserPopupComponent,);
  }
  editUser() {
    this.dialog.open(EditPopupComponent,);
  }
  AddUomPopup() {
    this.dialog.open(UomPopupComponent,);
  }
  EditUomPopup() {
    this.dialog.open(EditUomPopupComponent,);
  }
  addtaxTempl() {
    this.dialog.open(AddTaxTemplateComponent,);
  }
  addCurrency() {
    let dialogRef = this.dialog.open(AddcurrencyComponent);
    dialogRef.afterClosed().subscribe((res) => {
      localStorage.setItem('headerStatus', '')
    })
  }
  edittaxTempl() {
    this.dialog.open(EditTaxTemplateComponent);
  }
  delete() {
    this.dialog.open(AddUserPopupComponent, { height: '580px', });

  }
  announceSortChange(sortState: any) {

    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  // Example of consuming Grid Event

  onCellClicked(e): void {
    let cellCLickedpromotion = '0'
    localStorage.setItem('cellCLickedpromotion', cellCLickedpromotion)

    console.log('cellClicked', e);
    this.userId = e.data.userId;
    this.employeeName = e.data.userName;
    console.log('userID', this.userId);
    localStorage.setItem('userID', this.userId)
    localStorage.setItem('employeeName', this.employeeName);
    localStorage.setItem('employeeCodeSet', e.data.employeeCode);


    if (e.event.target.dataset.action == 'toggle' && e.column.getColId() == 'action') {
      const cellRendererInstances = e.api.getCellRendererInstances({
        rowNodes: [e.node],
        columns: [e.column],
      });
      if (cellRendererInstances.length > 0) {
        const instance = cellRendererInstances[0];
        this.instancePopup = instance;
        instance.togglePopup();
      }
    }
  }

  onCellValueChanged(event: CellValueChangedEvent) {
    // alert(event.value)
    console.log(
      'onCellValueChanged: ' + event.colDef.field + ' = ' + event.newValue
    );
  }

  onSearchChange($event: any, anything?: any) {
    const { target } = $event;
    this.searchText = target.value;
    const data = {
      userTypes: this.userTypes,
      statuss: this.statusTypes,
      search: this.searchText,
    }
    this.user.getuserDeatilsUser(data).subscribe((res) => {
      this.rowData5 = res.response;
    });

  }
  onRowValueChanged(event: RowValueChangedEvent) {
    var data = event.data;

  }

  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }
  openDialog() {
    // alert('mani')

  }
  convertedDateFormat() {
    var x = new Date();
    var y = x.getFullYear().toString();
    var m = (x.getMonth() + 1).toString();
    var d = x.getDate().toString();
    (d.length == 1) && (d = '0' + d);
    (m.length == 1) && (m = '0' + m);
    return d + m + y;
  }
  // onBtnExport() {
  //   console.log(this.rowData5, 'this.rowData5');

  //   const excludedProperties = ['userId', 'imageUrl','lastLoginDate'];

  //   const headers = Object.keys(this.rowData5[0])
  //   .filter(key => !excludedProperties.includes(key))
  //   .map(header => header.toUpperCase())
  //   const worksheetData = [headers];
  //   this.rowData5.forEach((item) => {
  //       const row = headers.map((key) => {
  //           const value = item[key];
  //           if (typeof value === 'string' && /^\d+(\.\d+)?[Ee]\+\d+$/.test(value)) {
  //               return `"${value}"`;
  //           }
  //           return value;
  //       });
  //       worksheetData.push(row);
  //   });

  //   const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  //   const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  //   const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  //   const url = URL.createObjectURL(blob);

  //   const link = document.createElement('a');
  //   link.href = url;
  //   link.download = 'Users_Data.xlsx';
  //   link.click();
  //   URL.revokeObjectURL(url);
  // }

//   onBtnExport() {
//     console.log(this.rowData5, 'this.rowData5');

//     const excludedProperties = ['userId', 'imageUrl', 'lastLoginDate'];

//     const headers = Object.keys(this.rowData5[0])
//         .filter(key => !excludedProperties.includes(key))
//         console.log(headers,'headers');

//     const capitalizedRowData = this.rowData5.map(item => {
//         const capitalizedItem = {};
//         headers.forEach(key => {
//             const value = item[key];
//             if (typeof value === 'string' && /^\d+(\.\d+)?[Ee]\+\d+$/.test(value)) {
//                 capitalizedItem[key] = `"${value}"`;
//             } else {
//                 capitalizedItem[key] = value;
//             }
//         });
//         return capitalizedItem;
//     });

//     const worksheetData = [headers];
//     capitalizedRowData.forEach(item => {
//         const row = headers.map(key => item[key]);
//         worksheetData.push(row);
//     });

//     const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

//     const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type:'array'});
//     const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
//     const url = URL.createObjectURL(blob);

//     const link = document.createElement('a');
//     link.href = url;
//     link.download = 'Users_Data.xlsx';
//     link.click();
//     URL.revokeObjectURL(url);
// }

onBtnExport() {
  console.log(this.rowData5, 'this.rowData5');

  const excludedProperties = ['userId', 'imageUrl', 'employeeName'];

  // Capitalize headers
  const headers = Object.keys(this.rowData5[0])
      .filter(key => !excludedProperties.includes(key))
      //.map(header => header);// to get all capital letters
      .map(header => header.charAt(0).toUpperCase() + header.slice(1));

  const worksheetData = [headers];
  this.rowData5.forEach((item) => {
      const capitalizedItem = {};
      Object.keys(item).forEach(key => {
          // const capitalizedKey = key   // to get all capital letters
          const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
          capitalizedItem[capitalizedKey] = item[key];
      });

      const row = headers.map((key) => {
          const value = capitalizedItem[key];
          if (typeof value === 'string' && /^\d+(\.\d+)?[Ee]\+\d+$/.test(value)) {
              return `"${value}"`;
          }
          return value;
      });
      worksheetData.push(row);
  });

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type:'array'});
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'Users_Data.xlsx';
  link.click();
  URL.revokeObjectURL(url);
}


  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    params.api.sizeColumnsToFit();
  }
  sizeToFit() {
    this.gridOptions.api!.sizeColumnsToFit();
  }


  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.paginationGoToPage(4);
  }

  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }



  ToggleSideNav(value: any) {
    this.sidenav.toggle()
  }


}

function incrementCount() {
  throw new Error('Function not implemented.');
}

