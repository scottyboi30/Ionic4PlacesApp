import { Component, OnInit } from '@angular/core';
import { NavController, ModalController, ActionSheetController } from '@ionic/angular';
import { CreateBookingComponent } from 'src/app/bookings/create-booking/create-booking.component';
import { Place } from '../../offers/places.model';
import { ActivatedRoute } from '@angular/router';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {
  place: Place;

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private placesService: PlacesService,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/discover');
        return;
      }
      this.place = this.placesService.find(paramMap.get('placeId'));
    });
  }

  async onBookPlace() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Choose an Action',
      buttons: [{
        text: 'Select Date',
        icon: 'create',
        handler: () => {
          this.displayModal('select');
        }
      }, {
        text: 'Random Date',
        icon: 'create',
        handler: () => {
          this.displayModal('random');
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
      }]
    });

    await actionSheet.present();
  }

  async displayModal(mode: 'select' | 'random') {
    const modal =
      await this.modalCtrl.create({
        component: CreateBookingComponent, componentProps:
          { selectedPlace: this.place }
      });

    modal.present();
    const result = await modal.onDidDismiss();

    if (result.role === 'confirm') {
      console.log('BOOKED');
    }
  }
}
