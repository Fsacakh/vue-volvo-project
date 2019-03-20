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
                               <th>产值目标</th> <!--valueGoal-->
							   <th>累计完成(产值)</th><!--totalComplete-->
							   <th>完成率(产值)</th><!--totalCompleteRate-->
							   <th>去年同期(产值)</th><!--currValue-->
							   <th>同比增长(产值)</th><!--circleRate-->
							   <th>工时销售额</th><!--workHoursSales-->
							   <th>零件销售额</th><!--partSales-->
							   <th>附件销售额</th><!--attachmentSales-->
							   <th>单车产值</th><!--oneCarValue-->
							   <th>附件渗透率</th><!--attachmentRate-->	
							</tr>
						</thead>
					</table>
				</div>
				<div class="rightDiv2">
                <table class="table table-bordered">
                    <tbody>
                        <tr v-for="(row, index) in dataList">
                            <td>
								{{ row.valueGoal }}
                            </td>
                            <td>
								{{ row.totalComplete }}
                            </td>
                            <td>
								{{ row.totalCompleteRate }}
                            </td>
                            <td>
								{{ row.currValue }}
                            </td>
							<td>
								{{ row.circleRate }}	
						    </td>		
                            <td>
								{{ row.workHoursSales }}
                            </td>
							<td>
								{{ row.partSales }}
                            </td>
							<td>
								{{ row.attachmentSales  }}
						    </td>
							<td>
								{{ row.oneCarValue }}	
						    </td>	
							<td>
								{{ row.attachmentRate }}
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
						'区域',
                        '产值目标',
                        '累计完成(产值)',
                        '完成率(产值)',
                        '去年同期(产值)',
                        '同比增长(产值)',
						'工时销售额',
						'零件销售额',
						'附件销售额',
						'单车产值',
						'附件渗透率',
                        '台次同比增长',
                        '毛利率',
                        '台次目标',
						'去年同期台次',
						'累计台次',
						'零附件成本',
						'台次完成率',
						'当日产值',
						'当日台次'				
                    ]
                },
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
			if (this.type === '3' || this.type ==='4') {
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
				let data = { year: this.timeParams.year, quarter: this.timeParams.quarter, month: this.timeParams.month }
        		Api.sale.retail.getAllRegionRetailSaleKpi(data,(r) => {
        		   this.dataList = r.data;
        		},(err) => {})
        	},
			getAllAreaRetailSaleKpiByRegion() {
				let data = { year: this.timeParams.year, quarter: this.timeParams.quarter, month: this.timeParams.month, region: this.locationParams.region } 
				Api.sale.retail.getAllAreaRetailSaleKpiByRegion(data, (r) => {
        		   this.dataList = r.data;
        		},(err) => {})
			},
           getAllDealerRetailSaleKpiByArea() {
			   let data = { year: this.timeParams.year, quarter: this.timeParams.quarter, month: this.timeParams.month, region: this.locationParams.region, area: this.locationParams.area }
			   Api.sale.retail.getAllDealerRetailSaleKpiByArea(data, (r) => {
        		  this.dataList = r.data;  
        	   },(err) => {})
		   },
		   getDealerRetailSaleKpiByDealerCode() {
			   let data = { year: this.timeParams.year, quarter: this.timeParams.quarter, month: this.timeParams.month, region: this.locationParams.region, area: this.locationParams.area, dealer: this.locationParams.dealer }
			   Api.sale.retail.getDealerRetailSaleKpiByDealerCode(data, (r) => {
        		  this.dataList = r.data;  
        	   },(err) => {})
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
                    if(_year) {
					   this.timeParams.year = _year
					}
					if(_quarter) {
                       this.timeParams.quarter = _quarter
					}
					if(_month) {
                       this.timeParams.month = _month
					}
					if(!_region && !_area && !_dealer) {
					   this.getAllRegionRetailSaleKpi() 	
					}		
                    if(_region && !_area && !_dealer) {
					   if (_region === '不限') {
						  this.getAllRegionRetailSaleKpi()  
					   } else {
                          this.locationParams.region = _region
					      this.getAllAreaRetailSaleKpiByRegion()
					   }	   	
					} 
					if(_region && _area && !_dealer) {
					   if (_area === '不限') {
						  this.locationParams.region = _region
					      this.getAllAreaRetailSaleKpiByRegion() 
					   } else {
						  this.locationParams.region = _region
					      this.locationParams.area = _area
					      this.getAllDealerRetailSaleKpiByArea()
					   }	   	
					}
					if(_region && _area && _dealer) {
					   if(_dealer === '不限') {
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
        components: {

        }
    }
</script>

<style lang="scss">

</style>


