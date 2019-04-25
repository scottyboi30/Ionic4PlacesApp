import { Component, OnInit, OnDestroy } from '@angular/core';
import { BookingService } from './booking.service';
import { Booking } from './bookingModel';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {
  loadedBookings: Booking[];
  private destroyed$ = new Subject();

  constructor(private bookingService: BookingService,
    private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.bookingService.bookings
      .pipe(takeUntil(this.destroyed$))
      .subscribe(bookings => {
        this.loadedBookings = bookings;
      });
  }

  async onCancelBooking(id: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    const loadingEl = await this.loadingCtrl
      .create({ message: 'Canceling Booking...' });
    loadingEl.present();
    this.bookingService.cancelBooking(id)
      .subscribe(() => loadingEl.dismiss());
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
