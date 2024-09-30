import { Component, OnInit } from '@angular/core';
import { AddMaterialsService } from 'src/app/services/add-materials.service';
import { ClassificationserviseService } from 'src/app/services/classificationservise.service';
import { OrdersApisService } from 'src/app/services/orders-apis.service';
import { SalesServicesService } from 'src/app/services/sales-services.service';
import * as moment from 'moment';
import dayjs from 'dayjs/esm';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MaterialListService } from 'src/app/services/material-list.service';

@Component({
  selector: 'app-advanced-filter',
  templateUrl: './advanced-filter.component.html',
  styleUrls: ['./advanced-filter.component.css']
})
export class AdvancedFilterComponent implements OnInit {
  targetGroupList: any;
  UserId: any;
  geoGraphyIdentifierList: any;
  isTargetGroupSelected: boolean = false;
  isgeoGraphyIdentifierSelected: boolean = false;
  ProductCustomIdentifier: any;
  isProductCustomIdentifierSelected: boolean = false;
  ProductCustomIdentifierList: any;
  arrayElements: any;
  categoryList: any;
  isCategorySelected: boolean = false;
  isSubCategorySelected: boolean = false;
  subcaty: any = [];
  typeSelected: boolean = false;
  typeList: any;
  isShipmentDateSelected: boolean = false;
  selectedDateRange: any;
  startDateShip: any;
  endDateShip: any;
  shipmentDatalist: any;
  menuDateValues: any;
  isReceiptDateSelected: boolean = false;
  isTargetGroupNameSelected: boolean = false;
  selectedItem: any;
  selectedItemsList: string[] = [];
  values: any = [];
  checkedCount: number = 0;
  GeoCheckedCount: number = 0;
  searchText = '';
  startDate: any;
  endDate: any;
  statusList: any;
  targetLists: any = [];
  itemOfgeogrphy: any = [];
  ProductCustomIdentifierElements: any = [];
  categoryItems: any = [];
  subcatItems: any = [];
  typeItems: any = [];
  PCICheckedCount: number = 0;
  // categorycheckedCount: number = 0;
  // subcategoryCheckedCount: number = 0;
  typeCount: number = 0;
  shipmentcheckedCount: number = 0;
  receiptcheckedCount: number = 0;
  reciptselectedMenu: string = "";
  shipmentselectedMenu: string = "";
  shipmentSelectedDateRange: any;
  removeItemOfTarget: boolean = false;
  groupId: any = [];
  geoIds: any = [];
  pcIElementIds: any = [];
  categoryIds: any = [];
  subCatIds: any = [];
  typeIds: any = [];
  categoryItemsList: any = [];
  startDateOfShipment: any;
  endDateOfShipment: any;

  constructor(private salesService: SalesServicesService,
    private addMaterials: AddMaterialsService,
    public orders: OrdersApisService,
    private dialogRef: MatDialogRef<any>,
    private materialList: MaterialListService) { }

  ngOnInit(): void {
    this.addTargetGroupElements();
    this.UserId = localStorage.getItem("logInId");
    localStorage.removeItem("category");
    localStorage.removeItem("subcategory");

  }
  addTargetGroupElements() {
    this.isgeoGraphyIdentifierSelected = false;
    this.isProductCustomIdentifierSelected = false;
    this.isCategorySelected = false;
    this.isSubCategorySelected = false;
    this.typeSelected = false;
    this.isShipmentDateSelected = false;
    this.isReceiptDateSelected = false;
    this.isTargetGroupSelected = true;
    this.salesService.getTargetList().subscribe((res) => {
      this.targetGroupList = res.response;
      // this.targetGroupList.map((ele) => {
      //  console.log( this.isCheckedForProduct(ele.targetGroupName));
      // })
    });
  }

  getGeoGraphyIdentifier() {
    this.isTargetGroupSelected = false;
    this.isProductCustomIdentifierSelected = false;
    this.isCategorySelected = false;
    this.isSubCategorySelected = false;
    this.typeSelected = false;
    this.isShipmentDateSelected = false;
    this.isReceiptDateSelected = false;
    this.isgeoGraphyIdentifierSelected = true;
    this.addMaterials.getGeographyIdentifier(this.UserId).subscribe((res:any) => {
      this.geoGraphyIdentifierList = res.response;
      console.log("this", this.geoGraphyIdentifierList);

    });
  }
  getProductCustomIdentifier() {
    this.isTargetGroupSelected = false;
    this.isgeoGraphyIdentifierSelected = false;
    this.isCategorySelected = false;
    this.isSubCategorySelected = false;
    this.typeSelected = false;
    this.isShipmentDateSelected = false;
    this.isReceiptDateSelected = false;
    this.isProductCustomIdentifierSelected = true;
    this.addMaterials.getProductCustomIdentifier().subscribe((res: any) => {
      this.ProductCustomIdentifierList = res.response;
    });
  }
  getCategory() {
    this.isTargetGroupSelected = false;
    this.isgeoGraphyIdentifierSelected = false;
    this.isProductCustomIdentifierSelected = false;
    this.isSubCategorySelected = false;
    this.typeSelected = false;
    this.isShipmentDateSelected = false;
    this.isCategorySelected = true;
    this.addMaterials.getclassification(true).subscribe((res: any) => {
      this.categoryList = res.response;
    });
    this.searchText = '';
  }
  getSubCategory() {
    this.isTargetGroupSelected = false;
    this.isgeoGraphyIdentifierSelected = false;
    this.isProductCustomIdentifierSelected = false;
    this.isCategorySelected = false;
    this.typeSelected = false;
    this.isShipmentDateSelected = false;
    this.isReceiptDateSelected = false;
    this.isSubCategorySelected = true;
    // var subcategory = JSON.parse(localStorage.getItem('category') ?? '[]');
    this.categoryItemsList = this.categoryItems.map((ele) => ele.catId);
    let Subdata = {
      catId: this.categoryItemsList,
      flag: true
    }
    this.materialList.onclickcat(Subdata).subscribe((res) => {
      this.subcaty = res.response;
      console.log("SubCategory", this.subcaty);
    });
    this.searchText = '';
  }

  getType() {
    this.isTargetGroupSelected = false;
    this.isgeoGraphyIdentifierSelected = false;
    this.isProductCustomIdentifierSelected = false;
    this.isCategorySelected = false;
    this.isSubCategorySelected = false;
    this.isShipmentDateSelected = false;
    this.isReceiptDateSelected = false;
    this.typeSelected = true;
    // var type = JSON.parse(localStorage.getItem('subcategory') ?? '[]');
    // this.typeItems = this.typeList;
    let Type = {
      subCatId: this.subcatItems.map((ele) => ele.subCatId)
    }
    this.materialList.onclicksubcat(Type).subscribe((res) => {
      this.typeList = res.response;
    });

  }
  getShipmentDate() {
    this.isTargetGroupSelected = false;
    this.isgeoGraphyIdentifierSelected = false;
    this.isProductCustomIdentifierSelected = false;
    this.isCategorySelected = false;
    this.isSubCategorySelected = false;
    this.typeSelected = false;
    this.isReceiptDateSelected = false;
    this.isShipmentDateSelected = true;
    this.getListOfdatesTypes();
  }
  getListOfdatesTypes() {
    this.menuDateValues = [
      {
        title: 'Custom',
        range: null
      },
      {
        title: 'last 30 days',
        range: [dayjs().subtract(29, 'days'), dayjs()],
      },
      {
        title: 'last 60 days',
        range: [dayjs().subtract(59, 'days'), dayjs()],
      },
      {
        title: 'last 90 days',
        range: [dayjs().subtract(89, 'days'), dayjs()],
      },
      {
        title: 'last 180 days',
        range: [dayjs().subtract(179, 'days'), dayjs()],
      },
      {
        title: 'This Month',
        range: [dayjs().startOf('month'), dayjs().endOf('month')],
      },
      {
        title: 'This Quater',
        range: [dayjs(moment().startOf('quarter').format('DD MMM YY')), dayjs(moment().endOf('quarter').format('DD MMM YY'))],
      },
      {
        title: 'This Year',
        range: [dayjs().startOf('year'), dayjs().endOf('year')],
      },
      {
        title: 'Last Month',
        range: [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')]
      },
      {
        title: 'Last Quater',
        range: [dayjs(moment().subtract(1, 'quarter').startOf('quarter').format('DD MMM YY')), dayjs(moment().subtract(1, 'quarter').endOf('quarter').format('DD MMM YY'))],
      },
      {
        title: 'Last Year',
        range: [dayjs().subtract(1, 'year').startOf('year'), dayjs().subtract(1, 'year').endOf('year')]
      }];

  }
  getReceiptDate() {
    this.isTargetGroupSelected = false;
    this.isgeoGraphyIdentifierSelected = false;
    this.isProductCustomIdentifierSelected = false;
    this.isCategorySelected = false;
    this.isSubCategorySelected = false;
    this.typeSelected = false;
    this.isShipmentDateSelected = false;
    this.isReceiptDateSelected = true;
    this.getListOfdatesTypes();
  }

  onItemClickOfTargetGroup(item: any) {
    if (!(this.isCheckedForProduct(item.targetGroupId, 'target'))) {
      this.targetLists.push(item);
    }
    else if (this.isCheckedForProduct(item.targetGroupId, 'target')) {
      let index = this.targetLists.findIndex(x => x.targetGroupId == item.targetGroupId);
      if (index > -1) {
        this.targetLists.splice(index, 1);
      }
    }

  }

  onItemClickOfGeograpy(item: any, event: any) {
    if (!(this.isCheckedForProduct(item?.geographyIdentiferid, 'geo'))) {
      //this.values.push(item?.geographyIdentifierName);
      this.itemOfgeogrphy.push(item);
    }
    else if (this.isCheckedForProduct(item?.geographyIdentiferid, 'geo')) {
      let index = this.itemOfgeogrphy.findIndex(x => x.geographyIdentiferid == item.geographyIdentiferid);
      if (index > -1) {
        this.itemOfgeogrphy.splice(index, 1);
      }
    }

  }

  onItemClick(item: any, event: any) {
    if (!(this.isCheckedForProduct(item.productCustomIdentifierId, 'product'))) {
      //this.values.push(item.productCustomName);
      this.ProductCustomIdentifierElements.push(item);
    }
    else if (this.isCheckedForProduct(item.productCustomIdentifierId, 'product')) {
      let index = this.ProductCustomIdentifierElements.findIndex(x => x.productCustomIdentifierId == item.productCustomIdentifierId);
      if (index > -1) {
        this.ProductCustomIdentifierElements.splice(index, 1);
      }
    }
  }

  onItemClickOfCategory(category: any, event: any) {
    localStorage.removeItem("category");
    this.subcatItems = [];
    if (!(this.isCheckedForProduct(category.catId, 'category'))) {
      //this.values.push(category.catName);
      this.categoryItems.push(category);
      localStorage.setItem("category", JSON.stringify(this.categoryItems));
    }
    else if (this.isCheckedForProduct(category.catId, 'category')) {

      // let index = this.categoryItems.indexOf(category);
      // if (index > -1) {
      let index = this.categoryItems.findIndex(x => x.catId == category.catId);
      this.categoryItems.splice(index, 1);
      // }
      // this.categoryItems = this.categoryItems.filter(function (el) {
      //   return el.catId !== category.catId;
      // });

      // if (this.categoryItems.length == 0) {
      //   this.isSubCategorySelected = false;
      //   this.typeSelected = false;
      //   this.subcatItems.length = 0;
      //   this.typeItems.length = 0;
      //   // this.subcategoryCheckedCount = 0;
      //   this.typeCount = 0;

      // }
      // else {
      //   this.isSubCategorySelected = true;
      // }

    }

  }
  onItemClickOfSubCategory(subcat: any, event: any) {
    localStorage.removeItem("subcategory");
    this.typeItems = [];
    if (!(this.isCheckedForProduct(subcat.subCatId, 'subcategory'))) {
      //this.values.push(subcat.subCatName);
      this.subcatItems.push(subcat);
      localStorage.setItem("subcategory", JSON.stringify(this.subcatItems));
    }
    else if (this.isCheckedForProduct(subcat.subCatId, 'subcategory')) {
      //this.values.pop(subcat.subCatName);
      let index = this.subcatItems.findIndex(x => x.subCatId == subcat.subCatId);
      this.subcatItems.splice(index, 1);
    }
  }
  onItemClickOfType(type: any, event: any) {
    if (!(this.isCheckedForProduct(type.typeId, 'type'))) {
      //this.values.push(type.typeName);
      this.typeItems.push(type);
    }
    else if (this.isCheckedForProduct(type.typeId, 'type')) {
      //this.values.pop(type.typeName);
      this.typeItems.pop(type);
    }


  }
  updateCount(event) {
    if (this.isTargetGroupSelected) {
      if (event.checked) {
        this.checkedCount++;
      }
      else if (this.checkedCount > 0) {
        this.checkedCount--;
      }
    }
    //  ||  || isSubCategorySelected || typeSelected"
  }
  updateCountForGeo(event: any) {
    if (this.isgeoGraphyIdentifierSelected) {
      if (event.checked) {
        this.GeoCheckedCount++;
      }
      else if (this.GeoCheckedCount > 0) {
        this.GeoCheckedCount--;
      }
    }
  }
  updateCountForPCI(event: any) {
    if (this.isProductCustomIdentifierSelected) {
      if (event.checked) {
        this.PCICheckedCount++;
      }
      else if (this.PCICheckedCount > 0) {
        this.PCICheckedCount--;
      }
    }

  }
  updateCountForCategory(event: any) {
    // if (this.isCategorySelected) {
    //   if (event.checked) {
    //     this.categorycheckedCount++;
    //   }
    //   else if (this.categorycheckedCount > 0) {
    //     this.categorycheckedCount--;
    //   }
    // }

  }
  updateCountForSubCAT(event: any) {
    // if (this.isSubCategorySelected) {
    //   if (event.checked) {
    //     this.subcategoryCheckedCount++;
    //   }
    //   else if (this.subcategoryCheckedCount > 0) {
    //     this.subcategoryCheckedCount--;
    //   }
    // }

  }
  updateCountForType(event: any) {
    if (this.typeSelected) {
      if (event.checked) {
        this.typeCount++;
      }
      else if (this.typeCount > 0) {
        this.typeCount--;
      }
    }

  }
  updateCountForShipment(event: any) {
    if (this.isShipmentDateSelected) {
      if (event.isTrusted) {
        this.shipmentcheckedCount = 1;
      }
      else if (this.shipmentcheckedCount > 0) {
        this.shipmentcheckedCount--;
      }
    }
  }
  updateCountForReceipt(event: any) {
    if (this.isReceiptDateSelected) {
      if (event.isTrusted) {
        this.receiptcheckedCount = 1;
      }
      else if (this.receiptcheckedCount > 0) {
        this.receiptcheckedCount--;
      }
    }

  }
  removeItem(item, type) {

    switch (type) {
      case 'target': {
        let taregetIndex = this.targetLists.findIndex(obj => obj.targetGroupId === item);
        this.targetLists.splice(taregetIndex, 1);
        if (this.checkedCount > 0) {
          this.checkedCount--;
        }
        break;
      }

      case 'geo': {
        const geoIndex = this.itemOfgeogrphy.indexOf(item);
        this.itemOfgeogrphy.splice(geoIndex, 1);
        if (this.GeoCheckedCount > 0) {
          this.GeoCheckedCount--;
        }
      }
        break;
      case 'product': {
        const PCIElement = this.ProductCustomIdentifierElements.indexOf(item);
        this.ProductCustomIdentifierElements.splice(PCIElement, 1);
        if (this.PCICheckedCount > 0) {
          this.PCICheckedCount--;
        }
        break;
      }
      case 'category': {
        const catIndex = this.categoryItems.indexOf(item);
        this.categoryItems.splice(catIndex, 1);
        // if (this.categorycheckedCount > 0) {
        //   this.categorycheckedCount--;
        // }
        break;
      }
      case 'subcategory': {
        const subCatItem = this.subcatItems.indexOf(item);
        this.subcatItems.splice(subCatItem, 1);
        // if (this.subcategoryCheckedCount > 0) {
        //   this.subcategoryCheckedCount--;
        // }
        break;
      }
      case 'type': {
        const typeItem = this.typeItems.indexOf(item);
        this.typeItems.splice(typeItem, 1);
        if (this.typeCount > 0) {
          this.typeCount--;
        }
        break;
      }

      default: {
        break;
      }
    }

  }
  close() {
    this.shipmentSelectedDateRange = { startDate: '', endDate: '' };
    if (this.shipmentcheckedCount > 0) {
      this.shipmentcheckedCount--;
    }

  }
  closeDate() {
    this.selectedDateRange = { startDate: '', endDate: '' };
    if (this.receiptcheckedCount > 0) {
      this.receiptcheckedCount--;
    }
  }

  isCheckedForProduct(item: any, type) {
    let productIdsList;
    switch (type) {
      case 'target': {
        productIdsList = this.targetLists;
        break;
      }
      case 'geo': {
        productIdsList = this.itemOfgeogrphy;
        break;
      }
      case 'product': {
        productIdsList = this.ProductCustomIdentifierElements;
        break;
      }
      case 'category': {
        productIdsList = this.categoryItems;
        break;
      }
      case 'subcategory': {
        productIdsList = this.subcatItems;
        break;
      }
      case 'type': {
        productIdsList = this.typeItems;
        break;
      }

      default: {
        productIdsList: []
      }
    }


    if (type == 'target') {
      this.groupId = this.targetLists.map(element => element.targetGroupId);
      if (this.targetLists.find(element => element.targetGroupId == item)) {
        return true;
      }
      else {
        return false
      }
    } else if (type == 'geo') {
      this.geoIds = this.itemOfgeogrphy.map(element => element.geographyIdentiferid);
      if (this.itemOfgeogrphy.find(element => element.geographyIdentiferid == item)) {
        return true;
      }
      else {
        return false;
      }
    }
    else if (type == 'product') {
      this.pcIElementIds = this.ProductCustomIdentifierElements.map(element => element.productCustomIdentifierId);
      if (this.ProductCustomIdentifierElements.find(element => element.productCustomIdentifierId == item)) {
        return true;
      }
      else {
        return false;
      }
    }

    else if (type == 'category') {
      this.categoryIds = this.categoryItems.map(element => element.catId);
      if (this.categoryItems.find(element => element.catId == item)) {
        return true;
      }
      else {
        return false;
      }
    }
    else if (type == 'subcategory') {
      this.subCatIds = this.subcatItems.map(element => element.subCatId);
      if (this.subCatIds.includes(item)) {
        return true;
      }
      else {
        return false;
      }
    }
    else if (type == 'type') {
      this.typeIds = this.typeItems.map(element => element.typeId);
      if (this.typeIds.includes(item)) {
        return true;
      }
      else {
        return false;
      }
    }

  }
  clearAll() {
    this.targetLists.length = 0;
    this.itemOfgeogrphy.length = 0;
    this.ProductCustomIdentifierElements.length = 0;
    this.categoryItems.length = 0;
    this.subcatItems.length = 0;
    this.typeItems.length = 0;
    this.shipmentSelectedDateRange = '';
    this.selectedDateRange = '';
    this.checkedCount = 0;
    this.GeoCheckedCount = 0;
    this.PCICheckedCount = 0;
    // this.categorycheckedCount = 0;
    // this.subcategoryCheckedCount = 0;
    this.typeCount = 0;
    this.shipmentcheckedCount = 0;
    this.receiptcheckedCount = 0;
    this.searchText = '';

  }
  applyAll() {
    let selectedFilters = {
      targetGroupIds: this.groupId,
      GeographyIdentifierIds: this.geoIds,
      productIdentifierIds: this.pcIElementIds,
      catogoryIds: this.categoryIds,
      subCategoryIds: this.subCatIds,
      typeIds: this.typeIds,
      shipmentStartdate: this.shipmentSelectedDateRange?.startDate,
      shipmentEnddate: this.shipmentSelectedDateRange?.endDate,
      receiptStartdate: this.selectedDateRange?.startDate,
      receiptEnddate: this.selectedDateRange?.endDate,
    }
    console.log("ssdsdsdsdsds", selectedFilters);
    this.dialogRef.close(selectedFilters);

  }
  getBackgroundColor(item, type) {

    switch (type) {
      case 'target':
        return '#0353A4';
        break;
      case 'geo':
        return '#F72585';
        break;

      case 'product':
        return '#017EFA';
        break;

      case 'category':
        return '#00187A';
        break;

      case 'subcategory':
        return '#0C5A3E';
        break;

      case 'type':
        return '#C32F27';
        break;

      default:
        break;
    }

    //     if (this.targetGroupList?.some(target => target['targetGroupId'] === item)) {
    //   return '#0353A4';
    // }
    // else if (this.geoGraphyIdentifierList?.some(vendor => vendor['geographyIdentiferid'] === item)) {
    //   return '#F72585';
    // }
    // else if (this.ProductCustomIdentifierList?.some(PCI => PCI.productCustomeIdentifiers.some((ele) => ele.productCustomIdentifierId === item))) {
    //   return '#017EFA';
    // }
    // else if (this.categoryList?.allOtherCats?.some(category => category['catId'] === item)) {
    //   return '#00187A';
    // }
    // else if (this.subcaty?.allOtherSubCAts?.some(subcategory => subcategory['subCatId'] === item)) {
    //   return '#0C5A3E';
    // }
    // else if (this.typeList?.some(types => types['typeId'] === item)) {
    //   return '#C32F27';
    // }
  }

  customDatePickerEvent(eventChange) {
    this.selectedDateRange = eventChange.selectedDate;
    this.startDate = this.selectedDateRange.startDate;
    this.endDate = this.selectedDateRange.endDate;
    this.reciptselectedMenu = eventChange.selectedMenu;
    console.log("dfdfdfdfdfd", this.selectedDateRange, this.reciptselectedMenu);
  }

  shipmentCustomDatePickerEvent(eventChange) {
    this.shipmentSelectedDateRange = eventChange.selectedDate;
    this.startDateOfShipment = this.shipmentSelectedDateRange.startDate;
    this.endDateOfShipment = this.shipmentSelectedDateRange.endDate;
    this.shipmentselectedMenu = eventChange.selectedMenu;
    console.log("dfdfdfdfdfd", this.shipmentSelectedDateRange, this.reciptselectedMenu);
  }

}

