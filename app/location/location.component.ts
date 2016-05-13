import { Component, Output, EventEmitter } from '@angular/core';
import {	ANGULAR2_GOOGLE_MAPS_DIRECTIVES, MouseEvent } from 'angular2-google-maps/core';

@Component({
	selector: 'wh-location',
	directives: [ANGULAR2_GOOGLE_MAPS_DIRECTIVES],
	templateUrl: 'app/location/location.component.html',
	styleUrls: ['app/location/location.component.css']
})

export class LocationComponent {
	initLatitude: number = 47.61;
	initLongitude: number = -122.23;
	latitude: number = this.initLatitude;
	longitude: number = this.initLongitude;
	@Output() newLocation: EventEmitter<Array<number>> = new EventEmitter<Array<number>>();

	mapClicked($event: MouseEvent): void {
		this.latitude = $event.coords.lat;
		this.longitude = $event.coords.lng;
		this.newLocation.emit([this.latitude, this.longitude]);
	}
}
