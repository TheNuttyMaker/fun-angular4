import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { environment } from '../../../environments/environment';
// import {AccountDataService } from '../../../../../../account-data.service';
const API_URL = environment.apiUrl;

@Injectable()
export class ContactsDataService {

  headers = new Headers({ 'Content-Type': 'application/json' });
  options = new RequestOptions({ headers: this.headers });

  constructor(private http: Http) { }


  getContact(id) {
    return this.http.get(API_URL + `/accounts/` + id)
      .map((res: Response) => res.json());
  }

  createContact(id, contactObject) {    
    return this.http.post(API_URL + `/accounts/` + id + '/contacts', contactObject, this.options)
      .map((res: Response) => res.json());
  }

  getNotes(id) {
    return this.http.get(API_URL + `/accounts/` + id + '/notes')
      .map((res: Response) => res.json());
  }

  getAllContacts(id) {
    return this.http.get(API_URL + `/accounts/` + id + '/contacts')
      .map((res: Response) => res.json());
  }

  updateContact(id, contact) {
    return this.http.put(API_URL + `/accounts/` +id + '/contacts/'+ contact._id, contact, this.options)
      .map((res: Response) => res.json());
  }


  getStatuses() {
    return this.http.get(API_URL + '/accounts/statuses')
      .map((res: Response) => res.json());
  }

  getStatusById(id) {
    return this.http.get(API_URL + '/accounts/statuses/'+id)
      .map((res: Response) => res.json());
  }

  getStages(id) {
    return this.http.get(API_URL + `/accounts/statuses/` + id + '/stages')
      .map((res: Response) => res.json());
  }

  getStagesById(id, stageId) {
    return this.http.get(API_URL + `/accounts/statuses/` + id + '/stages/'+stageId)
      .map((res: Response) => res.json());
  }

  getTypes() {
    return this.http.get(API_URL + '/accounts/types')
      .map((res: Response) => res.json());
  }

  updateAccount(id, object) {    
    return this.http.put(API_URL + `/accounts/` +id, object, this.options)
      .map((res: Response) => res.json());
  }

  createAccount(accountObject) {    
    return this.http.post(API_URL + `/accounts`, accountObject, this.options)
      .map((res: Response) => res.json());
  }


}

