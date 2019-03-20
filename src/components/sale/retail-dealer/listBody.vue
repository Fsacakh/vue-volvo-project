<!-- /src/components/sale/retail/listBody.vue-->
<template lang="html">
	<div class="row no-gutter">
		<div class="col-100">
			<div class="table-scrollable">
				<table class="table table-bordered">
					<tbody>
					  <template v-for="(row, index) in dataList">
						<tr>
							<td class="color-primary">
								产值目标
							</td>
							<td>
								{{ row.valueGoal }}
							</td>
						</tr>
						<tr>
							<td class="color-primary">
								累计完成(产值)
							</td>
							<td>
								{{ row.totalComplete }}
							</td>
						</tr>
						<tr>
							<td class="color-primary">
								完成率(产值)
							</td>
							<td>
								{{ row.totalCompleteRate }}
							</td>
						</tr>
						<tr>
							<td class="color-primary">
								去年同期(产值)
							</td>
							<td>
								{{ row.currValue }}
							</td>
						</tr>
						</tr>
						<tr>
							<td class="color-primary">
								同比增长(产值)
							</td>
							<td>
								{{ row.circleRate }}
							</td>
						</tr>
						<tr>
							<td class="color-primary">
								工时销售额
							</td>
							<td>
								{{ row.workHoursSales }}
							</td>
						</tr>
						<tr>
							<td class="color-primary">
								零件销售额
							</td>
							<td>
								{{ row.partSales }}
							</td>
						</tr>
						<tr>
							<td class="color-primary">
								附件销售额
							</td>
							<td>
								{{ row.attachmentSales }}
							</td>
						</tr>
						<tr>
							<td class="color-primary">
								单车产值
							</td>
							<td>
								{{ row.oneCarValue }}
							</td>
						</tr>
						<tr>
							<td class="color-primary">
								附件渗透率
							</td>
							<td>
								{{ row.attachmentRate }}
							</td>
						</tr>
						<tr>
							<td class="color-primary">
								台次同比增长
							</td>
							<td>
								{{ row.countCircleRate }}
							</td>
						</tr>
						<tr>
							<td class="color-primary">
								台次目标
							</td>
							<td>
								{{ row.countGoal }}
							</td>
						</tr>
						<tr>
							<td class="color-primary">
								去年同期台次
							</td>
							<td>
								{{ row.currCount }}
							</td>
						</tr>
						<tr>
							<td class="color-primary">
								累计台次
							</td>
							<td>
								{{ row.serviceCount }}
							</td>
						</tr>
						<tr>
							<td class="color-primary">
								台次完成率
							</td>
							<td>
								{{ row.countRate }}
							</td>
						</tr>
						<tr>
							<td class="color-primary">
								当日产值
							</td>
							<td>
								{{ row.yesterdayValue }}
							</td>
						</tr>
						<tr>
							<td class="color-primary">
								当日台次
							</td>
							<td>
								{{ row.yesterdayCount }}
							</td>
						</tr>
						<tr>
							<td class="color-primary">
								零附件成本
							</td>
							<td>
								{{ row.totalCost }}
							</td>
						</tr>
						<tr>
							<td class="color-primary">
								毛利率
							</td>
							<td>
								{{ row.profitRate }}
							</td>
						</tr>
                      </template>
                    </tbody>
                </table>
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
				dataList: {},
				type: '',
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
				this.getAllRegionRetailSaleKpi()
			} else if (this.type === '2') {
				this.locationParams.region = this.$localStorage.get('region')
				this.getAllAreaRetailSaleKpiByRegion()
			} else if (this.type === '1') {
				this.locationParams.region = this.$localStorage.get('region')
				this.locationParams.area = this.$localStorage.get('area')
				this.getAllDealerRetailSaleKpiByArea()
			} else {
				this.locationParams.region = this.$localStorage.get('region')
				this.locationParams.area = this.$localStorage.get('area')
				this.locationParams.dealer = this.$localStorage.get('code')
				this.getDealerRetailSaleKpiByDealerCode()
			}
			table.init()
		},
		methods: {
			getAllRegionRetailSaleKpi() {
				let data = {
					year: this.timeParams.year,
					quarter: this.timeParams.quarter,
					month: this.timeParams.month
				}
				Api.sale.retail.getAllRegionRetailSaleKpi(data, (r) => {
					this.dataList = r.data;
				}, (err) => {})
			},
			getAllAreaRetailSaleKpiByRegion() {
				let data = {
					year: this.timeParams.year,
					quarter: this.timeParams.quarter,
					month: this.timeParams.month,
					region: this.locationParams.region
				}
				Api.sale.retail.getAllAreaRetailSaleKpiByRegion(data, (r) => {
					this.dataList = r.data;
				}, (err) => {})
			},
			getAllDealerRetailSaleKpiByArea() {
				let data = {
					year: this.timeParams.year,
					quarter: this.timeParams.quarter,
					month: this.timeParams.month,
					region: this.locationParams.region,
					area: this.locationParams.area
				}
				Api.sale.retail.getAllDealerRetailSaleKpiByArea(data, (r) => {
					this.dataList = r.data;
				}, (err) => {})
			},
			getDealerRetailSaleKpiByDealerCode() {
				let data = {
					year: this.timeParams.year,
					quarter: this.timeParams.quarter,
					month: this.timeParams.month,
					region: this.locationParams.region,
					area: this.locationParams.area,
					dealer: this.locationParams.dealer
				}
				Api.sale.retail.getDealerRetailSaleKpiByDealerCode(data, (r) => {
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
						this.getAllRegionRetailSaleKpi()
					}
					if (_region && !_area && !_dealer) {
						if (_region === '不限') {
							this.getAllRegionRetailSaleKpi()
						} else {
							this.locationParams.region = _region
							this.getAllAreaRetailSaleKpiByRegion()
						}
					}
					if (_region && _area && !_dealer) {
						if (_area === '不限') {
							this.locationParams.region = _region
							this.getAllAreaRetailSaleKpiByRegion()
						} else {
							this.locationParams.region = _region
							this.locationParams.area = _area
							this.getAllDealerRetailSaleKpiByArea()
						}
					}
					if (_region && _area && _dealer) {
						if (_dealer === '不限') {
							this.locationParams.region = _region
							this.locationParams.area = _area
							this.getAllDealerRetailSaleKpiByArea()
						} else {
							this.locationParams.region = _region
							this.locationParams.area = _area
							this.locationParams.dealer = _dealer
							this.getDealerRetailSaleKpiByDealerCode()
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


