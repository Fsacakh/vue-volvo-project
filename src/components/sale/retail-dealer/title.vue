<!-- /src/components/sale/retail/title.vue-->
<template lang="html">
    <div>
        <div class="row no-gutter vo-mobile-title">
            <div class="col-60 bg-color-primary">
                <span>当前时间&nbsp;&nbsp;{{ '' | dateFormat }}</span>
            </div>
            <div class="col-40 bg-color-white color-primary">
                <span>时间进度&nbsp;&nbsp;{{ dateProgress }}</span>
            </div> 
        </div>
    </div>
</template>

<script>
    import Api from '../../../net/api'

    export default {
        props: {
            time: {
                type: Object,
                default: {}
            }
        },
        data: function() {
            return {
                dateProgress: ''
            }
        },
        mounted() {
            let _year = this.time.year
            let _quarter = this.time.quarter
            let _month = this.time.month
            let data = { year: _year, quarter: _quarter, month: _month }
            this.getRateOfTime(data)
        },    
        methods: {
            getRateOfTime: function(time) {
                 Api.kpi.getRateOfTime(time, (r) => {
                    this.$data.dateProgress = r.data.rate
                 },(err) => {})
            }
        },
        watch: {
            time: {
                handler(newVal) { 
                   let _year = newVal.year
                   let _quarter = newVal.quarter
                   let _month = newVal.month
                   let data = { year: _year, quarter: _quarter, month: _month }
                   console.log("year : "+ _year + ", quarter: "+ _quarter)
                   this.getRateOfTime(data)
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
 
 
 