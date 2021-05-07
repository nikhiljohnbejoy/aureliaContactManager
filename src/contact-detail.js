import {inject} from 'aurelia-framework';
  import {EventAggregator} from 'aurelia-event-aggregator';
  import {WebAPI} from './web-api';
  import {ContactUpdated,ContactViewed,ContactDeleted} from './messages';
  import {areEqual} from './utility';
  import { Router } from 'aurelia-router';
  
  @inject(WebAPI, EventAggregator, Router)
  export class ContactDetail {
    constructor(api, ea, router){
      this.api = api;
      this.ea = ea;
      this.router = router;
    }
  
    activate(params, routeConfig) {
      this.routeConfig = routeConfig;
  
      return this.api.getContactDetails(params.id).then(contact => {
        this.contact = contact;
        this.routeConfig.navModel.setTitle(contact.firstName);
        this.originalContact = JSON.parse(JSON.stringify(contact));
        this.ea.publish(new ContactViewed(this.contact));
      });
    }
  
    get canSave() {
      return this.contact.firstName && this.contact.lastName && !this.api.isRequesting;
    }
  
    save() {
      this.api.saveContact(this.contact).then(contact => {
        this.contact = contact;
        this.routeConfig.navModel.setTitle(contact.firstName);
        this.originalContact = JSON.parse(JSON.stringify(contact));
        this.ea.publish(new ContactUpdated(this.contact));
      });
    }
    delete() {
      this.api.deleteContact(this.contact).then(done => {
        this.router.navigateToRoute('default');
        if(done){
        this.ea.publish(new ContactDeleted(this.contact));
        }
      });
    }
  
    canDeactivate() {
      if(!areEqual(this.originalContact, this.contact)){
        let result = confirm('You have unsaved changes. Are you sure you wish to leave?');
  
        if(!result) {
            console.log('canceled');
            console.log(this.contact.firstName);
          this.ea.publish(new ContactViewed(this.contact));
        }
  
        return result;
      }
  
      return true;
    }
  }
  

  