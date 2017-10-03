import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';

import { AccountDataService, ContactsDataService,ArticleListConfig } from '../shared';
import {Account, Stage, Status, Types} from '../shared/models';
import { environment } from '../../environments/environment';
import * as _ from 'lodash'; 
declare var $: any;
const APP_URL = environment.appUrl;
const API_URL = environment.apiUrl;

@Component({
  selector: 'home-page',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  accounts: Account[] = [];
  selectedType: string = 'Leads';
  type = {
    _id: String,
    name: String,
    order: Number,
    createdAt: Date,
  };
  rows = [];    
  temp = [];
  statusFilter = [];
  statuses: Status[] = [];
  stages: Stage[] = [];
  types: Types[] = [];
  selectedTypeId: String;
  showPrimaryContact:boolean = false;
  states = [];
  account = {
    mainAccount: {
      name:"",
      title:"",
      addresses:[{
        addressLine1:"",
        city:"",
        state:"",
        zip:"",
      }],
      email:"",
      phones:[{
        type:"",
        number:""
      }]
    },
    primaryAccount:{
      name:"",
      title:"",
      addresses:[{
        addressLine1:"",
        city:"",
        state:"",
        zip:"",
      }],
      email:"",
      phones:[{
        type:"",
        number:""
      }]
    },
    cars_per_year:Number,
  };
  accountId:string;

  @ViewChild(DatatableComponent) table: DatatableComponent;
  constructor(
    private router: Router,
    private accountDataService: AccountDataService,
    private contactsDataService : ContactsDataService,
  ) {
    this.states = this.accountDataService.states;
    this.fetch((data) => {
    // cache our list
    this.temp = [...data];

    // push our inital complete list
    this.rows = data;
    this.statusFilter = data;
  })
}

  fetch(cb) {
    const req = new XMLHttpRequest();
    req.open('GET', API_URL+ `/accounts`);

    req.onload = () => {
      let data = (JSON.parse(req.response));
      //JSON.parse((JSON.stringify(req.response)));
      cb(data.data);
    };

    req.send();
  }



  ngOnInit() {
  }

}
