import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {environment} from '../../../environments/environment';
import {User} from '../../models/user';

@Injectable()
export class ApiService {

    private BASE_API = environment.baseApi;

    constructor(private _http: HttpClient) {
    }

    sendUserDate(user: User): Observable<any> {
        const body = JSON.stringify(user);
        return this._http.post(this.BASE_API, body);
    }

}
