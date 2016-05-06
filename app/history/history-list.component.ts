import { Component, OnInit } from 'angular2/core';
import { HistoryService } from './history.service';
import { HistoryData } from './history';
import { CHART_DIRECTIVES, Highcharts } from 'angular2-highcharts';

@Component({
	selector: 'wh-history',
	templateUrl: 'app/history/history-list.component.html',
	directives: [CHART_DIRECTIVES]
})

export class HistoryListComponent implements OnInit {
	history: Array<any> = new Array<any>();
	columns: string[] = ['Date', 'Summary', 'Precipitation', 'High', 'Low', 'Wind Speed'];
	errorMessage: string;
	latitude: number = 37.8267;
	longitude: number = -122.423;
	options: Object;
	chart: Object;

	constructor(private _historyService: HistoryService) {
		//override reset function, to show crosshairs and tooltips across all charts
		// interface Highcharts {
		// 	reset(): any;
		// }
		Highcharts.Pointer.prototype.reset = function() {
			return undefined;
		}

		this.options = {
			chart: {
				marginLeft: 40, // Keep all charts left aligned
				spacingTop: 20,
				spacingBottom: 20
			},
			title: {
				text: 'History from '
					+ (this.latitude >= 0 ? '+' : '') + this.latitude
					+ (this.longitude >= 0 ? ', +' : ', ') + this.longitude,
				align: 'left',
				margin: 0,
				x: 30
			},
			credits: {
				enabled: false
			},
			legend: {
				enabled: false
			},
			xAxis: {
				crosshair: true,
				events: {
					setExtremes: this.syncExtremes
				},
				labels: {
					format: '{value}'
				}
			},
			yAxis: {
				title: {
					text: null
				}
			},
			tooltip: {
				positioner: function() {
					return {
						x: this.chart.chartWidth - this.label.width, // right aligned
						y: -1 // align to title
					};
				},
				borderWidth: 0,
				backgroundColor: 'none',
				pointFormat: '{point.y}',
				headerFormat: '',
				shadow: false,
				style: {
					fontSize: '18px'
				},
				valueDecimals: dataset.valueDecimals
			},
			series: [{
				data: [29.9, 71.5, 106.4, 129.2],
			}]
		};
	}

	getTitle(): string {
		return 'History from '
				+ (this.latitude >= 0 ? '+' : '') + this.latitude
				+ (this.longitude >= 0 ? ', +' : ', ') + this.longitude;
	};

	//synchronizes tooltips and crosshairs across multiple charts
	onChartMove(e) {
		var point, event;

		for (var i = 0; i < Highcharts.charts.length; i++) {
			this.chart = Highcharts.charts[i];
			event = this.chart.pointer.normalize(e.originalEvent); // Find coordinates within the chart
			point = this.chart.series[0].searchPoint(event, true); // Get the hovered point

			if (point) {
				point.onMouseOver(); // Show the hover marker
				this.chart.tooltip.refresh(point); // Show the tooltip
				this.chart.xAxis[0].drawCrosshair(event, point); // Show the crosshair
			}
		}
	}

	// syncExtremes(e) {
	// 	var thisChart = this.chart;

	// 	if (e.trigger !== 'syncExtremes') { // Prevent feedback loop
	// 		Highcharts.each(Highcharts.charts, function(chart) {
	// 			if (chart !== thisChart) {
	// 				if (chart.xAxis[0].setExtremes) { // It is null while updating
	// 					chart.xAxis[0].setExtremes(e.min, e.max, undefined, false, { trigger: 'syncExtremes' });
	// 				}
	// 			}
	// 		});
	// 	}
	// }



	ngOnInit(): void {
		var day = new Date();
		for (var i = 0; i < 10; i++) {
			this._historyService.getHistory(this.latitude, this.longitude, day)
				.subscribe(
					history => this.history.push(history.daily.data[0]),
					error => this.errorMessage = <any>error,
					() => console.log(history)
				);
			day.setDate(day.getDate() - 1);
		}
	}
}
