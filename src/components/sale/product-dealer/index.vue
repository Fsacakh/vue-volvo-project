<!-- /src/components/sale/product/index.vue-->
<template lang="html">
  <div class="vo-mobile">
    <div class="page-group">
        <div class="page page-current">
            <header class="bar bar-nav">
                <i class="icon icon-back pull-left" @click.prevent="goback()"></i>
                <h1 class="title" >{{ title | swithRegion }}</h1>
            </header>
            <div class="content infinite-scroll">
                <data-filter :filterCondition='filterCondition' :show='showFilterPicker' @switchPicker="switchFilterPicker"></data-filter>
                <data-filter-picker :show='showFilterPicker' :filterType="filterType" @transmit="tabChange" ></data-filter-picker>  
                <Title :time='filterCondition.time'></Title>
                <list-body :filterCondition='filterCondition'></list-body>
            </div>
        </div>
    </div>
  </div>  
</template>

<script>
    import listBody from './listBody'
    import DataFilter from './dataFilter'
    import DataFilterPicker  from './dataFilterPicker'
    import Title from './title' 
    import _ from 'lodash'     
    export default {
        mounted: function() {
            this.filterCondition.location.region = this.$localStorage.get('region')
            this.filterCondition.location.area = this.$localStorage.get('area')	
			this.filterCondition.location.dealer = this.$localStorage.get('code')
        },
        data: function() {
            return {
                name: '全网数据',
                showFilterPicker: false,
                filterType: 2,
	            filterCondition:{
	            	location: {
	            		region: '',
	            		area: '',
	            		dealer: ''
	            	},
	            	time: {
	            		year: '2017',
                        quarter: 'all',
	            		month: 'all'
	            	}
	            }
            }
        },
        computed: {
           title: function() {
               let _region = this.$data.filterCondition.location.region
               let _area = this.$data.filterCondition.location.area
               let _dealer = this.$data.filterCondition.location.dealer
               if(!_region && !_area && !_dealer) {
                   return '全网数据'
               } else if(_region && !_area && !_dealer) {
                   if(_region === '不限') {
                      return '全网数据'
                   } else {
                      return  _region
                   }    
               } else if(_region && _area && !_dealer) {
                   if(_area === '不限') {
                      return _region
                   } else {
                      return  _area
                   }
               } else if(_region && _area && _dealer) {
                   if(_dealer === '不限') {
                      return  _area
                   } else {
                      return  _dealer
                   } 
               }
           }
        },
        methods: {
            switchFilterPicker(filterType) {
                this.filterType = filterType
                this.showFilterPicker = !this.showFilterPicker
            },
            tabChange(condition) {
                if (condition.location) {
		           this.filterCondition.location = condition.location
                }
                if (condition.time) {
		           this.filterCondition.time = condition.time
                }
                if (condition.statisticType) {
		           this.filterCondition.statisticType = condition.statisticType
                }
                this.showFilterPicker = false
		    },
            goback: function () {
               this.$router.go(-1)
            }
        },
        components: {
            DataFilter,
            DataFilterPicker,
            Title,
            listBody
        }     
    }
</script>

<style lang="scss">

</style>

