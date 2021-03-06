import {Injectable, EventEmitter} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

import {RequestServices} from './request.services';
import {LocalStorageServices} from './local-storage.services';

import {UserModel} from '../models/user.model';
import {NavigationItemModel} from '../models/navigation-item.model';

/*
  User services. Authentication, user params changing etc.
*/
@Injectable()
export class UserServices {
    
    navigation: any[];
    user: UserModel;
    
    subscription: Subject<UserModel> = new Subject<UserModel>();
    modulesChanged: EventEmitter<void> = new EventEmitter();

    constructor(private _request: RequestServices,
                private _storage: LocalStorageServices) {
    }

    /*
      Fetch initial user profile params
     */
    fetchProfileParams(): Promise<UserModel> {
        return this._request.get('v1/account/info')
            .then(result => {
                this.changeUserParam('profile', result['user']);
                this.changeUserParam('balance', result['balance']);
                return Promise.resolve(this.fetchUser());
            });
    }

    /*
      Saving user data
     */
    saveUserData = (user): void => {
        this._storage.writeItem('pbx_user', user);
        this.touchUser();
    }
    /*
      Changing user param
     */
    changeUserParam = (param: string, value: any): void => {
        const user = this._storage.readItem('pbx_user');
        user[param] = value;
        // this.logger.log(`User after '${param}' changing to '${value}'`, user);
        this._storage.writeItem('pbx_user', user);
        this.touchUser();
    }

    /*
      Fetch initial navigation params, based on current user tariff plan
     */
    fetchNavigationParams(): Promise<NavigationItemModel[][]> {
        return this._request.get('v1/nav').then(result => {
            this.navigation = result['items'];
            return Promise.resolve(result['items']);
        });
    }

    /*
      Fetch if user already logged in
     */
    fetchUser = (): UserModel | null => {
        return this._storage.readItem('pbx_user');
    }

    /*
      Refresh user params
     */
    touchUser(): void {
        this.user = this._storage.readItem('pbx_user');
        this.subscription.next(this.user);
    }

    /*
      User params subscription
     */
    userSubscription(): Observable<UserModel> {
        return this.subscription.asObservable();
    }

}
