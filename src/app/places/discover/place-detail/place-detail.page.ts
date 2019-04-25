import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, ModalController, ActionSheetController, LoadingController } from '@ionic/angular';
import { CreateBookingComponent } from 'src/app/bookings/create-booking/create-booking.component';
import { Place } from '../../places.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PlacesService } from '../../places.service';
import { Subscription } from 'rxjs';
import { BookingService } from 'src/app/bookings/booking.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  place: Place;
  isBookable: boolean = false;
  private placeSub: Subscription;

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private placesService: PlacesService,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private bookingService: BookingService,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/discover');
        return;
      }
      this.placeSub = this.placesService
        .find(paramMap.get('placeId'))
        .subscribe(place => {
          this.place = place;
          this.isBookable = this.authService.userId !== place.userId;
        });
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
          { selectedPlace: this.place, selectedMode: mode }
      });

    modal.present();
    const resultData = await modal.onDidDismiss();
    if (resultData.role === 'confirm') {
      const loadingEl = await this.loadingCtrl
        .create({ message: 'Booking place...' });
      loadingEl.present();
      const data = resultData.data.bookingData;
      this.bookingService
        .addBooking(
          this.place.id,
          this.place.title,
          this.place.imageUrl,
          data.firstName,
          data.lastName,
          data.guestNumber,
          data.startDate,
          data.endDate
        )
        .subscribe(() => {
          loadingEl.dismiss();
          this.router.navigate(['/bookings']);
        });
    }
  }

  ngOnDestroy() {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }
}
