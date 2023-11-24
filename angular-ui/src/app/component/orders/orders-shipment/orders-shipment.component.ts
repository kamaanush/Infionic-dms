import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { CellClickedEvent, CellValueChangedEvent, ColDef, Color, FirstDataRenderedEvent, GridApi, GridReadyEvent, RowValueChangedEvent, SideBarDef } from 'ag-grid-community';
import { GuiColumn, GuiColumnMenu, GuiPaging, GuiPagingDisplay, GuiSearching, GuiSorting } from '@generic-ui/ngx-grid';
import { Subject, take } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ShipOrderBulkDownloadComponent } from '../ship-order-bulk-download/ship-order-bulk-download.component';
import { CustomDatePopupComponent } from '../custom-date-popup/custom-date-popup.component';
import { SalesBulkUploadComponent } from '../../sales-bulk-upload/sales-bulk-upload.component';
import { OrdersApisService } from 'src/app/services/orders-apis.service';
import { UserService } from 'src/app/services/user.service';
import { OrderActionShipmentComponent } from '../order-action-shipment/order-action-shipment.component';
import { ActivatedRoute } from '@angular/router';
import { OrderlistActionPopupComponent } from '../../order-list/orderlist-action-popup/orderlist-action-popup.component';
import { OrdersReceiveShipmentComponent } from '../../orders-receive-shipment/orders-receive-shipment.component';
import moment from 'moment';
import { SharedService } from 'src/app/services/shared-services.service';
import { SharedServicesShipmentService } from 'src/app/services/shared-services-shipment.service';
import { OrderShipmentService } from 'src/app/services/order-shipment.service';
import { SharedServiceCalendarService } from 'src/app/services/shared-service-calendar.service';
import { OtherMasterService } from 'src/app/services/other-master.service';

@Component({
  selector: 'app-orders-shipment',
  templateUrl: './orders-shipment.component.html',
  styleUrls: ['./orders-shipment.component.css'],
})
export class OrdersShipmentComponent implements OnInit {
  myForm: any = FormGroup;

  date: boolean = true;
  userType: any=[]

  selectedDate: any;
  statusForm: any = FormGroup;
  disabled = false;
  dealerSettings: IDropdownSettings = {};
  dropdownSettings2: IDropdownSettings = {};
  startDate = new FormControl(new Date());
  minDateToFinish = new Subject<string>();
  invoiceDate: any = [
    'last 30 days',
    'last 60 days',
    'last 90 days',
    'Last 180 Days',
    'This Month',
    'This Quater',
    'This Year',
    'Last Month',
    'Last Quater',
    'Last Year',
  ];
  disableSelect = new FormControl(false);
  private gridApi!: GridApi;
  public popupParent: HTMLElement = document.body;
  instancePopup: any = null;
  paginationPageSize = 10;
  stayScrolledToEnd = true;
  paginationScrollCount: any;
  dealerlist: any = [];
  dealerListData: any = [];
  dealerListArray: any = [];
  shipmentDatalist: any = [];
  dealerss: any = [];
  dropdownStatusList: any = [];
  statusDropList: any = [];
  statusAllarray: any = [];
  statusList: any = [];
  selectedItems: any = [];
  searchText: any = '';
  startDateShip: any = '';
  endDateShip: any = '';
  startDateInvoice: any = '';
  endDateInvoice: any = '';
  selectedDateRange: any;
  selectedDateRanges: any;
  loggedUserId: any;
  
  columnDefs: ColDef[] = [];
 
  constructor(
    public dialog: MatDialog,
    private sharedService: SharedService,
    private sharedserviceForshipment: SharedServicesShipmentService,
    public orders: OrdersApisService,
    private user: UserService,
    private route: ActivatedRoute,
    private orderShipment: OrderShipmentService,

    private otherMasterService: OtherMasterService,
    private sharedServiceCalendar: SharedServiceCalendarService,
    private fb: FormBuilder,
    private SS:SharedService
  ) {
    this.sharedserviceForshipment.listen().subscribe((m: any) => {
      console.log(m);
      this.shipmentList();
    });
    // .pipe(take(1))
    this.SS.ReloadaddOrg.subscribe(()=>{
      // alert('refresh')
      this.shipmentList()
    })

    this.route.data.subscribe((v) => {
      this.currentPageName = v['key'];
      let actionColumn = v['orderList'];
      let showCaseMenuList: string[] = [];
      let userRolesData = JSON.parse(localStorage.getItem('userroles') ?? '[]');

      userRolesData.forEach((element) => {
        if (element.title == this.currentPageName) {
          this.columnDefs = this.columnDefs.filter((x) => {
            if (x.colId != 'action' || element == undefined || element == null)
              return true;

            element.permission.forEach((item) => {
              if (
                actionColumn.indexOf(item.action.toLowerCase()) !== -1 &&
                item.status
              ) {
                showCaseMenuList.push(item.action);
              }
            });
            return showCaseMenuList.length !== 0;
          });
        }
      });
    });
  }
  
  ngOnInit(): void {
    this.userType = localStorage.getItem('userType');
    this.loggedUserId = localStorage.getItem('logInId');
   this.updateColumnDefs()
    this.myForm = this.fb.group({
      city: [this.selectedItems],
    });
    this.statusForm = this.fb.group({
      status: [this.selectedItems],
    });
    this.shipmentList();
    this.dealerDropdownData();
    this.statusItems();
  }

  updateColumnDefs() {
    if (this.userType === 'Dealer Admin') {
      this.columnDefs = [
        {
          headerName: 'Order #',
          field: 'orderNUmber',
          tooltipField: 'orderNUmber',
          cellStyle: { color: '#017EFA' },
          cellEditorPopup: true,
          onCellClicked: (event: CellClickedEvent) =>
            this.dialog.open(OrdersReceiveShipmentComponent, {
              maxWidth: '95vw',
              height: '95vh',
            }),
        },
        {
          headerName: 'Order Date',
          field: 'orderDate',
          tooltipField: 'orderDate',
          // cellRenderer: (data) => {
          //   return this.sharedService.dateformat(data.value);
          // },
          cellRenderer: (data) => {
            const formattedDate = this.sharedService.dateformat(data.value);
            const coloredDate = `<span style="color: #686E74;">${formattedDate}</span>`;
            return coloredDate;
          },
          type: ['nonEditableColumn'],
        },
        {
          headerName: 'Invoice Date',
          field: 'invoiceDate',
          tooltipField: 'invoiceDate',
          // cellRenderer: (data) => {
          //   return this.sharedService.dateformat(data.value);
          // },
          cellRenderer: (data) => {
            const formattedDate = this.sharedService.dateformat(data.value);
            const coloredDate = `<span style="color: #686E74;">${formattedDate}</span>`;
            return coloredDate;
          },

        },
        {
          headerName:'Invoice Qty',
          field: 'invoiceQty',
          tooltipField: 'invoiceQty',
          cellStyle: {
            'color': '#686E74' 
          },
          type: ['rightAligned']
        },
        {
          headerName: 'invoice Value($)',
          field: 'invoiceValue',
          tooltipField: 'invoiceValue',
          type: ['rightAligned'],
          cellStyle: {
            'color': '#686E74' 
          },
        },
        {
          headerName: 'ordered Quantity',
          field: 'orderedQty',
          tooltipField: 'orderedQty',
          type: ['rightAligned'],
          cellStyle: {
            'color': '#686E74' 
          },
        },
        {
          headerName:'ordered Value($)',
          field: 'orderedvalue',
          tooltipField: 'orderedvalue',
          type: ['rightAligned'],
          cellStyle: {
            'color': '#686E74' 
          },
        },    
        {
          headerName: 'System Receive Date',
          field: 'systemReciptDate',
          tooltipField: 'systemReciptDate',
          // cellRenderer: (data) => {
          //   return this.sharedService.dateformat(data.value);
          // },
          cellRenderer: (data) => {
            const formattedDate = this.sharedService.dateformat(data.value);
            const coloredDate = `<span style="color: #686E74;">${formattedDate}</span>`;
            return coloredDate;
          },
        },
        
        {
          headerName: 'Status',
          field: 'statusName',
          tooltipField: 'statusName',
          cellEditorParams: {
            values: ['In-Transit', 'Received'],
          },
          cellClass: (params) => {
            return params.value == 'Received'
              ? 'received'
              : params.value == 'In-Transit'
              ? 'Transit'
              : '';
          },
        },
        {
          headerName: '',
          colId: 'action',
          cellRenderer: OrderlistActionPopupComponent,
          editable: false,
          maxWidth: 70,
        },
      ];
    } 
    else {
      this.columnDefs = [
    {
      headerName: 'Order #',
      field: 'orderNUmber',
      tooltipField: 'orderNUmber',
      cellStyle: { color: '#017EFA' },
      cellEditorPopup: true,
      maxWidth:100,
      minWidth:100,
      onCellClicked: (event: CellClickedEvent) =>
        this.dialog.open(OrdersReceiveShipmentComponent, {
          maxWidth: '95vw',
          height: '95vh',
        }),
    },
    {
      headerName: 'Order Date',
      field: 'orderDate',
      tooltipField: 'orderDate',
      maxWidth:130,
      minWidth:130,
      // cellRenderer: (data) => {
      //   return this.sharedService.dateformat(data.value);
      // },
      cellRenderer: (data) => {
        const formattedDate = this.sharedService.dateformat(data.value);
        const coloredDate = `<span style="color: #686E74;">${formattedDate}</span>`;
        return coloredDate;
      },
      type: ['nonEditableColumn'],
    },
    {
      headerName: 'Dealer',
      field: 'dealername',
      type: ['nonEditableColumn'],
      tooltipField: 'dealername',
      maxWidth:200,
      minWidth:200,
      cellStyle: {
        'color': '#686E74' 
      },
    },
    {
      headerName: 'Invoice #',
      field: 'invoiceNumber',
      tooltipField: 'invoiceNumber',
      maxWidth:120,
      minWidth:120,
      type: ['rightAligned'],
      cellStyle: {
        'color': '#686E74' 
      },
    },
    {
      headerName: 'Invoice Date',
      field: 'invoiceDate',
      tooltipField: 'invoiceDate',
      maxWidth:130,
      minWidth:130,
      // cellRenderer: (data) => {
      //   return this.sharedService.dateformat(data.value);
      // },
      cellRenderer: (data) => {
        const formattedDate = this.sharedService.dateformat(data.value);
        const coloredDate = `<span style="color: #686E74;">${formattedDate}</span>`;
        return coloredDate;
      },
    },
    {
      headerName: this.userType == 'Admin' ? 'INQ' : 'invoiceQty',
      field: 'invoiceQty',
      tooltipField: 'invoiceQty',
      maxWidth:80,
      minWidth:80,
      type: ['rightAligned'],
      cellStyle: {
        'color': '#686E74' 
      },
    },
    {
      headerName: this.userType == 'Admin' ? 'INV($)' : 'invoiceValue',
      field: 'invoiceValue',
      tooltipField: 'invoiceValue',
      maxWidth:90,
      minWidth:90,
      type: ['rightAligned'],
      cellStyle: {
        'color': '#686E74' 
      },
    },
    {
      headerName: this.userType == 'Admin' ? 'TOQ' : 'Ordered Quantity',
      field: 'orderedQty',
      tooltipField: 'orderedQty',
      maxWidth:80,
      minWidth:80,
      type: ['rightAligned'],
      cellStyle: {
        'color': '#686E74' 
      },
    },
    {
      headerName: this.userType == 'Admin' ? 'TOV' : 'Ordered Value($)',
      field: 'orderedvalue',
      tooltipField: 'orderedvalue',
      type: ['rightAligned'],
      cellStyle: {
        'color': '#686E74' 
      },
    },    
    {
      headerName: 'System Receive Date',
      maxWidth:190,
      minWidth:190,
      field: 'systemReciptDate',
      tooltipField: 'systemReciptDate',
      // cellRenderer: (data) => {
      //   return this.sharedService.dateformat(data.value);
      // },
      cellRenderer: (data) => {
        const formattedDate = this.sharedService.dateformat(data.value);
        const coloredDate = `<span style="color: #686E74;">${formattedDate}</span>`;
        return coloredDate;
      },
    },
    
    {
      headerName: 'Status',
      field: 'statusName',
      tooltipField: 'statusName',
      maxWidth:130,
      minWidth:130,
      cellStyle: {
        'color': '#686E74' 
      },
      cellEditorParams: {
        values: ['In-Transit', 'Received','delete'],
      },
      cellClass: (params) => {
        return params.value == 'Received'
          ? 'received'
          : params.value == 'In-Transit'
          ? 'Transit'
          : '';
      },
    },
    {
      headerName: '',
      colId: 'action',
      cellRenderer: OrderlistActionPopupComponent,
      editable: false,
      maxWidth:20,
      minWidth:20,
    },

    // {
    //   headerName: 'Shipment No.',
    //   field: 'shipmentNumber',
    //   tooltipField: 'shipmentNumber',
    // },
    // {
    //   headerName: 'Shipment Date',
    //   field: 'shipmentDate',
    //   tooltipField: 'shipmentDate',

    //   cellRenderer: (data) => {
    //     return this.sharedService.dateformat(data.value);
    //   },
    // },
    // {
    //   headerName: 'Dealer',
    //   field: 'dealername',
    //   type: ['nonEditableColumn'],
    //   tooltipField: 'dealername',
    // },
    // {
    //   headerName: 'Invoice No.',
    //   field: 'invoiceNumber',
    //   tooltipField: 'invoiceNumber',
    // },
    // {
    //   headerName: 'Total Items In Order',
    //   field: 'inorder',
    //   tooltipField: '',
    //   type: ['rightAligned'],
    // },
    // {
    //   headerName: 'In shipment',
    //   field: 'shipment',
    //   tooltipField: '',
    //   type: ['rightAligned'],
    // },
    
  ];
    }
  }
  
public defaultColDef: ColDef = {
  suppressSizeToFit: true,
  // set the default column width
  // make every column editable
  // editable: true,
  // make every column use 'text' filter by default
  // filter: 'agTextColumnFilter',
  // enable floating filters by default
  // make columns resizable
  flex: 1,
  minWidth: 100,
  resizable: true,
  sortable: true,
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
  currentPageName: string = '';
  statusDropDown: any;

  clickNextRendererFunc() {
    // alert('hlo');
  }
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    params.api.sizeColumnsToFit();
  }
  onFirstDataRendered(params: FirstDataRenderedEvent) {
    // this.otherMasterService.listen().subscribe((m: any) => {
    //   console.log("RefreshData",m)
    //   setTimeout (() => {
    //     this.shipmentList();
    //  }, 2000);

    // })
    // this.targetGroupService.listen().subscribe((m: any) => {
    //   console.log("RefreshData",m)
    //   setTimeout (() => {
    //     this.shipmentList();
    //  }, 2000);

    // })
    this.orderShipment.listen().subscribe((m: any) => {
      console.log('RefreshData', m);
      setTimeout(() => {
        this.shipmentList();
      }, 2000);
    });
    params.api.paginationGoToPage(4);
  }
  onCellValueChanged(event: CellValueChangedEvent) {
    // alert(event.value);
    console.log(
      'onCellValueChanged: ' + event.colDef.field + ' = ' + event.newValue
    );
  }
  openDialog() {}
  onCellClicked(e): void {
    localStorage.setItem('ViewOrReceive', 'View');
    console.log(e);
    localStorage.setItem('customerPOIdForShipment', e.data.invoiceId);
    localStorage.setItem('OrderNumberToShow', e.data.orderNUmber);

    localStorage.setItem('orderOrShipmentOrRecipt', 'shipment');
    let cellCLickedpromotion = '1';
    localStorage.setItem('cellCLickedpromotion', cellCLickedpromotion);
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
        this.instancePopup = instance;
        instance.togglePopup();
      }
    }
    localStorage.setItem('ShipmentDelete','Delete')
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
      this.stayScrolledToEnd = scrollDiff <= this.paginationPageSize;
      this.paginationScrollCount = this.shipmentDatalist.length;
    }
  }
  dateChange(e) {
    this.minDateToFinish.next(e.value.toString());
  }
  bulkDownload() {
    sessionStorage.setItem('bulkShipDownload', 'ShipmentDownload');
    sessionStorage.setItem('OrderReceiptDownload', '');
    this.dialog.open(ShipOrderBulkDownloadComponent, {
      width: '1500px',
      maxWidth: '98vw',
    });
  }
  selectdays() {
    this.dialog.open(CustomDatePopupComponent, { panelClass: 'custmdays' });
  }
  // selectedDateRange = {
  //   startDate: '11/11/2022',
  //   endDate: '11/15/2022',
  // }

  customShipDatePickerEvent(eventChange) {
    this.selectedDateRange = eventChange.selectedDate;
    this.startDateShip = this.selectedDateRange.startDate;
    this.endDateShip = this.selectedDateRange.endDate;
    console.log(this.selectedDateRange);
    let data = {
      StatusId: [],
      DealerId: this.dealerss,
      StartDateship: this.startDateShip,
      EndDateship: this.endDateShip,
      StartDateinvoice: '',
      EndDateinvoice: '',
      Search: '',
      CurrentUserId: this.loggedUserId,
    };
    this.orders.getShipmentList(data).subscribe((res) => {
      this.shipmentDatalist = res.response;
      console.log('Response', this.shipmentDatalist);
    });
  }
  customInvoiceDatePickerEvent(eventChange) {
    this.selectedDateRanges = eventChange.selectedDate;
    this.startDateInvoice = this.selectedDateRanges.startDate;
    this.endDateInvoice = this.selectedDateRanges.endDate;
    console.log(this.selectedDateRanges);
    let data = {
      StatusId: [],
      DealerId: this.dealerss,
      StartDateship: this.startDateShip,
      EndDateship: this.endDateShip,
      StartDateinvoice: this.startDateInvoice,
      EndDateinvoice: this.endDateInvoice,
      Search: '',
      CurrentUserId: this.loggedUserId,
    };

    this.orders.getShipmentList(data).subscribe((res) => {
      this.shipmentDatalist = res.response;
      console.log('Response', this.shipmentDatalist);
    });
  }
  orderShipmentUpload() {
    sessionStorage.setItem('sales', '');
    sessionStorage.setItem('orderReceipt', '');
    sessionStorage.setItem('orderShipment', 'shipment');
    this.dialog.open(SalesBulkUploadComponent, { maxWidth: '97vw' });
    // this.isOpen = false;
  }
  shipmentList() {
    let data = {
      StatusId: [],
      DealerId: [],
      StartDateship: '',
      EndDateship: '',
      StartDateinvoice: '',
      EndDateinvoice: '',
      Search: '',
      CurrentUserId: this.loggedUserId,
    };
    this.orders.getShipmentList(data).subscribe((res) => {
      this.shipmentDatalist = res.response;
      console.log('Response', this.shipmentDatalist);
      this.shipmentDatalist.forEach((element) => {
        element.shipmentDate = this.sharedService.dateformat(
          element.shipmentDate
        );

        this.shipmentDatalist.forEach((element) => {
          element.orderDate = this.sharedService.dateformat(element.orderDate);
        });

        this.shipmentDatalist.forEach((element) => {
          element.invoiceDate = this.sharedService.dateformat(
            element.invoiceDate
          );
        });
      });
    });
  }
  dealerDropdownData() {
    this.user.dealerDropdownOrderlist().subscribe((res: any) => {
      this.dealerlist = res.response;
      let localdata = res.response;
      this.dealerListData = localdata.map(
        (data: { customerId: any; customerName: any }) => {
          return {
            customerId: data.customerId,
            customerName: data.customerName,
          };
        }
      );
      this.dealerListData.push();
      this.dealerListData.forEach((element) => {
        return this.dealerListArray.push(element.customerId);
      });
      console.log('dealerAllarray', this.dealerListArray);
    });
    this.dealerSettings = {
      singleSelection: false,
      idField: 'customerId',
      textField: 'customerName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
  }
  DealerorderSelect(item: any) {
    this.dealerss.push(item.customerId);
    let data = {
      StatusId: this.statusList,
      DealerId: this.dealerss,
      StartDateship: this.startDateShip,
      EndDateship: this.endDateShip,
      StartDateinvoice: this.startDateInvoice,
      EndDateinvoice: this.endDateInvoice,
      Search: this.searchText,
      CurrentUserId: this.loggedUserId,
    };
    this.orders.getShipmentList(data).subscribe((res) => {
      this.shipmentDatalist = res.response;
      console.log('Response', this.shipmentDatalist);
    });
  }
  DealerDeselect(item: any) {
    console.log(item);
    this.dealerss.forEach((element, index) => {
      if (element == item.customerId) this.dealerss.splice(index, 1);
    });
    let data = {
      StatusId: this.statusList,
      DealerId: this.dealerss,
      StartDateship: this.startDateShip,
      EndDateship: this.endDateShip,
      StartDateinvoice: this.startDateInvoice,
      EndDateinvoice: this.endDateInvoice,
      Search: this.searchText,
      CurrentUserId: this.loggedUserId,
    };
    this.orders.getShipmentList(data).subscribe((res) => {
      this.shipmentDatalist = res.response;
      console.log('Response', this.shipmentDatalist);
    });
  }
  DealerDeselectAll(item: any) {
    this.dealerss = [];
    let data = {
      StatusId: this.statusList,
      DealerId: this.dealerss,
      StartDateship: this.startDateShip,
      EndDateship: this.endDateShip,
      StartDateinvoice: this.startDateInvoice,
      EndDateinvoice: this.endDateInvoice,
      Search: this.searchText,
      CurrentUserId: this.loggedUserId,
    };
    this.orders.getShipmentList(data).subscribe((res) => {
      this.shipmentDatalist = res.response;
      console.log('Response', this.shipmentDatalist);
    });
  }
  DealerorderSelectAll(item: any) {
    this.dealerss = this.dealerListArray;
    console.log('AllDealers', this.dealerss);
    let data = {
      StatusId: this.statusList,
      DealerId: this.dealerss,
      StartDateship: this.startDateShip,
      EndDateship: this.endDateShip,
      StartDateinvoice: this.startDateInvoice,
      EndDateinvoice: this.endDateInvoice,
      Search: this.searchText,
      CurrentUserId: this.loggedUserId,
    };
    this.orders.getShipmentList(data).subscribe((res) => {
      this.shipmentDatalist = res.response;
      console.log('Response', this.shipmentDatalist);
    });
  }
  statusItems() {
    this.user.statusDropdownOrderlist().subscribe((res: any) => {
      this.dropdownStatusList = res.response;

      this.statusDropDown = this.dropdownStatusList.filter(
        (element) =>
          element.statusName == 'In-Transit' || element.statusName == 'Received'
      );

      console.log('StatusDropdown');
      let localdata = this.dropdownStatusList;
      this.statusDropList = localdata.map(
        (data: { statusId: any; statusName: any }) => {
          return { statusId: data.statusId, statusname: data.statusName };
        }
      );
      this.statusDropList.push();
      this.statusDropList.forEach((element) => {
        return this.statusAllarray.push(element.statusId);
      });
      console.log('buleditGeo', this.statusAllarray);
      this.dropdownSettings2 = {
        singleSelection: false,
        idField: 'statusId',
        textField: 'statusName',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 1,
        allowSearchFilter: false,
      };
    });
  }
  statusdropdownselect(item: any) {
    this.statusList.push(item.statusId);
    let data = {
      StatusId: this.statusList,
      DealerId: this.dealerss,
      StartDateship: this.startDateShip,
      EndDateship: this.endDateShip,
      StartDateinvoice: this.startDateInvoice,
      EndDateinvoice: this.endDateInvoice,
      Search: this.searchText,
      CurrentUserId: this.loggedUserId,
    };
    this.orders.getShipmentList(data).subscribe((res) => {
      this.shipmentDatalist = res.response;
      console.log('Response', this.shipmentDatalist);
    });
  }
  statusDeselect(item: any) {
    this.statusList.forEach((element, index) => {
      if (element == item.statusId) this.statusList.splice(index, 1);
    });
    let data = {
      StatusId: this.statusList,
      DealerId: this.dealerss,
      StartDateship: this.startDateShip,
      EndDateship: this.endDateShip,
      StartDateinvoice: this.startDateInvoice,
      EndDateinvoice: this.endDateInvoice,
      Search: this.searchText,
      CurrentUserId: this.loggedUserId,
    };
    this.orders.getShipmentList(data).subscribe((res) => {
      this.shipmentDatalist = res.response;
      console.log('Response', this.shipmentDatalist);
    });
  }
  statusDeselectAll(item: any) {
    this.statusList = [];
    let data = {
      StatusId: this.statusList,
      DealerId: this.dealerss,
      StartDateship: this.startDateShip,
      EndDateship: this.endDateShip,
      StartDateinvoice: this.startDateInvoice,
      EndDateinvoice: this.endDateInvoice,
      Search: this.searchText,
      CurrentUserId: this.loggedUserId,
    };
    this.orders.getShipmentList(data).subscribe((res) => {
      this.shipmentDatalist = res.response;
      console.log('Response', this.shipmentDatalist);
    });
  }
  statusselectAll(item: any) {
    this.statusList = this.statusAllarray;
    let data = {
      StatusId: this.statusList,
      DealerId: this.dealerss,
      StartDateship: this.startDateShip,
      EndDateship: this.endDateShip,
      StartDateinvoice: this.startDateInvoice,
      EndDateinvoice: this.endDateInvoice,
      Search: this.searchText,
      CurrentUserId: this.loggedUserId,
    };
    this.orders.getShipmentList(data).subscribe((res) => {
      this.shipmentDatalist = res.response;
      console.log('Response', this.shipmentDatalist);
    });
  }
  onSearchChange($event: any, anything?: any) {
    const { target } = $event;
    this.searchText = target.value;
    let data = {
      StatusId: this.statusList,
      DealerId: this.dealerss,
      StartDateship: this.startDateShip,
      EndDateship: this.endDateShip,
      StartDateinvoice: this.startDateInvoice,
      EndDateinvoice: this.endDateInvoice,
      Search: this.searchText,
      CurrentUserId: this.loggedUserId,
    };
    this.orders.getShipmentList(data).subscribe((res) => {
      this.shipmentDatalist = res.response;
      console.log('Response', this.shipmentDatalist);
    });
  }
  convertedDateFormat() {
    var x = new Date();
    var y = x.getFullYear().toString();
    var m = (x.getMonth() + 1).toString();
    var d = x.getDate().toString();
    d.length == 1 && (d = '0' + d);
    m.length == 1 && (m = '0' + m);
    return d + m + y;
  }

  shipmentDownload() {
    this.gridApi.exportDataAsCsv({
      fileName: 'Shipment_order' + this.convertedDateFormat(),
    });
  }
  refresh() {
    this.myForm = this.fb.group({
      city: [this.selectedItems],
    });
    this.statusForm = this.fb.group({
      status: [this.selectedItems],
    });
    this.statusList = [];
    this.dealerss = [];
    this.startDateShip = '';
    this.endDateShip = '';
    this.startDateInvoice = '';
    this.endDateInvoice = '';
    this.searchText = '';
    let data = {
      StatusId: this.statusList,
      DealerId: this.dealerss,
      StartDateship: this.startDateShip,
      EndDateship: this.endDateShip,
      StartDateinvoice: this.startDateInvoice,
      EndDateinvoice: this.endDateInvoice,
      Search: this.searchText,
      CurrentUserId: this.loggedUserId,
    };
    const searchInput = document.getElementById('searchInput') as HTMLInputElement;   if (searchInput) {     searchInput.value = this.searchText;   }
    this.orders.getShipmentList(data).subscribe((res) => {
      this.shipmentDatalist = res.response;
      console.log('Response', this.shipmentDatalist);
    });
    this.sharedServiceCalendar.filter('Register click');
  }

  close() {
    this.date = false;
    this.selectedDate = false;
  }
}
