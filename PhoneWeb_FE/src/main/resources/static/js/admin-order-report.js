//Token
var vnMobileToken = null;
if (localStorage.getItem('VnMobileToken') !== null) {
	var vnMobileToken = JSON.parse(localStorage.getItem('VnMobileToken'));
	if (vnMobileToken.role === "QUANLI") {
	}
	else {
		window.location.href = '/401';
	}
}
else {
	window.location.href = '/401';
}
$(document).ready(function() {
	
	showKpi("ORDERSALE");
	showKpi("ORDERCOUNT");
	showCurrentMonth();
	setInterval(showCurrentMonth, 100000);

	let saleChartInstance = null;
	let orderChartInstance = null;

	async function getProductDetailAll() {
		try {
			let response = await $.ajax({
				method: "GET",
				url: "http://localhost:8888/api/admin/report/getOrderall",
				headers: {
					'Authorization': vnMobileToken.tokenType + ' ' + vnMobileToken.token
				},
			});
			if (response.success) {
				return response.data;
			} else {
				alert('khong co ket qua!');
			}
		} catch (error) {
			alert('loi');
		}
	}

	async function getProductDetailOn10Year() {
		try {
			let response = await $.ajax({
				method: "GET",
				url: "http://localhost:8888/api/admin/report/getSaleOrderOn10YearNear",
				headers: {
					'Authorization': vnMobileToken.tokenType + ' ' + vnMobileToken.token
				},
			});
			if (response.success) {
				return response.data;
			} else {
				alert('khong co ket qua!')
			}
		} catch (error) {
			alert('loi');
		}
	}

	async function getProductDetailQuaterByYear(year) {
		try {
			let response = await $.ajax({
				method: "GET",
				url: "http://localhost:8888/api/admin/report/getOrderQuater",
				data: {
					year: year
				},
				headers: {
					'Authorization': vnMobileToken.tokenType + ' ' + vnMobileToken.token
				},
			});
			if (response.success) {
				return response.data;
			} else {
				alert('khong co ket qua!')
			}
		} catch (error) {
			alert('loi');
		}
	}

	async function getProductDetailMonthByYear(year) {
		try {
			let response = await $.ajax({
				method: "GET",
				url: "http://localhost:8888/api/admin/report/getSaleOrderOnYear",
				data: {
					year: year
				},
				headers: {
					'Authorization': vnMobileToken.tokenType + ' ' + vnMobileToken.token
				},
			});
			if (response.success) {
				return response.data;
			} else {
				alert('khong co ket qua!')
			}
		} catch (error) {
			alert('loi');
		}
	}

	(async function() {
		var today = new Date();
		var year = today.getFullYear();
		var saleOrder = await getProductDetailMonthByYear(year);
		showChart(saleOrder);
	})();

	$("#yearChange").change(async function() {
		var yearChange = $(this).val();
		var reportChage = $("#reportChange").val();
		if (reportChage === "3") {
			var saleOrderMonth = await getProductDetailMonthByYear(yearChange);
			showChart(saleOrderMonth);
		} else {
			var saleOrderQuater = await getProductDetailQuaterByYear(yearChange);
			var labelsQuater = [];
			var totalPriceQuater = [];
			var totalCountQuater = [];
			for (var i = 0; i < saleOrderQuater.length; i++) {
				labelsQuater.push(saleOrderQuater[i][0]);
				totalPriceQuater.push(saleOrderQuater[i][1]);
				totalCountQuater.push(saleOrderQuater[i][2]);
			}
			saleChart(labelsQuater, totalPriceQuater);
			orderChart(labelsQuater, totalCountQuater);
			showSaleTable(labelsQuater, totalPriceQuater);
			showOrderTable(labelsQuater, totalCountQuater);
			$("#yearReport").show();
		}
	});

	$("#reportChange").change(async function() {
		var reportChange = $(this).val();
		if (reportChange === "0") {
			console.log('Year changed to:', reportChange);
			var report10Year = await getProductDetailOn10Year();
			var labels = [];
			var totalPrice = [];
			var totalCount = [];
			for (var i = 0; i < report10Year.length; i++) {
				labels.push(report10Year[i][0]);
				totalPrice.push(report10Year[i][1]);
				totalCount.push(report10Year[i][2]);
			}
			saleChart(labels, totalPrice);
			orderChart(labels, totalCount);
			showSaleTable(labels, totalPrice);
			showOrderTable(labels, totalCount);
			$("#yearReport").hide();
		} else if (reportChange === "1") {
			var saleOrderAll = await getProductDetailAll();
			var labelsAll = [];
			var totalPriceAll = [];
			var totalCountAll = [];
			for (var i = 0; i < saleOrderAll.length; i++) {
				labelsAll.push(saleOrderAll[i][0]);
				totalPriceAll.push(saleOrderAll[i][1]);
				totalCountAll.push(saleOrderAll[i][2]);
			}
			saleChart(labelsAll, totalPriceAll);
			orderChart(labelsAll, totalCountAll);
			showSaleTable(labelsAll, totalPriceAll);
			showOrderTable(labelsAll, totalCountAll);
			$("#yearReport").hide();
		} else if (reportChange === "2") {
			var today = new Date();
			var year = today.getFullYear();
			var saleOrderQuaterYear = await getProductDetailQuaterByYear(year);
			var labelsQuater = [];
			var totalPriceQuater = [];
			var totalCountQuater = [];
			for (var i = 0; i < saleOrderQuaterYear.length; i++) {
				labelsQuater.push(saleOrderQuaterYear[i][0]);
				totalPriceQuater.push(saleOrderQuaterYear[i][1]);
				totalCountQuater.push(saleOrderQuaterYear[i][2]);
			}
			saleChart(labelsQuater, totalPriceQuater);
			orderChart(labelsQuater, totalCountQuater);
			showSaleTable(labelsQuater, totalPriceQuater);
			showOrderTable(labelsQuater, totalCountQuater);
			$("#yearReport").show();
		} else if (reportChange === "3") {
			var today = new Date();
			var year = today.getFullYear();
			var saleOrderMonthYear = await getProductDetailMonthByYear(year);
			showChart(saleOrderMonthYear);
			$("#yearReport").show();
		}
	});

	function showChart(saleOrder) {
		var saleValue = [];
		var totalOrderValue = [];
		var labels = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
		for (var i = 0; i < saleOrder.length; i++) {
			saleValue.push(saleOrder[i].revenue);
			totalOrderValue.push(saleOrder[i].totalOrders);
		}
		saleChart(labels, saleValue);
		orderChart(labels, totalOrderValue);
		showSaleTable(labels, saleValue);
		showOrderTable(labels, totalOrderValue)
	}

	function orderChart(listLabels, listData) {
		if (orderChartInstance) {
			orderChartInstance.destroy();
		}
		const ctxSale = document.getElementById("orderChart").getContext('2d');
		orderChartInstance = new Chart(ctxSale, {
			type: 'bar',
			data: {
				labels: listLabels,
				datasets: [{
					label: 'Số đơn hàng',
					backgroundColor: '#0074D9',
					borderColor: 'rgb(47, 128, 237)',
					data: listData,
				}]
			},
			options: {
				scales: {
					yAxes: [{
						ticks: {
							beginAtZero: true,
						}
					}]
				}
			},
		});
	}

	function saleChart(listLabels, listData) {
		if (saleChartInstance) {
			saleChartInstance.destroy();
		}
		const ctxOrder = document.getElementById("saleChart").getContext('2d');
		saleChartInstance = new Chart(ctxOrder, {
			type: 'line',
			data: {
				labels: listLabels,
				datasets: [{
					label: 'Doanh thu',
					backgroundColor: 'rgba(161, 198, 247, 1)',
					borderColor: 'rgb(47, 128, 237)',
					data: listData,
				}]
			},
			options: {
				scales: {
					yAxes: [{
						ticks: {
							beginAtZero: true,
						}
					}]
				}
			},
		});

	}

	function showSaleTable(listLabels, listValue) {
		var orderHtml = `<table class="table table-bordered table-striped table-hover">
											<thead>
												<tr>
													<th style="min-width: 80px;" class="text-center" scope="col">Thời gian</th>
													<th style="min-width: 80px;" class="text-center" scope="col">Doanh thu
													</th>
													<th style="min-width: 80px;" class="text-center" scope="col">Đánh giá
													</th>
													<th style="min-width: 80px;" class="text-center" scope="col">Thao tác
													</th>
												</tr>
											</thead>
											<tbody id="bodyTable">`

		for (var i = 0; i < listLabels.length; i++) {
			orderHtml += `<tr>
							<td>${listLabels[i]}</td>
							<td>${listValue[i].toLocaleString('vi-VN')} đ</td>`
			if (listValue[i] > listValue[i - 1] && Math.abs(listValue[i] - listValue[i - 1]) >= 2000000) {
				orderHtml += `<td><p style="color: green"><i class="fa-solid fa-arrow-up"></i> Tăng</p></td>`
				orderHtml += `<td>Bình thường</td>`
			} else if (listValue[i] === listValue[i - 1] || Math.abs(listValue[i] - listValue[i - 1]) < 2000000) {
				orderHtml += `<td><p style="color: orange"><i class="fa-solid fa-arrows-rotate"></i> Ổn định</p></td>`
				orderHtml += `<td>Bình thường</td>`
			}
			else {
				orderHtml += `<td><p style="color: red"><i class="fa-solid fa-arrow-down"></i> Giảm</p></td>`
				orderHtml += `<td>Bình thường</td>`
			}
		}
		orderHtml += `</tr>
					</tbody>
					</table>`;

		$("#saleResponsive").html(orderHtml);
		console.log(orderHtml);
	}

	function showOrderTable(listLabels, listValue) {
		var orderHtml = `<table class="table table-bordered table-striped table-hover">
											<thead>
												<tr>
													<th style="min-width: 80px;" class="text-center" scope="col">Thời gian</th>
													<th style="min-width: 80px;" class="text-center" scope="col">Số đơn hàng
													</th>
													<th style="min-width: 80px;" class="text-center" scope="col">Đánh giá
													</th>
													<th style="min-width: 80px;" class="text-center" scope="col">Thao tác
													</th>
												</tr>
											</thead>
											<tbody id="bodyTable">`

		for (var i = 0; i < listLabels.length; i++) {
			orderHtml += `<tr>
							<td>${listLabels[i]}</td>
							<td>${listValue[i]}</td>`
			if (listValue[i] > listValue[i - 1]) {
				orderHtml += `<td><i style="color: green" class="fa-solid fa-arrow-up"></i> Tăng</td>`
				orderHtml += `<td>Bình thường</td>`
			} else if (listValue[i] === listValue[i - 1]) {
				orderHtml += `<td><p style="color: orange"><i class="fa-solid fa-arrows-rotate"></i> Ổn định</p></td>`
				orderHtml += `<td>Bình thường</td>`
			} else {
				orderHtml += `<td><p style="color: red"><i class="fa-solid fa-arrow-down"></i> Giảm</p></td>`
				orderHtml += `<td>Bình thường</td>`
			}
		}
		orderHtml += `</tr>
					</tbody>
					</table>`;

		$("#orderResponsive").html(orderHtml);
		console.log(orderHtml);
	}

	async function showCurrentMonth() {
		try {
			let response = await $.ajax({
				method: "GET",
				url: "http://localhost:8888/api/admin/order/sale-current-month",
				headers: {
					'Authorization': vnMobileToken.tokenType + ' ' + vnMobileToken.token
				},
			});
			if (response.success) {
				var listReport = response.data
				var kpiSale = await getKpi("ORDERSALE");
				var kpiOrder = await getKpi("ORDERCOUNT");
				var currentHtml = `<div class="col-xl-3 col-md-6">
							<div class="card text-white mb-4" style="background-color: #0074D9;">
								<div class="card-body">
									<h4>Doanh thu tháng này</h4>
									<h4>${listReport[0][0].toLocaleString('vi-VN')}đ</h4>
								</div>`
				if(BigInt(listReport[0][0]) < BigInt(kpiSale.kpi)){
					currentHtml += 	`<div class="card-footer d-flex align-items-center justify-content-between">
									<a class="small text-white stretched-link" href="#">(Chưa đạt KPI)</a>
									<div class="small text-white"><i class="fas fa-angle-right"></i></div>
								</div>`
				}
				else{
					currentHtml += 	`<div class="card-footer d-flex align-items-center justify-content-between">
									<a class="small text-white stretched-link" href="#">Vượt KPI</a>
									<div class="small text-white"><i class="fas fa-angle-right"></i></div>
								</div>`
				}
							
				currentHtml+=			`</div>
						</div>
						<div class="col-xl-3 col-md-6">
							<div class="card bg-success text-white mb-4">
								<div class="card-body">
									<h4>ĐH thành công</h4>
									<h4>${listReport[0][4]}</h4>
								</div>`
				if(BigInt(listReport[0][4]) < BigInt(kpiOrder.kpi)){
					currentHtml += 	`<div class="card-footer d-flex align-items-center justify-content-between">
									<a class="small text-white stretched-link" href="#">(Chưa đạt KPI)</a>
									<div class="small text-white"><i class="fas fa-angle-right"></i></div>
								</div>`
				}
				else{
					currentHtml += 	`<div class="card-footer d-flex align-items-center justify-content-between">
									<a class="small text-white stretched-link" href="#">Vượt KPI</a>
									<div class="small text-white"><i class="fas fa-angle-right"></i></div>
								</div>`
				}
				currentHtml+=			`</div>
						</div>
						<div class="col-xl-3 col-md-6">
							<div class="card text-white mb-4" style="background-color: #FF9900;">
								<div class="card-body">
									<h4>ĐH đang xử lí</h4>
									<h4>${listReport[0][1] + listReport[0][2]}</h4>
								</div>
								<div class="card-footer d-flex align-items-center justify-content-between">
									<a class="small text-white stretched-link" href="#">View Details</a>
									<div class="small text-white"><i class="fas fa-angle-right"></i></div>
								</div>
							</div>
						</div>
						<div class="col-xl-3 col-md-6">
							<div class="card bg-danger text-white mb-4">
								<div class="card-body">
									<h4>ĐH đã hủy</h4>
									<h4>${listReport[0][5]}</h4>
								</div>
								<div class="card-footer d-flex align-items-center justify-content-between">
									<a class="small text-white stretched-link" href="#">View Details</a>
									<div class="small text-white"><i class="fas fa-angle-right"></i></div>
								</div>
							</div>
						</div>`
				$("#currentMonthSale").html(currentHtml);
			} else {
				alert('khong co ket qua!')
			}
		} catch (error) {
			alert('loi');
		}
	}
	
	async function showKpi(type){
		var kpi = await getKpi("ORDERSALE");
		var kpi1 = await getKpi("ORDERCOUNT");
		$("#kpiSale").val(kpi.kpi);
		$("#kpiOrder").val(kpi1.kpi);
	}

	async function getKpi(type) {
		let now = new Date();
		let year = now.getFullYear();
		let month = now.getMonth() + 1;
		try {
			let response = await $.ajax({
				method: "GET",
				url: "http://localhost:8888/api/admin/kpi/get-by-search",
				headers: {
					'Authorization': vnMobileToken.tokenType + ' ' + vnMobileToken.token
				},
				data: {
					year: year,
					month: month,
					type: type,
				},
			});
			if (response.success) {
				return response.data;
			} else {
				alert('khong co ket qua!')
			}
		} catch (error) {
			alert('loi');
		}
	}
	
	
	$("#xuatButton").click(async function(){
		var date = new Date();
		var year = date.getFullYear();
		var saleOrderMonthYear = await getProductDetailMonthByYear(year);
		var isSuccess = await getReportDocx(2024);
		if(isSuccess === true){
			window.location.href='http://localhost:8888/api/uploadfile/file/report-bill.docx';
		}
	});
	
	async function getReportDocx(year) {
		try {
			let response = await $.ajax({
				method: "GET",
				url: "http://localhost:8888/api/admin/kpi/get-report/" + year,
				headers: {
					'Authorization': vnMobileToken.tokenType + ' ' + vnMobileToken.token
				},
			});
			if (response.success) {
				return response.success;
			} else {
				alert('khong co ket qua!')
			}
		} catch (error) {
			alert('loi');
		}
	}
});