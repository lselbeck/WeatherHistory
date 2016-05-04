import { Component } from 'angular2/core';
import { HistoryListComponent } from './history/history-list.component';

@Component ({
	selector: 'wh-app',
	template: `
		<div>
			<h1>{{pageTitle}}</h1>
			<wh-history></wh-history>
		</div>`,
	directives: [HistoryListComponent]
})

export class AppComponent {
	pageTitle: string = 'Weather History';
}