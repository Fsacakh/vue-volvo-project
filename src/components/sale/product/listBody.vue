<!-- /src/components/sale/product/listBody.vue-->
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
									{{ row.starRate }}
								</td>
								<td>
									{{ row.backCameraRate }}
								</td>
								<td>
									{{ row.recorderRate }}
								</td>
								<td>
									{{ row.navigationRate }}
								</td>
								<td>
									{{ row.engineRate }}
								</td>
								<td>
									{{ row.unheatedRate }}
								</td>
								<td>
									{{ row.pedalRate }}
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
						'北极星软件',
						'倒车影像',
						'行车记录仪',
						'SENSUS导航',
						'发动机下护板',
						'防爆隔热膜',
						'登车踏板'
					]
				},
				dataList: {},
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
				this.getAllRegionMajorProductKpi()
			} else if (this.type === '2') {
				this.locationParams.region = this.$localStorage.get('region')
				this.getAllAreaMajorProductKpiByRegion()
			} else if (this.type === '1') {
				this.locationParams.region = this.$localStorage.get('region')
				this.locationParams.area = this.$localStorage.get('area')
				this.getAllDealerMajorProductKpiByArea()
			} else {
				this.locationParams.region = this.$localStorage.get('region')
				this.locationParams.area = this.$localStorage.get('area')
				this.locationParams.dealer = this.$localStorage.get('code')
				this.getDealerMajorProductKpiByDealerCode()
			}
			table.init()
		},
		methods: {
			getAllRegionMajorProductKpi() {
				let data = {
					year: this.timeParams.year,
					quarter: this.timeParams.quarter,
					month: this.timeParams.month
				}
				Api.sale.product.getAllRegionMajorProductKpi(data, (r) => {
					this.dataList = r.data;
				}, (err) => {})
			},
			getAllAreaMajorProductKpiByRegion() {
				let data = {
					year: this.timeParams.year,
					quarter: this.timeParams.quarter,
					month: this.timeParams.month,
					region: this.locationParams.region
				}
				Api.sale.product.getAllAreaMajorProductKpiByRegion(data, (r) => {
					this.dataList = r.data;
				}, (err) => {})
			},
			getAllDealerMajorProductKpiByArea() {
				let data = {
					year: this.timeParams.year,
					quarter: this.timeParams.quarter,
					month: this.timeParams.month,
					region: this.locationParams.region,
					area: this.locationParams.area
				}
				Api.sale.product.getAllDealerMajorProductKpiByArea(data, (r) => {
					this.dataList = r.data;
				}, (err) => {})
			},
			getDealerMajorProductKpiByDealerCode() {
				let data = {
					year: this.timeParams.year,
					quarter: this.timeParams.quarter,
					month: this.timeParams.month,
					region: this.locationParams.region,
					area: this.locationParams.area,
					dealer: this.locationParams.dealer
				}
				Api.sale.product.getDealerMajorProductKpiByDealerCode(data, (r) => {
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
						this.getAllRegionMajorProductKpi()
					}
					if (_region && !_area && !_dealer) {
						if (_region === '不限') {
							this.getAllRegionMajorProductKpi()
						} else {
							this.locationParams.region = _region
							this.getAllAreaMajorProductKpiByRegion()
						}
					}
					if (_region && _area && !_dealer) {
						if (_area === '不限') {
							this.locationParams.region = _region
							this.getAllAreaMajorProductKpiByRegion()
						} else {
							this.locationParams.region = _region
							this.locationParams.area = _area
							this.getAllDealerMajorProductKpiByArea();
						}
					}
					if (_region && _area && _dealer) {
						if (_dealer === '不限') {
							this.locationParams.region = _region
							this.locationParams.area = _area
							this.getAllDealerMajorProductKpiByArea();
						} else {
							this.locationParams.region = _region
							this.locationParams.area = _area
							this.locationParams.dealer = _dealer
							this.getDealerMajorProductKpiByDealerCode()
						}
					}
				},
				deep: true
			}
		},
		components: {
		}
	}
</script>

<style lang="scss">

</style>


