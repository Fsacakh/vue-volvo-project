<!-- /src/components/sale/product/listBody.vue-->
<template lang="html">
    <div class="row no-gutter">
        <div class="col-100">
            <div class="table-scrollable">
                <table class="table table-bordered">
                    <tbody>
					   <template v-for="(row, index) in dataList">	
                         <tr>
						    <td class="color-primary">
                                北极星软件
						    </td>			 
                            <td>
								{{ row.starRate }}
                            </td>
					     </tr>
						 <tr>		
							<td class="color-primary">
								倒车影像
						    </td>		 
                            <td>
								{{ row.backCameraRate }}
                            </td>
					     </tr>
						 <tr>	
							<td class="color-primary">
							    行车记录仪
						    </td> 		 	
                            <td>
							    {{ row.recorderRate }}
                            </td>
					     </tr>	
						 <tr>	
							<td class="color-primary">
                                SENSUS导航
						    </td>		 
                            <td>
							    {{ row.navigationRate }}
                            </td>
					     </tr>
						 <tr>		
							<td class="color-primary">
                                发动机下护板
						    </td>		 
							<td>
							    {{ row.engineRate }}	
						    </td>	
					     </tr>			
						 <tr>
							<td class="color-primary">
                                防爆隔热膜
						    </td> 
                            <td>
								{{ row.unheatedRate }}
                            </td>
					     </tr>	
						 <tr>	
						 <tr>
							<td class="color-primary"> 	
						       登车踏板								
						    </td>		 
							<td>
							   {{ row.pedalRate }}
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
				let data = { year: this.timeParams.year, quarter: this.timeParams.quarter, month: this.timeParams.month }
        		Api.sale.product.getAllRegionMajorProductKpi(data,(r) => {
        		   this.dataList = r.data;
        		},(err) => {})
        	},
			getAllAreaMajorProductKpiByRegion() {
				let data = { year: this.timeParams.year, quarter: this.timeParams.quarter, month: this.timeParams.month, region: this.locationParams.region } 
				Api.sale.product.getAllAreaMajorProductKpiByRegion(data, (r) => {
        		   this.dataList = r.data;
        		},(err) => {})
			},
           getAllDealerMajorProductKpiByArea() {
			   let data = { year: this.timeParams.year, quarter: this.timeParams.quarter, month: this.timeParams.month, region: this.locationParams.region, area: this.locationParams.area }
			   Api.sale.product.getAllDealerMajorProductKpiByArea(data, (r) => {
        		  this.dataList = r.data;  
        	   },(err) => {})
		   },
		   getDealerMajorProductKpiByDealerCode() {
			   let data = { year: this.timeParams.year, quarter: this.timeParams.quarter, month: this.timeParams.month, region: this.locationParams.region, area: this.locationParams.area, dealer: this.locationParams.dealer}
			   Api.sale.product.getDealerMajorProductKpiByDealerCode(data, (r) => {
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
                       this.getAllRegionMajorProductKpi() 
					}
                    if(_region && !_area && !_dealer) {
					   if (_region === '不限') {	
						   this.getAllRegionMajorProductKpi()
					   } else {
						   this.locationParams.region = _region
					       this.getAllAreaMajorProductKpiByRegion()
					   } 	   	   	
					} 
					if(_region && _area && !_dealer) {
					   if (_area === '不限') {
						   this.locationParams.region = _region
					       this.getAllAreaMajorProductKpiByRegion()  
					   } else {
                           this.locationParams.region = _region
					       this.locationParams.area = _area
					       this.getAllDealerMajorProductKpiByArea();
					   }	   	
					}
					if(_region && _area && _dealer) {
					   if(_dealer === '不限') {
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


