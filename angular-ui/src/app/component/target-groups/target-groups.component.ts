import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {AfterViewInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { Sort, MatSort, SortDirection } from '@angular/material/sort';
import { IDropdownSettings } from 'ng-multiselect-dropdown'; 
import {ITooltipParams, PaginationNumberFormatterParams,} from 'ag-grid-community';
import { TargetListService } from 'src/app/services/target-list.service';


export interface PeriodicElement {
  name: any;
  position: string;
  weight: number;
  symbol: string;
  emailid:any;
  phonenum:number;
  status:any;
}

 const ELEMENT_DATA: PeriodicElement[] = [
   {position: '6004005001', name: 'Rajasheka S', weight: 1.0079, symbol: 'Customer',emailid:'you@smartgig',phonenum:9448282822,status:'Active'},
   {position: '6004005002', name: 'Manoranjan B', weight: 1.0079, symbol: 'Dealer',emailid:'you@smartgig',phonenum:9448282822,status:'Inactive'},
   {position: '6004005003', name: 'Vishnu M', weight: 1.0079, symbol: 'Admin',emailid:'you@smartgig',phonenum:9448282822 , status:'Active'},
   {position: '6004005004', name: 'Mahendra S', weight: 1.0079, symbol: 'Dealer',emailid:'you@smartgig',phonenum:9448282822, status:'Invited'},
   {position: '6004005005', name: 'Veerendra kr', weight: 1.0079, symbol: 'Admin',emailid:'you@smartgig',phonenum:9448282822, status:'Locked'},
  {position: '6004005006', name: 'mahathi Br', weight: 1.0079, symbol: 'Admin',emailid:'you@smartgig',phonenum:9448282822, status:'Active'},
    {position: '6004005007', name: 'chetheshwar T', weight: 1.0079, symbol: 'Admin',emailid:'you@smartgig',phonenum:9448282822, status:'Locked'},
   {position: '6004005008', name: 'Swami swami', weight: 1.0079, symbol: 'Admin',emailid:'you@smartgig',phonenum:9448282822, status:'Locked'},

   {position: '6004005006', name: 'narendra gs', weight: 1.0079, symbol: 'Admin',emailid:'you@smartgig',phonenum:9448282822, status:'Locked'},

    {position: '6004005006', name: 'prajwal vT', weight: 1.0079, symbol: 'Admin',emailid:'you@smartgig',phonenum:9448282822, status:'Locked'},

 ];



import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CellClassParams,CellClassRules, CellClickedEvent, CellValueChangedEvent, ColDef, Color, FirstDataRenderedEvent, GridReadyEvent, RowValueChangedEvent, SideBarDef ,GridApi,GridOptions} from 'ag-grid-community';
import { UserService } from 'src/app/services/user.service';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import * as moment from 'moment';
import { AddTargetGroupComponent } from '../add-target-group/add-target-group.component';






@Component({
  selector: 'app-target-groups',
  templateUrl: './target-groups.component.html',
  styleUrls: ['./target-groups.component.css']
})
export class TargetGroupsComponent implements OnInit {
  




  private gridApi!: GridApi;
  paginationPageSize = 10;
  myForm:any= FormGroup;
  myForms:any= FormGroup;
  disabled = false;
  ShowFilter = false;
  StatusFilter = false;
  limitSelection = false;
  statusSelection =false;
  cities:any = [];
  status:any = [];
  selectedItems: any = [];
  selectedStatus: any = [];
  userTypes:any=[];
  statusTypes:any=[];
  searchText:any;
  dropdownSettings: IDropdownSettings = {};
  dropdownSettings1: IDropdownSettings = {};
  
gridOptions : GridOptions ={
    defaultColDef: {
      resizable: true,
    },
    onCellClicked: (event: CellClickedEvent) => console.log('Cell was clicked'),
    // set background colour on every row, this is probably bad, should be using CSS classes
    rowStyle: { background: 'black' },

    // set background colour on even rows again, this looks bad, should be using CSS classes
    

    // other grid options ...
}



// Data that gets displayed in the grid
public rowData5=[];
public popupParent: HTMLElement = document.body;

columnDefs: ColDef[] = [ 

  { headerName: "Group Code",
field: 'targetGroupCode' ,type: ['nonEditableColumn'], pinned: 'left',minWidth:250
},

{   headerName: "Group Name",field: 'targetGroupName',type: ['nonEditableColumn']},

{headerName: "No of Products", field: 'noOfProducts', type: ['nonEditableColumn']},


{   headerName: " No of Dealers",
field: 'noOfDealers',type: ['nonEditableColumn'],
// cellRenderer: function dateFormtter(params) {
//   if(params.value==null){
//     return params.value=''
//   }
//    else{
//     return moment(params.value).format('DD MMM YY, HH:mm A')

//   }
// },
tooltipValueGetter:(params: ITooltipParams) => moment(params.value).format('DD MMM YY, HH:mm A'),
},

{   headerName: "No of Geographies",

field: 'noOfGeographies',type: ['nonEditableColumn']
},


{
  headerName: '',
  colId: 'action',
  
  
  editable: false,
  maxWidth: 75
 
},


];


rowData :any;
rowData1=[];
employeeName:any;
public defaultColDef: ColDef = {
  suppressSizeToFit: true,

  // make every column editable
  editable: true,
  // make every column use 'text' filter by default
  filter: 'agTextColumnFilter',
  // enable floating filters by default
  // make columns resizable
  resizable: true,
  sortable: true,
  flex: 1,
  width:100
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
        // In the example application, dates are stored as dd/mm/yyyy
        // We create a Date object for comparison against the filter date
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

  displayedColumns: string[] = ['position', 'name',  'symbol','email','phonenum','login','status','edit'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  toppings = new FormControl('');
  toppings1 = new FormControl('');

  
  toppingList: any= [];

  toppingList1:  any= [];
  filterDictionary: any;
  sideBarOpen = true;
  scrolledIndex = 0;
  defaultPageSize = 12;
  paginationScrollCount:any;

  @ViewChild(MatSidenav)


  sidenav!: MatSidenav;
  roleName: any;
  statusname:any;
  props: any;
  msg1: any;
  msg: any;
  userId: any;
  roleArray:any[] = [];
  statusArray:any=[];
  messages:any[]=[];
  stayScrolledToEnd = true;
  uomId:any;
 paginationNumberFormatter: (
    params: PaginationNumberFormatterParams
  ) => string = (params: PaginationNumberFormatterParams) => {
    return '[' + params.value.toLocaleString() + ']';
  };
  
  start: number = 0;
  limit: number = 15;
  end: number = this.limit + this.start;
  UomId:any;
  uomName:any;
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
  target: any;

  
  constructor(public dialog: MatDialog,
    private router: Router,
    private _liveAnnouncer: LiveAnnouncer,
    private user:UserService,
    private observer: BreakpointObserver,
    private fb: FormBuilder,
    private targetList: TargetListService
   ) {
      sort:[];
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
  }



  ngOnInit(): void {
    this.targetListGroup();
 
   
    this.uomId = localStorage.getItem('niId');


  this.otherstatus();

this.myForm = this.fb.group({
    city: [this.selectedItems]
});
this.myForms = this.fb.group({
  citys: [this.selectedItems]
});


}

targetListGroup(){

    const data={
      TargetGroup:[16]
    }
  this.targetList.getTargetList(data).subscribe((res) => {
  this.rowData5 = res.response;
  console.log("check target",this.rowData5);
  
  })
}

scrolledIndexChange(i): void {
  this.scrolledIndex = i;
}
otherstatus(){
  const data ={
  }
  this.user.otherstatus(data).subscribe((res) => {     
  });
  console.log('data', data )
}
editfn(){
  alert('guru')
}
addTarget() {
  this.dialog.open(AddTargetGroupComponent) 
 
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


  
  refresh(){
    this.toppings = new FormControl(this.toppingList);
    this.toppings1 = new FormControl(this.toppingList1);
    this.myForm = this.fb.group({
      city: [this.selectedItems]
  });
  this.myForms = this.fb.group({
    citys: [this.selectedItems]
  });
    
    const data={
      userTypes:[],
      statuss:[],
      search:'',
  
    }
    this.user.getcurrencylist(data).subscribe((res) => {     
      this.rowData5 = res.response;
    });
  }
makeCellClicked(){
}

handleRowDataChanged(event) {
  const index = this.messages.length - 1;
  if (this.stayScrolledToEnd) {
    
  }
}

handleScroll(event) {
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
  applyFilter(event: Event) {


    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
}

  announceSortChange(sortState: any) {
 
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }


  // Example of consuming Grid Event
  onCellClicked( e): void {
    console.log('cellClicked', e);
    if (
      e.event.target.dataset.action == 'toggle' &&
      e.column.getColId() == 'action'
    ) {
      const cellRendererInstances = e.api.getCellRendererInstances({
        rowNodes: [e.node],
        columns: [e.column],
      });
      if (cellRendererInstances.length > 0) {
        const instance = cellRendererInstances[0];
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

  onRowValueChanged(event: RowValueChangedEvent) {
    var data = event.data;
    
  }

  sideBarToggler(){
    this.sideBarOpen = !this.sideBarOpen;
  }
  openDialog(){
    
    
  }
  onBtnExport(){
    this.gridApi.exportDataAsCsv();

  }
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridOptions?.api!?.sizeColumnsToFit();
    
  }



  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.paginationGoToPage(4);
  }

  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  onSearchChange($event: any, anything?: any) {
    const { target } = $event;
    this.searchText = target.value;
    // const data = {
    //   Search: this.searchText,
    //   isProduct:this.isproduct

    // }
    // this.materialList.getMaterialList(data).subscribe((res) => {
    //   this.rowData5 = res.response;
    // });

    const data={
      search:this.searchText
    }
  this.targetList.getTargetSearch(data).subscribe((res) => {
  this.rowData5 = res.response;
});

  }


}
