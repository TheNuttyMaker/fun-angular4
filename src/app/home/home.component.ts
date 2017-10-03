import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgForm } from '@angular/forms';

import { AccountDataService, ContactsDataService } from '../shared';
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
  });

  this.contactsDataService.getStatuses().subscribe(response => {
    this.statuses = _.sortBy(response.data, 'order')
    this.contactsDataService.getStages(response.data[0]._id).subscribe(response => {this.stages = _.sortBy(response.data, 'order')});
   });    
 this.contactsDataService.getTypes().subscribe(response => {this.types = _.sortBy(response.data, 'order'); this.selectedTypeId = response.data[0]._id});
 this.account.primaryAccount.phones[0].type = 'Main';
 this.account.primaryAccount.addresses[0].state = 'AL';
}

  fetch(cb) {
    console.log("hi");
    const req = new XMLHttpRequest();
    req.open('GET', API_URL+ `/accounts`);

    req.onload = () => {
      let data = (JSON.parse(req.response));
      //JSON.parse((JSON.stringify(req.response)));
      cb(data.data);
    };

    req.send();
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.temp.filter(function(d) {
      return d.primaryContactId.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  statusFunction(event){
    let val = event.toLowerCase();
    if(val === "all")
      val = '';
    // filter our data
    const temp = this.temp.filter(function(d) {
      if(d.statusId.name){
      return d.statusId.name.toLowerCase().indexOf(val) !== -1 || !val;
      }
    });

    let statusId = this.filterArray(event, this.statuses);
    this.contactsDataService.getStages(statusId).subscribe(response => {
      this.stages.splice(0,this.stages.length);
      this.stages = response.data;
      //this.selectedStageModel = response.data[0]._id;
  });

    // update the rows
    this.rows = temp;
    this.table.offset = 0;



  }


  stageFunction(event){
    let val = event.toLowerCase();
    if(val === "all")
      val = '';
        // filter our data
        const temp = this.statusFilter.filter(function(d) {
          if(d.stageId.name){
          return d.stageId.name.toLowerCase().indexOf(val) !== -1 || !val;
          }
        });
    
        // update the rows
        this.rows = temp;
        // Whenever the filter changes, always go back to the first page
        this.table.offset = 0;
  }

  typeFunction(event){    
    let val = event.toLowerCase();
    if(val === "all")
      val = '';
        // filter our data
        const temp = this.temp.filter(function(d) {
          if(d.typeId.name){
          return d.typeId.name.toLowerCase().indexOf(val) !== -1 || !val;
          }
        });
    
        // update the rows
        this.rows = temp;
        // Whenever the filter changes, always go back to the first page
        this.table.offset = 0;
  }


  redirectContact(value){
    this.accountDataService.accountId = value;
    //window.open(APP_URL+"components/base/tables/"+value);
    this.router.navigate(["/account/"+value]);
  }

  customTrackBy(index: number, obj: any): any {
    return index;
  }


  updateTypeId(value){
    this.selectedTypeId = this.filterArray(value, this.types);
  }

  filterArray(value, arr){
    for (var n in arr) {  
      if(arr[n]['name'] === value){
        return arr[n]['_id'];
      }
    }
  }

  onSubmit(form){
    let accountObject = {		
    "statusId":  this.statuses[0]._id,
    "stageId" : this.stages[0]._id,
    "typeId": this.selectedTypeId
    }
    let mainAccountObj = {
      "accountContactId" : "",
      "cars_per_year" : Number
    }
    let primaryAccountObject ={
      "primaryContactId" : ""
    }
    console.log("acct  "+ this.account)
    this.contactsDataService.createAccount(accountObject).subscribe(response => {
       this.accountId = response.data._id; console.log(response.data);


        this.contactsDataService.createContact(this.accountId, this.account.primaryAccount).subscribe(response => {
          if(response.statusCode === 200){
            primaryAccountObject.primaryContactId = response.data._id;
            this.contactsDataService.updateAccount(this.accountId, primaryAccountObject).subscribe(response => {
              if(response.statusCode === 200){
                $("#m_modal_5").modal('hide');
                alert("Account created succesfully!"); 
                // this.redirectContact(this.accountId); 
                 // alert("Account created succesfully!")
              }
              else {
                alert("Please fill the primary contact information correctly!");
              }
          }); 
          }
      });
      
      
       this.contactsDataService.createContact(this.accountId, this.account.mainAccount).subscribe(response => {
        if(response.statusCode === 200){
          mainAccountObj.accountContactId = response.data._id;
          mainAccountObj.cars_per_year = this.account.cars_per_year;
            this.contactsDataService.updateAccount(this.accountId, mainAccountObj).subscribe(response => {
              if(response.statusCode === 200){
                // $("#m_modal_5").modal('hide');
                // alert("Account created succesfully!"); 
                this.redirectContact(this.accountId);                
              }
              else{
                alert("Please fill the account information correctly!"); 
              }
          }); 
          }
        }); 

     
    });
  }

  validateContact(){

  }




  ngOnInit() {
  }

}
