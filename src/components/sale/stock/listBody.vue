<!-- /src/components/sale/retail/listBody.vue-->
<template lang="html">
	<div class="row no-gutter">
		<div class="col-100">
			<div class="leftDiv">
				<div class="leftDiv1">
					<table class="table table-bordered">
						<thead>
							<tr>
								<th>
									区域
								</th>
							</tr>
						</thead>
					</table>
				</div>
				<div class="leftDiv2">
					<table class="table table-bordered">
						<tbody>
							<tr v-for="(row, index) in dataList">
								<td>
									{{ row.name | swithRegion }}
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
			<div class="rightDiv">
				<div class="rightDiv1">
					<table class="table table-bordered">
						<thead>
							<tr>
								<th v-for="column in table.columns">
									{{ column }}
								</th>
							</tr>
						</thead>
					</table>
				</div>
				<div class="rightDiv2">
				  <table class="table table-bordered">
					<tbody>
						<tr v-for="(row, index) in dataList">
							<td>
								{{ row.resultMonthStock }}
							</td>
							<td>
								{{ row.resultStockDeep }}
							</td>
							<td>
								{{  row.resultCircleGrow }}
						    </td>		
							<td>
								{{ row.resultDeadStock }}
							</td>
							<td>
								{{ row.resultStockRate }}
							</td>
						</tr>
					</tbody>
				  </table>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import table from '../../../lib/table'
	import Api from '../../../net/api'
	export default {
		props: {
			filterCondition: {
				type: Object,
				default: {}
			}
		},
		data: function() {
			return {
				table: {
					columns: [
						'当前库存',
						'库存深度',
						'环比值',
						'死库存金额',
						'死库存比重'
					]
				},
				dataList: {},
				statisticType: 0,
				locationParams: {
					region: 'WEST',
					area: '安徽、江西',
					dealerCode: 'SHA'
				},
				timeParams: {
					year: '2017',
					quarter: 'all',
					month: 'all'
				}
			}
		},
		mounted() {
			this.type = this.$localStorage.get('type')
			if (this.type === '3' || this.type === '4') {
				this.getAllRegionStockKpi()
			} else if (this.type === '2') {
				this.locationParams.region = this.$localStorage.get('region')
				this.getAllAreaStockKpiByRegion()
			} else if (this.type === '1') {
				this.locationParams.region = this.$localStorage.get('region')
				this.locationParams.area = this.$localStorage.get('area')
				this.getAllDealerStockKpiByArea()
			} else {
				this.locationParams.region = this.$localStorage.get('region')
				this.locationParams.area = this.$localStorage.get('area')
				this.locationParams.dealer = this.$localStorage.get('code')
				this.getDealerStockKpiByDealerCode()
			}
			table.init()
		},
		methods: {
			getAllRegionStockKpi() {
				let data = {
					year: this.timeParams.year,
					quarter: this.timeParams.quarter,
					month: this.timeParams.month,
					statisticType: this.statisticType
				}
				Api.sale.stock.getAllRegionStockKpi(data, (r) => {
					this.dataList = r.data;
				}, (err) => {})
			},
			getAllAreaStockKpiByRegion() {
				let data = {
					year: this.timeParams.year,
					quarter: this.timeParams.quarter,
					month: this.timeParams.month,
					region: this.locationParams.region,
					statisticType: this.statisticType
				}
				Api.sale.stock.getAllAreaStockKpiByRegion(data, (r) => {
					this.dataList = r.data;
				}, (err) => {})
			},
			getAllDealerStockKpiByArea() {
				let data = {
					year: this.timeParams.year,
					quarter: this.timeParams.quarter,
					month: this.timeParams.month,
					region: this.locationParams.region,
					area: this.locationParams.area,
					statisticType: this.statisticType
				}
				Api.sale.stock.getAllDealerStockKpiByArea(data, (r) => {
					this.dataList = r.data;
				}, (err) => {})
			},
			getDealerStockKpiByDealerCode() {
				let data = {
					year: this.timeParams.year,
					quarter: this.timeParams.quarter,
					month: this.timeParams.month,
					region: this.locationParams.region,
					area: this.locationParams.area,
					dealer: this.locationParams.dealer,
					statisticType: this.statisticType
				}
				Api.sale.stock.getDealerStockKpiByDealerCode(data, (r) => {
					this.dataList = r.data;
				}, (err) => {})
			}
		},
		watch: {
			filterCondition: {
				handler(newVal) {
					let _region = newVal.location.region;
					let _area = newVal.location.area;
					let _dealer = newVal.location.dealer
					let _year = newVal.time.year
					let _quarter = newVal.time.quarter
					let _month = newVal.time.month
					let _statisticType = newVal.statisticType.type
					this.statisticType = _statisticType
					if (_year) {
						this.timeParams.year = _year
					}
					if (_quarter) {
						this.timeParams.quarter = _quarter
					}
					if (_month) {
						this.timeParams.month = _month
					}
					if (!_region && !_area && !_dealer) {
						this.getAllRegionStockKpi()
					}
					if (_region && !_area && !_dealer) {
						if (_region === '不限') {
							this.getAllRegionStockKpi()
						} else {
							this.locationParams.region = _region
							this.getAllAreaStockKpiByRegion()
						}
					}
					if (_region && _area && !_dealer) {
						if (_area === '不限') {
							this.locationParams.region = _region
							this.getAllAreaStockKpiByRegion()
						} else {
							this.locationParams.region = _region
							this.locationParams.area = _area
							this.getAllDealerStockKpiByArea()
						}
					}
					if (_region && _area && _dealer) {
						if (_dealer === '不限') {
							this.locationParams.region = _region
							this.locationParams.area = _area
							this.getAllDealerStockKpiByArea()
						} else {
							this.locationParams.region = _region
							this.locationParams.area = _area
							this.locationParams.dealer = _dealer
							this.getDealerStockKpiByDealerCode()
						}
					}
				},
				deep: true
			}
		},
		components: {}
	}
</script>

<style lang="scss">

</style>


