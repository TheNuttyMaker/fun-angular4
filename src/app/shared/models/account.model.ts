export class Account {
    _id: string = '';
    accountContactId : object = {};
    primaryContactId : object = {};
    statusId : object = {};
    stageId : string = '';
    typeId : object = {};
    createdAt: Date;
    notes :  { _id: string, content: string }[] ;
    contacts = [] ;
}
