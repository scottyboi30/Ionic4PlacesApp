import { Component, OnInit, OnDestroy } from '@angular/core';
import { Place } from '../../places.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PlacesService } from '../../places.service';
import { NavController, LoadingController } from '@ionic/angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit, OnDestroy {
  place: Place;
  form: FormGroup;
  private destroyed$ = new Subject();

  constructor(
    private route: ActivatedRoute,
    private placesService: PlacesService,
    private navCtrl: NavController,
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/offers');
        return;
      }
      this.placesService
        .find(paramMap.get('placeId'))
        .pipe(takeUntil(this.destroyed$))
        .subscribe(place => {
          this.place = place;
          this.setupForm();
        });
    });
  }

  setupForm() {
    this.form = this.formBuilder.group({
      title: [this.place.title, { validators: [Validators.required], updateOn: 'blur' }],
      description: [this.place.description, { validators: [Validators.required, Validators.maxLength(180)], updateOn: 'blur' }],
    });
  }

  async onUpdateOffer() {
    if (!this.form.valid) {
      return;
    };

    const loadingEl = await this.loadingCtrl
      .create({
        message: 'Updating place...'
      })
    loadingEl.present();
    this.placesService
      .updatePlace(
        this.place.id,
        this.form.value.title,
        this.form.value.description
      )
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        loadingEl.dismiss();
        this.form.reset();
        this.router.navigate(['/places/tabs/offers']);
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
