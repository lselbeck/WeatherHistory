import { Component, OnInit } from 'angular2/core';
import { HistoryService } from './history.service';
import { IHistory } from './history';


@Component({
	selector: 'wh-history',
	templateUrl: 'app/history/history-list.component.html'
})

export class HistoryListComponent implements OnInit {
	history: IHistory[];
	columns: string[] = ['Date', 'Icon', 'Precipitation', 'Temp', 'Wind Speed'];
	errorMessage: string;

	constructor(private _historyService: HistoryService) {}

	getTitle(): string {
		return 'History from ';
	};

	ngOnInit(): void {
		this._historyService.getHistory()
				.subscribe(
					history => this.history,
					error => this.errorMessage = <any>error
				);
	}
}
