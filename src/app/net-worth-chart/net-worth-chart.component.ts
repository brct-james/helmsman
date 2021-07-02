import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color } from 'ng2-charts';
import { ApiService } from '../api.service';

@Component({
    selector: 'app-net-worth-chart',
    templateUrl: './net-worth-chart.component.html',
    styleUrls: ['./net-worth-chart.component.sass'],
})
export class NetWorthChartComponent implements OnInit {
    public lineChartData: ChartDataSets[] = [
        { data: [65, 59, 80, 81, 56, 55, 40], label: 'Net Worth' },
    ];
    public lineChartLabels: string[] = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
    ];
    public lineChartOptions = {
        responsive: true,
        scales: {
            xAxes: [
                {
                    gridLines: { color: '#c7c7c7' },
                    ticks: {
                        fontColor: '#ffffff',
                    },
                },
            ],
            yAxes: [
                {
                    gridLines: { color: '#c7c7c7' },
                    ticks: {
                        fontColor: '#ffffff',
                    },
                },
            ],
        },
        legend: {
            labels: {
                fontColor: 'white',
            },
        },
    };
    public lineChartColors: Color[] = [
        {
            borderColor: 'rgb(241, 245, 20)',
            backgroundColor: 'rgba(241, 245, 20,0.3)',
        },
    ];
    public lineChartLegend = true;
    public lineChartType = 'line';
    public lineChartPlugins = [];

    constructor(public st: ApiService) {}

    ngOnInit(): void {
        //TODO: Refactor to have a chart of: debt, liquid credits, assets, and net worth (like actual net worth)
        //TODO: Check boxes for which data sets to show + changing view between 30 min history, 4 hr history, 1 day history, etc.
        //TODO: Allow import/export of NW history
        let nwHist = this.st.retrieveLocally('netWorthHistory');
        console.log(nwHist);
        if (nwHist) {
            console.log('nwHist received');
            this.lineChartData[0].data = nwHist.values;
            //TODO: Make a function you can pass to map that will format the labels as the difference between timestamp and now (e.g. -5m, -1h30m, etc.) in round numbers
            nwHist.timestamps = nwHist.timestamps.map((str) => {
                let stamp = new Date(str);
                let diff = stamp.valueOf() - Date.now();
                return (diff / 1000 / 60).toFixed(0).toString() + "m";
            });
            console.log(nwHist.values.length, nwHist.timestamps.length);
            this.lineChartLabels = nwHist.timestamps;
        } else {
            console.log('nwHist missing, trying again shortly');
            setTimeout(this.ngOnInit.bind(this), 1000);
        }
    }
}
