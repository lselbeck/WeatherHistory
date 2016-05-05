import { Component } from 'angular2/core';
import { JSONP_PROVIDERS } from 'angular2/http';
import 'rxjs/Rx';
import { HistoryListComponent } from './history/history-list.component';
import { HistoryService } from './history/history.service';

@Component ({
	selector: 'wh-app',
	template: `
		<div>
			<h1>{{pageTitle}}</h1>
			<wh-history></wh-history>
		</div>`,
	directives: [HistoryListComponent],
	providers: [HistoryService, JSONP_PROVIDERS]
})

export class AppComponent {
	pageTitle: string = 'Weather History';
}