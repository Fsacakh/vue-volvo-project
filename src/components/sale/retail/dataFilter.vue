<!-- /src/components/sale/retail/dataFilter.vue-->
<template lang="html">
    <div class="vo-mobile-filter">
        <flexbox>
            <flexbox-item @click.native="switchPicker(0)" :class="{'active' :  filterType == 0 && show }">
                {{ location | swithRegion }} &nbsp;
                <i v-show="!(filterType == 0 && show)" class="fa fa-angle-down"></i>
                <i v-show="filterType == 0 && show" class="fa fa-angle-up"></i>
            </flexbox-item>
            <div class="vo-mobile-filter-divider"></div>
            <flexbox-item  @click.native="switchPicker(1)" :class="{'active' :  filterType === 1 && show }">
                {{ time }} &nbsp;
                <i v-show="!(filterType == 1 && show)" class="fa fa-angle-down"></i>
                <i v-show="filterType == 1 && show" class="fa fa-angle-up"></i>
            </flexbox-item>
        </flexbox>
    </div>
</template>

<script>
    import {
        Flexbox,
        FlexboxItem,
        XButton
    } from 'vux'
    export default {
        name: 'businessFilter',
        props: {
            show: {
				type: Boolean,
				default: false
			},
            filterCondition: {
				type: Object,
				default: {}
			}
        },
        data: function() {
            return {
                filterType: 0,
                location: '区域',
                time: '时间'
            }
        },
        methods: {
            switchPicker(filterType) {
                this.filterType = filterType
                this.$emit('switchPicker',filterType)
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
                    if(!_region && !_area && !_dealer) {
                        this.$data.location = '区域'
                    } else if(_region && !_area && !_dealer) {
                        if(_region === '不限') {
                            this.$data.location = '区域'
                        } else {
                            this.$data.location = _region
                        } 
                    } else if(_region && _area && !_dealer) {
                        if(_area === '不限') {
                            this.$data.location = _region 
                        } else {
                            this.$data.location = _area
                        }
                    } else if(_region && _area && _dealer) {
                        if(_dealer === '不限') {
                           this.$data.location = _area
                        } else {
                           this.$data.location = _dealer
                        }  
                    }
                    
                    if(!_year && !_quarter && !_month) {
                        this.$data.time = '时间' 
                    } else if(_year && _quarter === 'all' && _month === 'all') {
                        this.$data.time = _year
                    } else if(_year && _quarter != 'all' && _month === 'all') {
                        if (_quarter === '不限') {
                           this.$data.time = _year
                        } else {
                           this.$data.time = _year + '/' + _quarter
                        }
                    } else if(_year && _quarter != 'all' && _month != 'all') {
                        if (_month === '不限') {
                           this.$data.time = _year + '/' + _quarter
                        } else {
                           this.$data.time = _year + '/' + _quarter + '/' + _month
                        }
                    }
                },
                deep: true    
            }
        },
        components: {
            Flexbox,
            FlexboxItem,
            XButton
        }
    }
</script>
