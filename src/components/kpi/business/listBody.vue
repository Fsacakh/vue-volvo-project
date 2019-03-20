<!-- /src/components/kpi/business/listBody.vue-->
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
									{{ row.satisfactionRate }}
								</td>
								<td>
									{{ row.complainsRate }}
								</td>
								<td>
									{{ row.fiveDayClosingRate }}
								</td>
								<td>
									{{ row.appointmentRate }}
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
				type: '',
				table: {
					columns: [
						'满意度',
						'投诉率',
						'5日结案率',
						'预约率'
					]
				},
				dataList: {},
				locationParams: {
					region: 'WEST',
					area: '安徽、江西',
					dealer: 'SHA'
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
				this.getDataAllRegion()
			} else if (this.type === '2') {
				this.locationParams.region = this.$localStorage.get('region')
				this.getDataAllArea()
			} else if (this.type === '1') {
				this.locationParams.region = this.$localStorage.get('region')
				this.locationParams.area = this.$localStorage.get('area')
				this.getDataAllDealer()
			} else {
				this.locationParams.region = this.$localStorage.get('region')
				this.locationParams.area = this.$localStorage.get('area')
				this.locationParams.dealer = this.$localStorage.get('code')
				this.getDataDealer()
			}
			table.init()
		},
		methods: {
			//总部权限（拉去 所有数据）
			getDataAllRegion() {
				let data = {
					year: this.timeParams.year,
					quarter: this.timeParams.quarter,
					month: this.timeParams.month
				}
				Api.kpi.getAllRegionBusinessPolicyKpi(data, (r) => {
					this.dataList = r.data;
				}, (err) => {})
			},
			//大区权限
			getDataAllArea() {
				let data = {
					year: this.timeParams.year,
					quarter: this.timeParams.quarter,
					month: this.timeParams.month,
					region: this.locationParams.region
				}
				Api.kpi.getAllAreaBusinessPolicyKpiByRegion(data, (r) => {
					this.dataList = r.data;
				}, (err) => {})
			},
			//小区权限   
			getDataAllDealer() {
				let data = {
					year: this.timeParams.year,
					quarter: this.timeParams.quarter,
					month: this.timeParams.month,
					region: this.locationParams.region,
					area: this.locationParams.area
				}
				Api.kpi.getAllDealerBusinessPolicyKpiByArea(data, (r) => {
					this.dataList = r.data;
				}, (err) => {})
			},
			//经销商权限
			getDataDealer() {
				let data = {
					year: this.timeParams.year,
					quarter: this.timeParams.quarter,
					month: this.timeParams.month,
					region: this.locationParams.region,
					area: this.locationParams.area,
					dealer: this.locationParams.dealer
				}
				Api.kpi.getDealerBusinessPolicyKpiByDealerCode(data, (r) => {
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
					console.log('year: ' + _year + 'quarter: ' + _quarter)
					if (_year) {
						this.timeParams.year = _year
					}
					if (_quarter) {
						this.timeParams.quarter = _quarter
					}
					if (_month) {
						this.timeParams.month = _month
					}
					console.log('region: ' + _region + 'area: ' + _area + 'dealer: ' + _dealer)
					if (!_region && !_area && !_dealer) {
						this.getDataAllRegion()
					} else if (_region && !_area && !_dealer) {
						if (_region === '不限') {
							this.getDataAllRegion()
						} else {
							this.locationParams.region = _region
							this.getDataAllArea()
						}
					} else if (_region && _area && !_dealer) {
						if (_area === '不限') {
							this.locationParams.region = _region
							this.getDataAllArea()
						} else {
							this.locationParams.region = _region
							this.locationParams.area = _area
							this.getDataAllDealer()
						}
					} else if (_region && _area && _dealer) {
						if (_dealer === '不限') {
							this.locationParams.region = _region
							this.locationParams.area = _area
							this.getDataAllDealer()
						} else {
							this.locationParams.region = _region
							this.locationParams.area = _area
							this.locationParams.dealer = _dealer
							this.getDataDealer()
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


