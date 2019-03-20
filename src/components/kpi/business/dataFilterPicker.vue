<!--/src/components/kpi/business/dataFilterPicker.vue-->
<template lang="html">
	<div class="vo-mobile-filter-picker" :class="{'active': show && !initialShow }">	
		<transition name="vo-mobile-filter-picker-animate">
			<vue-tabs v-show="show && !initialShow" active-tab-color="#ccc" active-text-color="#6B96FD" :start-index="1" direction="vertical" @tab-change='handleParentTabChange'>
				<v-tab v-for="(item,index) in data" :title="item.value | swithRegion" class="color-gray">
					<vue-tabs active-tab-color="#ccc" active-text-color="#6B96FD" :start-index="1" direction="vertical" @tab-change='handleChildrenTabChange'>
						<v-tab v-for="(childItem,index) in item.children" :title="childItem.value" class="color-gray">
							<vue-tabs active-tab-color="#ccc" active-text-color="#6B96FD" :start-index="1" direction="vertical" @tab-change='handleGrandChildrenTabChange'>
								<v-tab v-for="(grandChildItem,index) in childItem.children" :title="grandChildItem.value" class="color-gray">
								</v-tab>
							</vue-tabs>
						</v-tab>
					</vue-tabs>
				</v-tab>
			</vue-tabs>
		</transition>
	</div>
</template>

<script>
	import {
		VueTabs,
		VTab
	} from 'vue-nav-tabs'
	import Api from '../../../net/api'
	import _ from 'lodash'
	
	export default {
		props: {
			isTransferDom: {
				type: Boolean
			},
			show: {
				type: Boolean,
				default: false
			},
			filterType: {
				type: Number,
				default: 0
			}
		},
		mounted: function() {
			this.$nextTick(
				() => {
					const _this = this
					this.initialShow = false
					this.type = this.$localStorage.get('type')
                    console.log(this.type)
					if (this.filterType === 0) {
					  if (this.type === '3' || this.type === '4') {
                          this.getAllRegion() 
					  }	else if (this.type === '2') {
                          this.region = this.$localStorage.get('region')
						  this.getAllAreaByRegion()
					  } else if (this.type === '1') {
                          this.region = this.$localStorage.get('region')
						  this.area = this.$localStorage.get('area')
						  this.getAllDealerByArea()
					  } else {
						  this.region = this.$localStorage.get('region')
						  this.area = this.$localStorage.get('area')
						  this.dealer = this.$localStorage.get('name')
						  this.getDealerByDealerCode()
					  }
			        } else if(this.filterType === 1) {
                        this.getYearList()
			        }
				}
			)
		},
		data: function() {
			return {
				initialShow: true,
				data: [],
				statisticType: [
					'总计',
					'零件',
					'附件'
				],
				type: '',
				regionIndex: 0,
				areaIndex: 0,
				dealerIndex: 0,
				yearIndex: 0,
				quarterIndex: 0,
				monthIndex: 0,
				region: '',
				area: '',
				dealer: '',
				year: '',
				quarter: '',
				month: ''
			}
		},
		methods: {
			//获取大区
			getAllRegion() {
				Api.kpi.getAllRegion((r) => {
					let _this = this
					_this.data = []
                    _.forEach(r.data, function(elem) {
						_this.data.push({ value: elem.region })
					})
				},(err) => {})
			},
			//获取小区
			getAllAreaByRegion(regionIndex) {
				let data = { region: this.region }
				Api.kpi.getAllAreaByRegion(data,(r) => {
					let _this = this
					if(arguments.length == 1) {
					  _this.$set(_this.data, regionIndex, { value: _this.region, children: []})
					  _.forEach(r.data, function(elem) {
                         _this.data[regionIndex].children.push({ value: elem.area })
					  })
					} else {
					  _this.data = []
					  _.forEach(r.data, function(elem) {
                         _this.data.push({ value: elem.area })
					  })	
					}
				},(err) => {})
			},
			//获取经销商
			getAllDealerByArea(regionIndex, areaIndex) {
				let data = { region: this.region, area: this.area }
				Api.kpi.getAllDealerByArea(data,(r) => {
					let _this = this
					let children  = []
					if(arguments.length == 2) {
					  _this.$set(_this.data[regionIndex].children, areaIndex, {value: _this.area, children: []})
                      _.forEach(r.data, function(elem) {
                          children.push({ value: elem.dealerName, code: elem.dealerCode })
					  })
					  _this.data[regionIndex].children[areaIndex].children = children
					} else if (arguments.length == 1) {
					   areaIndex = arguments[0]
                       _this.$set(_this.data, areaIndex, {value: _this.area, children: []})
					   _.forEach(r.data, function(elem) {
                          _this.data[areaIndex].children.push({ value: elem.dealerName, code: elem.dealerCode })
					   })
					} else {
					   _this.data = []
					   _.forEach(r.data, function(elem) {
                          _this.data.push({ value: elem.dealerName, code: elem.dealerCode })
					   })	
					}
				},(err) => {})
			},
			getDealerByDealerCode() {
				this.data = []
                this.data.push({ value: this.dealer, code: this.$localStorage.get('code')})
			},
			getYearList() {
                Api.kpi.getYearList((r) => {
                    let _this = this
					_this.data = []
                    _.forEach(r.data, function(elem) {
						_this.data.push({ value: elem.toString() })
					})
				},(err) => {})
			},
			getQuarter(yearIndex) {
				Api.kpi.getQuarter((r) => {
                    let _this = this
					let children = _this.data[yearIndex].children = []
					_this.$set(_this.data, yearIndex, { value: _this.year, children: []})
					_.forEach(r.data, function(elem) {
                        _this.data[yearIndex].children.push({ value: elem })
					})
				},(err) => {})
			},
            getMonthByQuarter(yearIndex, quarterIndex) {
				let data = { quarter: this.quarter }
                Api.kpi.getMonthByQuarter(data,(r) => {
                    let _this = this
					let children = []
					_this.$set(_this.data[yearIndex].children, quarterIndex, { value: this.quarter, children: []})
                    _.forEach(r.data, function(elem) {
                        children.push({ value: elem })
					})
					_this.data[yearIndex].children[quarterIndex].children = children
				},(err) => {}) 
			}, 
			handleRegionChange(tabIndex) {
                let _region = this.$data.data[tabIndex].value
				this.$data.regionIndex = tabIndex
				this.$data.region = _region
				this.$nextTick(function() {
					if(_region != '不限') {
                      this.getAllAreaByRegion(tabIndex)  
					}
				})
				if(_region === '不限') {
                    this.$emit('transmit', {
					    location: {
					       region: _region
					    }
				    })  
				}
			},
			handleAreaChange(tabIndex) {
				let _region = ''
				let _area = ''
				if (this.type === '3' || this.type === '4') {
                   let _regionIndex = this.$data.regionIndex
				   _region = this.$data.data[_regionIndex].value
				   _area = this.$data.data[_regionIndex].children[tabIndex].value
                   this.$data.areaIndex = tabIndex
				   this.$data.region = _region
				   this.$data.area = _area
				   if (_area != '不限') {
				     this.getAllDealerByArea(_regionIndex, tabIndex)
				   }
				} else if (this.type === '2') {
                   _region = this.$localStorage.get('region')
                   _area = this.$data.data[tabIndex].value
				   this.$data.areaIndex = tabIndex
				   this.$data.area = _area
				   if (_area != '不限') {
				      this.getAllDealerByArea(tabIndex)
				   }
				}
				if(_area === '不限') {
				  this.$emit('transmit', {
					 location: {
					    region: _region,
					    area: _area
					 }
				   })
				}
			},
			handleDealerChange(tabIndex) {
				let _region = ''
				let _area = ''
				let _dealer = ''
                if (this.type === '3' || this.type === '4') {
                   let _regionIndex = this.$data.regionIndex
				   let _areaIndex = this.$data.areaIndex
				   this.$data.dealerIndex = tabIndex
				   _region = this.$data.data[_regionIndex].value
				   _area = this.$data.data[_regionIndex].children[_areaIndex].value
				   _dealer = this.$data.data[_regionIndex].children[_areaIndex].children[tabIndex].code
				} else if (this.type === '2') {
                    let _areaIndex = this.$data.areaIndex
					this.$data.dealerIndex = tabIndex
					_region = this.$localStorage.get('region')
					_area = this.$data.data[_areaIndex].value
					_dealer = this.$data.data[_areaIndex].children[tabIndex].code
				} else if (this.type === '1' || this.type === '0') {
					this.$data.dealerIndex = tabIndex
                    _region = this.$localStorage.get('region')
					_area = this.$localStorage.get('area')
                    _dealer = this.$data.data[tabIndex].code
				}
				this.$emit('transmit', {
					location: {
					   region: _region,
					   area: _area,
					   dealer: _dealer
					}
				})
			},
			handleYearChange(tabIndex) {
                let _year = this.$data.data[tabIndex].value
				this.$data.yearIndex = tabIndex
				this.$data.year = _year
				this.$data.quarter = 'all'
				this.$data.month = 'all'
				this.getQuarter(tabIndex)
			},
			handleQuarterChange(tabIndex) {
                let _yearIndex = this.$data.yearIndex
				let _year = this.$data.data[_yearIndex].value
				let _quarter = this.$data.data[_yearIndex].children[tabIndex].value
                this.$data.quarterIndex = tabIndex
				this.$data.quarter = _quarter
				this.$data.month = 'all'
				this.getMonthByQuarter(_yearIndex, tabIndex)
				if(_quarter === '不限') {
				   this.$emit('transmit', {
					  time: {
					     year: _year,
					     quarter: _quarter,
					     month: 'all'
					  }
				   })
				}
			},
			handleMonthChange(tabIndex) {
                let _yearIndex = this.$data.yearIndex
				let _quarterIndex = this.$data.quarterIndex
				let _year = this.$data.data[_yearIndex].value
				let _quarter = this.$data.data[_yearIndex].children[_quarterIndex].value
				let _month = this.$data.data[_yearIndex].children[_quarterIndex].children[tabIndex].value
                this.$data.monthIndex = tabIndex
				this.$data.month = _month
				this.$emit('transmit', {
					time: {
					   year: _year,
					   quarter: _quarter,
					   month: _month
					}
				})
			},
			handleParentTabChange(tabIndex, newTab, oldTab) {
				switch(this.filterType) {
					case 0 : 
					  if (this.type === '3' || this.type === '4') {
					    this.handleRegionChange(tabIndex) 
					  } else if (this.type === '2') {
                        this.handleAreaChange(tabIndex)
					  } else if (this.type === '1' || this.type === '0') {
                        this.handleDealerChange(tabIndex)
					  }
					break
					case 1 : this.handleYearChange(tabIndex)
					break
					default : this.getStatisticTypes()
				}
			},
			handleChildrenTabChange(tabIndex, newTab, oldTab) {
				switch(this.filterType) {
					case 0 : 
					  if (this.type === '3' || this.type === '4') {
					    this.handleAreaChange(tabIndex)
					  } else if (this.type === '2') {
                        this.handleDealerChange(tabIndex)
					  } 
					break
					case 1:  this.handleQuarterChange(tabIndex)
					break
				}
			},
			handleGrandChildrenTabChange(tabIndex, newTab, oldTab) {
				switch(this.filterType) {
                    case 0 : 
					  if(this.type === '3' || this.type === '4') {
					    this.handleDealerChange(tabIndex)
					  } 
					break 
					case 1 : this.handleMonthChange(tabIndex)
					break
				}
			}	
		},
		watch: {
			filterType: {
				handler(newVal) {
                   if (this.filterType === 0) {
			          if (this.type === '3' || this.type === '4') {
                          this.getAllRegion() 
					  }	else if (this.type === '2') {
                          this.region = this.$localStorage.get('region')
						  this.getAllAreaByRegion()
					  } else if (this.type === '1') {
                          this.region = this.$localStorage.get('region')
						  this.area = this.$localStorage.get('area')
						  this.getAllDealerByArea()
					  } else {
						  this.region = this.$localStorage.get('region')
						  this.area = this.$localStorage.get('area')
						  this.dealer = this.$localStorage.get('name')
						  this.getDealerByDealerCode()
					  }
			       } else if(this.filterType === 1) {
                      this.getYearList()
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