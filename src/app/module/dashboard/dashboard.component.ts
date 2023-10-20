import { Component, OnInit, ViewChild } from '@angular/core';
import { GoogleChartInterface, GoogleChartType, ChartReadyEvent } from 'ng2-google-charts';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { DashboardService } from 'src/app/service/dashboard.service';
import { DataService } from 'src/app/service/data.service';
import { permission } from 'src/app/shared/permission';
import { ChartData, ChartOptions } from 'chart.js';
import { Router } from '@angular/router';
import { UserService } from 'src/app/service/user.service';
import { ToastrService } from 'ngx-toastr';


let COUNT = {
  availableCount: 0,
  totalCount: 0,
  utilizedCount: 0
};
@AutoUnsubscribe()
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  permissionCode = permission;
  permissionObject: any = null;
  currentUser: any;
  mySelfCount;
  othersCount;
  platinum: any = COUNT;
  gold: any = COUNT;
  standard: any = COUNT;
  licenseListArray: any = [];
  currentTenant: any;
  myUsageData = [];
  companyUsageData = [];
  message:any;
  emptyData: boolean = false;
  myEmptyData: boolean = false;
  public myLineChart: GoogleChartInterface = {
    chartType: GoogleChartType.LineChart,
    options: {title: 'Total Usage'},
    dataTable: [['Year', 'Usage'], ['NA', 0]]
  };
  companyLineChart: GoogleChartInterface = {
    chartType: GoogleChartType.LineChart,
    dataTable: [['Year', 'Usage'], ['NA', 0]],
    options: {title: 'Total Usage'},
  };
  @ViewChild('mychart ', {static: false}) mychart;
  @ViewChild('companychart ', {static: false}) companychart;

  constructor(
    private dataService: DataService,
    private dashboardService: DashboardService,
    private userService: UserService,
    private toastService: ToastrService,
    private router: Router
  ) {
    this.dataService.permission.subscribe((response) => {
      this.permissionObject = response
    });
    this.dataService.currentUser.subscribe((response) => {
      if (response) {
        this.currentUser = response;
        if(this.currentUser.userType == 'End User'){
          if(this.currentUser.isActive){
            if(this.currentUser.licenseType == "Gold" || this.currentUser.licenseType == "Platinum"){
              // this.message = "Based on the License type provided you are not accessible to any function, Please contact the support for further assistance";
            }
          }else{
            this.message = "Your account is suspended, Please contact the support team";
          }
        }

        if (this.currentUser.role == "Super Admin" || this.currentUser.role == "Distributor" || this.currentUser.role == "Reseller") {
          this.getLicenseforDashboard(this.currentUser.id);
        } else if (this.currentUser.role == "Tenant Admin" || this.currentUser.role == "BU Admin") {
          this.dataService.currentTenant.subscribe((data) => {
            if (data) {
              this.currentTenant = data;
              this.getLicenseforDashboard(this.currentTenant.data.id);
            }
          })
        }
      }
    });
  }

  ngOnInit() {
    this.getGraphData();
  }

  // public ready(event: ChartReadyEvent) {
  //   this.getGraphData();
  // }

  getGraphData() {
    this.dashboardService.getGraphData().subscribe((res) => {
      this.mySelfCount = res.data.currentMonthHimself;
      this.othersCount = res.data.currentMonthOthers;
      if(res.data.himself.length > 0) {
        this.myEmptyData = false;
        let temp = [];
        res.data.himself.forEach(element => {
          temp = []
          temp.push(element.key)
          temp.push(element.value)
          if(this.myUsageData.length == 0) {
            this.myUsageData.push(['Year', 'Usage'])
            this.myUsageData.push(temp)
          } else {
            this.myUsageData.push(temp)
          }
        });
        this.myLineChart = {
          chartType: GoogleChartType.LineChart,
          dataTable: this.myUsageData,
          options: {title: 'Total Usage'},
        };
        this.mychart.draw(this.myLineChart);
      } else {
        this.myEmptyData = true;
      }
      if(res.data.others.length > 0) {
        this.emptyData = false;
        let temp = [];
        res.data.others.forEach(element => {
          temp = []
          temp.push(element.key)
          temp.push(element.value)
          if(this.companyUsageData.length == 0) {
            this.companyUsageData.push(['Year', 'Usage'])
            this.companyUsageData.push(temp)
          } else {
            this.companyUsageData.push(temp)
          }
        });
        this.companyLineChart = {
          chartType: GoogleChartType.LineChart,
          dataTable: this.companyUsageData,
          options: {title: 'Total Usage'},
        };
        this.companychart.draw(this.companyLineChart);
      } else {
        this.emptyData = true;
      }
      
    })
  }
  
  getLicenseforDashboard(id) {
    this.dashboardService.GetLicenseforDashboard(id).subscribe((res) => {
      this.licenseListArray = res.data;
      this.calculateCount();
    })
  }

  calculateCount() {
    this.licenseListArray.map((data) => {
      switch (String(data.licenseType).toLowerCase()) {
        case 'standard':
          this.standard = data;
          break;
        case 'gold':
          this.gold = data;
          break;
        case 'platinum':
          this.platinum = data;
          break;
      }
    })
  }
  
  download() {
    this.userService.userDataDownload().subscribe(
      res => {
        window.location.href = res.data;
      }, error => {
        this.toastService.error(error.error.message)
      })
  }

  ngOnDestroy() {

  }
}
