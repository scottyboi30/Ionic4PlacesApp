import { Component, OnInit } from '@angular/core';
import { PlacesService } from '../places.service';
import { Place } from '../offers/places.model';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {
  loadedPlaces: Place[];
  listedLoadingPlaces: Place[];

  constructor(public placesService: PlacesService) { }

  ngOnInit() {
    this.loadedPlaces = this.placesService.places;
    this.listedLoadingPlaces = this.placesService.places.splice(1);
  }

  onFilterChange(event) {

  }
}
