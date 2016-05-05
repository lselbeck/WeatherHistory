import { Component, OnInit } from 'angular2/core';
import { HistoryService } from './history.service';
import { HistoryData } from './history';


@Component({
	selector: 'wh-history',
	templateUrl: 'app/history/history-list.component.html'
})

export class HistoryListComponent implements OnInit {
	history: any;
	columns: string[] = ['Date', 'Summary', 'Precipitation', 'High', 'Low', 'Wind Speed'];
	errorMessage: string;
	latitude: number = 37.8267;
	longitude: number = -122.423;

	constructor(private _historyService: HistoryService) {}

	getTitle(): string {
		return 'History from '
				+ (this.latitude >= 0 ? '+' : '') + this.latitude
				+ (this.longitude >= 0 ? ', +' : ', ') + this.longitude;
	};

	getHistoryStatus(): void {
		console.log(this.history)
	}

	ngOnInit(): void {
		this._historyService.getHistory(this.latitude, this.longitude)
				.subscribe(
					history => this.history = history.daily.data[0],
					error => this.errorMessage = <any>error,
					() => console.log(history)
				);
	}
}
