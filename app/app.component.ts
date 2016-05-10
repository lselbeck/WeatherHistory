import { Component } from 'angular2/core';
import { JSONP_PROVIDERS } from 'angular2/http';
import 'rxjs/Rx';
import { HistoryListComponent } from './history/history-list.component';
import { LocationComponent } from './location/location.component';
import { HistoryService } from './history/history.service';

@Component ({
	selector: 'wh-app',
	templateUrl: 'app/app.component.html',
	directives: [HistoryListComponent, LocationComponent],
	providers: [HistoryService, JSONP_PROVIDERS]
})

export class AppComponent {
	pageTitle: string = 'Weather History';
	latitude: number;
	longitude: number;

	onNewLocation(newLocation: Array<number>): void {
		this.latitude = newLocation[0];
		this.longitude = newLocation[1];
	}
}