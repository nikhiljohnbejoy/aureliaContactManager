import {EventAggregator} from 'aurelia-event-aggregator';
import {WebAPI} from './web-api';
import {ContactUpdated, ContactViewed, ContactDeleted} from './messages';
import {inject} from 'aurelia-framework';

@inject(WebAPI, EventAggregator)
export class ContactList {
  constructor(api, ea) {
    this.api = api;
    this.contacts = [];

    ea.subscribe(ContactViewed, msg => {
        this.select(msg.contact);
        console.log(msg.contact.firstName);
    });
    ea.subscribe(ContactUpdated, msg => {
      let id = msg.contact.id;
      let found = this.contacts.find(x => x.id == id);
      Object.assign(found, msg.contact);
    });
    ea.subscribe(ContactDeleted, msg =>{
      
      let id = msg.contact.id;
      let found = this.contacts.find(x => x.id == id);
      let index = this.contacts.indexOf(found);
      this.contacts.splice(index,1);
    })
  }

  created() {
    this.api.getContactList().then(contacts => this.contacts = contacts);
  }

  select(contact) {
      console.log('selected'+contact.firstName);
    this.selectedId = contact.id;
    return true;
  }
}

