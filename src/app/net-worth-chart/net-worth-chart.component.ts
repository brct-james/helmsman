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
  public lineChartData: ChartDataSets[] = [{ data: [65, 59, 80, 81, 56, 55, 40], label: 'Net Worth' }];
  public lineChartLabels: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
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
    this.st.getAccountInfo();

    let nwHist = this.st.retrieveLocally('netWorthHistory');
    if (nwHist) {
      console.log('[net-worth-chart] nwHist received');
      this.lineChartData[0].data = nwHist.values;
      nwHist.timestamps = nwHist.timestamps.map((str) => {
        let stamp = new Date(str);
        let diff = stamp.valueOf() - Date.now();
        return (diff / 1000 / 60).toFixed(0).toString() + 'm';
      });
      this.lineChartLabels = nwHist.timestamps;
    } else {
      console.log('[net-worth-chart] nwHist missing, trying again shortly');
      setTimeout(this.ngOnInit.bind(this), 1000);
    }
  }
}
