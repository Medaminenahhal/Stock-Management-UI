import { Component } from '@angular/core';
import { OrderService } from 'src/services/order.service';
import { Order } from '../order/order.model';
import { HttpErrorResponse } from '@angular/common/http';
import { CanvasJS } from '@canvasjs/angular-charts';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  chart: any;
	
	chartOptions = {
	  animationEnabled: true,
	  theme: "light2",
	  title:{
		text: "Validated vs Not Validated orders"
	  },
	  axisX:{
		valueFormatString: "D MMM"
	  },
	  axisY: {
		title: "Number of Sales"
	  },
	  toolTip: {
		shared: true
	  },
	  legend: {
		cursor: "pointer",
		itemclick: function (e: any) {
			if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
				e.dataSeries.visible = false;
			} else {
				e.dataSeries.visible = true;
			} 
			e.chart.render();
		}
	  },
	  data: [{
		type: "line",
		showInLegend: true,
		name: " Not Validated",
		xValueFormatString: "MMM DD, YYYY",
		dataPoints: [
			
		]
	  }, {
		type: "line",
		showInLegend: true,
		name: "Validated",
		xValueFormatString: "MMM DD, YYYY",
		dataPoints: [
			
		]
	  }]
	}	


  orders:Order[]=[];
  ordersNumber: any;



constructor(private orderService : OrderService){}


ngOnInit() {
  // Assuming this.orders is populated with the retrieved orders array
  this.getAllOrders();
}
public getAllOrders(){
  this.orderService.getAllOrders(0,200).subscribe(
    {
      next: (response: any) => {
         this.orders = response.orders;
          // Create a copy of the orders array
         console.log(this.orders);
         this.ordersNumber = response.totalPages;
         console.log(this.ordersNumber);

		 if (this.orders && this.orders.length > 0) {
			const ordersByDateValidated = {};
          const ordersByDateNotValidated = {};
		
			// Group orders by date and count them
			for (const order of this.orders) {
				const date = new Date(order.dateDeCommande);
				const dateString = date.toISOString().split('T')[0];
	
				if (order.state === 'Validated') {
				  if (ordersByDateValidated[dateString]) {
					ordersByDateValidated[dateString]++;
				  } else {
					ordersByDateValidated[dateString] = 1;
				  }
				} else {
				  if (ordersByDateNotValidated[dateString]) {
					ordersByDateNotValidated[dateString]++;
				  } else {
					ordersByDateNotValidated[dateString] = 1;
				  }
				}
			  }
			  const dataPointsValidated = [];
              const dataPointsNotValidated = [];
		
			console.log(ordersByDateValidated);
			console.log(ordersByDateNotValidated);
		 
			
        for (const date in ordersByDateValidated) {
        if (ordersByDateValidated.hasOwnProperty(date)) {
          const dateParts = date.split('-');
          const xValue = new Date(
            parseInt(dateParts[0]),
            parseInt(dateParts[1]) - 1,
            parseInt(dateParts[2])
          );
          const yValue = ordersByDateValidated[date];
          dataPointsValidated.push({ x: xValue, y: yValue });

        }
      }
	  // for not validated orders
	  for (const date in ordersByDateNotValidated) {
        if (ordersByDateNotValidated.hasOwnProperty(date)) {
          const dateParts = date.split('-');
          const xValue = new Date(
            parseInt(dateParts[0]),
            parseInt(dateParts[1]) - 1,
            parseInt(dateParts[2])
          );
          const yValue = ordersByDateNotValidated[date];
          dataPointsNotValidated.push({ x: xValue, y: yValue });

        }
      }


      
	  this.chartOptions.data[1].dataPoints = dataPointsValidated;
	  this.chartOptions.data[0].dataPoints = dataPointsNotValidated;

	  const chart = new CanvasJS.Chart('chartContainer', this.chartOptions);
	  chart.render();
		}
          
       },
      error: (error: HttpErrorResponse) => { alert(error.message); }
    }
  );

}
 



}
