import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpEvent, HttpHandler, HttpHeaders, HttpParams, HttpRequest, JsonpClientBackend } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TargetListService {
  classificationurl = environment.url;

  constructor(private http: HttpClient) { }

  intercept(req: HttpRequest<any>,
    next: HttpHandler): Observable<HttpEvent<any>> {

    const idToken = localStorage.getItem("token");
  
    console.log('idtoken', idToken)
    // alert(idToken)

    if (idToken) {
      const cloned = req.clone({
        headers: req.headers.set("Authorization",
          "Bearer " + idToken)
      });

      return next.handle(cloned);
    }
    else {
      return next.handle(req);
    }
  }

  getTargetList() {
    //   return this.http.post<any>(`${this.classificationurl}MaterialApi/GetTargetGroup`,TargetGroup);
    // }

    // let options = {
    //   headers: new HttpHeaders().set('Content-Type', 'application/json')
    // };
    // JSON.stringify(TargetGroup)
    // return this.http.post<any>(this.classificationurl + 'MaterialApi/GetTargetGroup', TargetGroup);
  return this.http.get<any>(this.classificationurl + 'MaterialApi/GetTargetGroupList');
    

  }
  // http://13.126.235.145:801/api/DealerApi/GetTargetCount?targetgroupid=25
  public productCountAccordingToDealer(targetID: any) {
    return this.http.get<any>(`${this.classificationurl}DealerApi/GetTargetCount?targetgroupid=${targetID}`);
  }
  getDealers(){
    return this.http.get<any>(this.classificationurl + 'DealerApi/GetAssoDealerdrop');
  
  }
  // http://13.126.235.145:801/api/DealerApi/GetTargetGeographydrop?CustomerId=3120
  public geographyDropdown(dealerID: any) {
    return this.http.post<any>(this.classificationurl + 'DealerApi/GetTargetGeographydrop', dealerID);
  }
  // http://13.126.235.145:801/api/Dealerapi/AddTargetSDealer
  addTargetData(data:any){
    return this.http.post<any>(this.classificationurl + 'Dealerapi/AddTargetSDealer', data);
  }

  updateTargetData(data:any){
    return this.http.post<any>(this.classificationurl + 'Dealerapi/UpdateDealerTarget', data);

  }
  // http://13.126.235.145:801/api/DealerApi/GetProductGeoCount
  getProductCount(data:any){
    return this.http.post<any>(this.classificationurl + 'DealerApi/GetProductGeoCount', data);
  }


  getDealerDetails(data:any){
    return this.http.post<any>(this.classificationurl + 'DealerApi/GetProductGeoCount', data);
  }
// getTargetGrpList(){
//   return this.http.get<any>(this.classificationurl + 'MaterialApi/GetTargetGroup');
// }
  getTargetCode() {
    return this.http.get<any>(this.classificationurl + 'MaterialApi/GenerateTargetCode');

  }
 createTargetGroup(data){
    return this.http.post<any>(this.classificationurl + 'MaterialApi/AddEditTargetGroup', data)
  }
  editTargetGroup(data): Observable<any> {
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    };
    JSON.stringify(data)
    return this.http.post<any>(this.classificationurl + 'MaterialApi/GetTargetById', data);

  }
  getTargetSearch(data:any){
    // let options = {
    //   headers: new HttpHeaders().set('Content-Type', 'application/json')
    // };
    // JSON.stringify(data)
    return this.http.post<any>(this.classificationurl + 'MaterialApi/GetTargetGroup', data);

  }

  // getTargetSearch(){
  //   return this.http.get<any>(this.classificationurl + 'MaterialApi/GetTargetGroupList');
  // }

  onclickcat(Subdata){
    return this.http.post<any>(`${this.classificationurl}MaterialApi/GetSUbCAtsOfMultiCats`,Subdata);
  
  }

  getTargetListAll(data) {
    //   return this.http.post<any>(`${this.classificationurl}MaterialApi/GetTargetGroup`,TargetGroup);
    // }

    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    };
    JSON.stringify(data)
    return this.http.post<any>(this.classificationurl + 'PromotionsApi/GetProductList', data);

  }
// http://13.126.235.145:801/api/DealerApi/GetFinancialYear

financialYear() {
  return this.http.get<any>(this.classificationurl + 'DealerApi/GetFinancialYear');

}
getTargetById(data) {
  return this.http.post<any>(this.classificationurl + 'Dealerapi/GetDealerTargetDataByIdRow', data);

}
getTargetProductList(targetProduct) {

  return this.http.get<any>(`${this.classificationurl}DealerApi/GetProductListforCount?targetgroupid=${targetProduct}`);

}
}
