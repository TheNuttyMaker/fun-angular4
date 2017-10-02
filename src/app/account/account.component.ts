import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {Http, Response, Headers, RequestOptions} from '@angular/http';

import { AccountDataService, ContactsDataService,ArticleListConfig, TagsService, UserService } from '../shared';
import {Account, Stage, Status, Types, Notes} from '../shared/models';
import { environment } from '../../environments/environment';
import { Article, ArticlesService } from '../shared';
import * as _ from 'lodash';
const API_URL = environment.apiUrl;

@Component({
  selector: 'account-page',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit, OnDestroy {

  id: number;
  accountContactId: string;
  primaryContactId: string;
  private sub : any;
  contact = {
      _id: String,
      accountContactId: {
        _id: String,
        name: String,
        title: String,
        email: String,
        phones: [], 
        addresses: [],
        __v: Number},
      primaryContactId : { 
          _id: String,
          name: String,
          title: String,
          email: String,
          phones: [], 
          addresses: [],
          __v: Number},
      statusId : Status,
      stageId : Stage,
      typeId : {},
      createdAt: Date,
      notes :  [] ,
      contacts : [],
      __v : Number
  };
  addresses= [{
      addressLine1: "",
      city: "",
      state: "",
      zip: "",
  }];
  otherContacts = [];
  notes: Notes[];
  headers = new Headers({ 'Content-Type': 'application/json' });
  options = new RequestOptions({ headers: this.headers });
  content: string;
  statuses : Status[] = [];
  statusModel: Status;
  stageModel : any;
  stages : Stage[] = [];
  isPrimaryContact : Boolean = false;
  selectedStageId = "";
  selectedStatusId = "";
  htmlToAddStages :string;
  htmlText: string;

  article: Article = new Article();
  articleForm: FormGroup;
  tagField = new FormControl();
  errors: Object = {};
  isSubmitting = false;

  constructor(
    private http : Http, 
    private contactsDataService : ContactsDataService,
    private articlesService: ArticlesService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    // use the FormBuilder to create a form group
    this.articleForm = this.fb.group({
      title: '',
      description: '',
      body: '',
    });
    // Optional: subscribe to value changes on the form
    // this.articleForm.valueChanges.subscribe(value => this.updateArticle(value));
  }

  ngOnInit() {
    console.log("hi");
    this.sub = this.route.params.subscribe( params => {
      this.id = params['id'];      
    })

    this.contactsDataService.getContact(this.id).subscribe(response => {
      this.contact = response.data;
      this.accountContactId = response.data.accountContactId._id;
      this.selectedStatusId = response.data.statusId._id;
      this.selectedStageId = response.data.stageId._id;
      if(response.data.hasOwnProperty('primaryContactId')){
          this.primaryContactId = response.data.primaryContactId._id
          this.isPrimaryContact = true;
      }
      if(response.data.primaryContactId.addresses.length === 0){
          this.contact.primaryContactId.addresses = this.addresses;
      }
     
      this.contactsDataService.getAllContacts(this.id).subscribe(response => { this.parseOtherContacts(response.data)}); 
      let selectedStatusName = response.data.statusId.name;
      this.contactsDataService.getStatuses().subscribe(response => {
          this.statuses = _.sortBy(response.data, 'order');      
          this.statusFunction(selectedStatusName,1);
      }); 
      //this.selectedStageId = response.data.stageId._id;

  }); 

  this.contactsDataService.getNotes(this.id).subscribe(response => {
    this.notes = response.data;
  }); 
    // If there's an article prefetched, load it
    // this.route.data.subscribe(
    //   (data: {article: Article}) => {
    //     if (data.article) {
    //       this.article = data.article;
    //       this.articleForm.patchValue(data.article);
    //     }
    //   }
    // );
  }

  addNotes(content){
    this.http.post(API_URL+ `/accounts/`+this.id+'/notes', {"content":content}, this.options)
    .subscribe(response => { 
        if(response.status === 200){
            alert("Note added!");
            this.notes.push(response.json().data);
            this.content = '';

        }

    });
  }

  deleteNote(note){
    this.http.delete(API_URL+ `/accounts/`+this.id+'/notes/'+ note._id)
    .subscribe(response => {
        // this.notes = this.notes.filter(note => note._id !== id);
        if(response.status === 200){
        var index = this.notes.indexOf(note, 0);
        if (index > -1)
        {
            this.notes.splice(index, 1);
        }
        //$( "#"+note._id ).remove();
        alert("Note deleted!");
        //this.toastr.success('Hello world!', 'Toastr fun!');
    }
    });
  }

  parseOtherContacts(allcontacts){
    let primaryContactId = "";
    if( this.isPrimaryContact){
        primaryContactId = this.primaryContactId;

        delete this.contact.primaryContactId.__v;
        this.contact.primaryContactId.phones.forEach(function (phone) {
            delete phone._id;
        });
        this.contact.primaryContactId.addresses.forEach(function (address) {
            delete address._id;
        });
    }
    
    let accountContactId = this.accountContactId;
    let otherContacts = [];

    this.contact.accountContactId.phones.forEach(function (phone) {
        delete phone._id;
    });
    this.contact.accountContactId.addresses.forEach(function (address) {
        delete address._id;
    });
    delete this.contact.accountContactId.__v;


    allcontacts.forEach(function (contact) {
        if (contact._id !== primaryContactId && contact._id !== accountContactId) {
            otherContacts.push(contact);
        }
    });

    otherContacts.forEach(function (contact) {
        delete contact.__v;
        contact.phones.forEach(function (phone) {
            delete phone._id;
        });
    });
    this.otherContacts = otherContacts

    console.log(JSON.stringify(this.otherContacts));
  }

  updateContact(contact){
    //this.contactsDataService.getAllContacts(this.id).subscribe(response => { this.parseOtherContacts(response.data)});   
    this.contactsDataService.updateContact(this.id, contact).subscribe(response => {
       if(response.statusCode === 200){
        alert("Account updated succesfully!");
       }
    }); 
  }


  statusFunction(event, isInitial){
    console.log(event);
    let statusId;
    if(event.length >24){
        statusId = event.substring(3);
    } else {
        statusId = this.filterArray(event, this.statuses);
    }
    let statusKey = "statusId";
    this.contactsDataService.getStages(statusId).subscribe(response => {
        this.stages.splice(0,this.stages.length)
        //$('#stage').children('option').remove();
        this.stages = _.sortBy(response.data, 'order');
        if(isInitial === 0){
            this.selectedStageId = response.data[0]._id;
            this.updateAccount(this.id , statusKey, statusId);
            this.stageFunction(this.selectedStageId, 1  );
        }
    });      
  }
  stageFunction(event, isInitial){
    let stageId = event;
    if(isInitial === 0){
        stageId = event.substring(3);
    }
    let stageKey = "stageId";
    this.updateAccount(this.id, stageKey, stageId);
    
  }

  updateAccount(accountId, key, value){
      let object = {[key] : value};
      this.contactsDataService.updateAccount(accountId, object).subscribe(response => {
          if(response.statusCode === 200){
              // alert("Contact is successfully updated!")
          }
      }); 
  }

  filterArray(value, arr){
      for (var n in arr) {  
        if(arr[n]['name'] === value){
          return arr[n]['_id'];
        }
      }
  }

  // addTag() {
  //   // retrieve tag control
  //   const tag = this.tagField.value;
  //   // only add tag if it does not exist yet
  //   if (this.article.tagList.indexOf(tag) < 0) {
  //     this.article.tagList.push(tag);
  //   }
  //   // clear the input
  //   this.tagField.reset('');
  // }

  // removeTag(tagName: string) {
  //   this.article.tagList = this.article.tagList.filter((tag) => tag !== tagName);
  // }

  // submitForm() {
  //   this.isSubmitting = true;

  //   // update the model
  //   this.updateArticle(this.articleForm.value);

  //   // post the changes
  //   this.articlesService
  //   .save(this.article)
  //   .subscribe(
  //     article => this.router.navigateByUrl('/article/' + article.slug),
  //     err => {
  //       this.errors = err;
  //       this.isSubmitting = false;
  //     }
  //   );
  // }

  // updateArticle(values: Object) {
  //   (<any>Object).assign(this.article, values);
  // }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
