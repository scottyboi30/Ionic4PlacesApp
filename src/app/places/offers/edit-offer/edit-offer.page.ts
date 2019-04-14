import { Component, OnInit } from '@angular/core';
import { Place } from '../places.model';
import { ActivatedRoute } from '@angular/router';
import { PlacesService } from '../../places.service';
import { NavController } from '@ionic/angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit {
  place: Place;
  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private placesService: PlacesService,
    private navCtrl: NavController,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/offers');
        return;
      }
      this.place = this.placesService.find(paramMap.get('placeId'));
      this.setupForm();
    });
  }

  setupForm() {
    this.form = this.formBuilder.group({
      title: ['', { validators: [Validators.email, Validators.required], updateOn: 'blur' }],
      description: ['', { validators: [Validators.minLength(6), Validators.required], updateOn: 'blur' }],
    });
  }
}
