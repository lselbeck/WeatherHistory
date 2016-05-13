import { Component, Directive } from '@angular/core';
import { JSONP_PROVIDERS } from '@angular/http';
import { ROUTER_PROVIDERS, Routes } from '@angular/router';
import 'rxjs/Rx';
import { HistoryListComponent } from './history/history-list.component';
import { LocationComponent } from './location/location.component';
import { HistoryService } from './history/history.service';

@Component({
	selector: 'wh-app',
	templateUrl: 'app/app.component.html',
	directives: [HistoryListComponent, LocationComponent],
	providers: [HistoryService, JSONP_PROVIDERS, ROUTER_PROVIDERS]
})

@Routes([
	{ path: '/', component: AppComponent }
])

export class AppComponent {
	pageTitle: string = 'Weather History';
	latitude: number;
	longitude: number;

	onNewLocation(newLocation: Array<number>): void {
		this.latitude = newLocation[0];
		this.longitude = newLocation[1];
	}
}