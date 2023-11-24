import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpEvent, HttpHandler, HttpHeaders, HttpParams, HttpRequest, JsonpClientBackend } from '@angular/common/http';
import { map, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class MaterialListService {
  classificationurl = environment.url;
  constructor(private http: HttpClient) { }

  intercept(req: HttpRequest<any>,
    next: HttpHandler): Observable<HttpEvent<any>> {

const idToken = localStorage.getItem("token");

console.log('idtoken',idToken)
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
  getclassification(flag:any){
    return this.http.get<any>(this.classificationurl + `MaterialApi/GetCategories?flag=${flag}`);
  
  }
  onclickcat(Subdata){
    return this.http.post<any>(`${this.classificationurl}MaterialApi/GetSUbCAtsOfMultiCats`,Subdata);
  
  }
  onclicksubcat(Type){
    return this.http.post<any>(`${this.classificationurl}MaterialApi/GettypesOfMultiSubCats`,Type);
  }
  getProduct(){
    return this.http.get<any>(this.classificationurl + 'MaterialApi/GetProductGroupList');
  
  }
  getStatusList(){
    return this.http.get<any>(this.classificationurl + 'MaterialApi/GetStatusList');
  
  }
  public getMaterialList(data) : Observable<any>{
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    };
    JSON.stringify(data)
        return this.http.post<any>(this.classificationurl+'MaterialApi/GetMaterailList',data);

      }
}
