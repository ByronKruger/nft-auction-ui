import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { UserStore } from '../../store/users/users.store';
import { Pagination, UserParams } from '../../_models/paginator';
import { SelectData } from '../../_models/selectData';
import { Charity, ClaimDeposit, RoleData, User, UserDetails, UserLogin, UserRegister, UserToken } from '../../_models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  user = signal<UserToken | null>(null);
  // roles: Signal<any>;

  // constructor() {
    // this.
  roles: Signal<any> = computed(() => {
    const user = this.user();
    if (user && user.token) {
      const role = JSON.parse(atob(user.token.split(".")[1])).role;
      return new Array(role);
    }
    return [];
  });

  // hasFunds: Signal<boolean> = computed(() => {
  //   const user = this.user();
  //   let hasFunds: boolean | string = false;
  //   if (user && user.token) {
  //     hasFunds = JSON.parse(atob(user.token.split(".")[1])).hasFunds;
  //   }
  //   hasFunds = (hasFunds === "False") ? false : true;
  //   return hasFunds;
  // });

  getTokenData(field: string): any {
    const localUser = localStorage.getItem("user");
    if (!localUser) return;
    const user = JSON.parse(localUser);
    let value: any;
    if (field === "hasFunds") {
      value = JSON.parse(atob(user.token.split(".")[1])).hasFunds;
    } else {
      value = JSON.parse(atob(user.token.split(".")[1])).hasNfts;
    }
    console.log("%cvalue", "background-color: purple; color: white; font-size: 30px;");
    console.log(value);
    value = value === "True" ? true : false;
    console.log("%cvalue (after)", "background-color: purple; color: white; font-size: 30px;");
    console.log(value);
    return value;
  }

  login(userLogin: UserLogin): Observable<any> {
    return this.http.post<UserToken>(this.apiUrl + "account/login", {...userLogin}).pipe(
      map(res => {
        localStorage.setItem('user', JSON.stringify(res));
        this.user.set(res);
        return res;
      })
    );
  }

  protectedResource() {
    this.http.get(this.apiUrl + "nft/getNfts").subscribe({
      next: (res) => console.log(res)
    });
  }

  getCharities(usedFor?: string): Observable<any> {
    return this.http.get<Charity>(this.apiUrl + "account/getCharities").pipe(
      map((chars: any) => {
        console.log("chars");
        console.log(chars);
        let data = new Array<SelectData | Charity>();

        if (usedFor === 'forSelect') {
          chars.result.forEach((char: any) => {
            data.push({
              viewValue: char.userName,
              value: char.id
            })
          });
          return data;
        }
        return data;
      })
    );
  }

  getUsers(pagination?: Pagination, userParams?: UserParams): Observable<any> { //?
    let params = new HttpParams();

    console.log("pagination");
    console.log(pagination);

    if (pagination?.currentPage && pagination?.itemsPerPage) {
      params = params.append("pageSize", pagination.itemsPerPage);
      params = params.append("pageNumber", pagination.currentPage); 
    }
    if (userParams?.username) {
      params = params.append("orderByUsername", userParams.username!);
    }
    console.log("params");
    console.log(params);

    return this.http.get<any>(this.apiUrl + "account/getUsers", { observe: 'response', params }); //?
  }

  getRoles(): Observable<Array<SelectData>>{
    return this.http.get<Array<RoleData>>(this.apiUrl + "account/getRoles").pipe(
      map(res => {
        let formDataRoles = new Array<SelectData>;
        res.forEach(role => {
          formDataRoles.push({
            value: role.name,
            viewValue: role.normalizedName
          });
        })
        return formDataRoles;
      })
    );
  }

  claimDeposit(claimDeposit: ClaimDeposit) : Observable<boolean>{
    return this.http.post<boolean>(this.apiUrl + "nft/claimDeposit", { Address: claimDeposit.address });
  }
  
  registerUser(user: UserRegister): Observable<UserToken> {
    return this.http.post<UserToken>(this.apiUrl + "account/register", { Username: user.username, Password: user.password, Type: user.userType });
  }

  logout(): void {
    localStorage.removeItem('user');
    this.user.set(null);
  }
}
