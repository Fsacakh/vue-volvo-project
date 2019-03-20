<!--雷达图-->
<!--add by llf-->
<!--2017/6/25-->

<template>
  <div class='page-wrapper'>
    <page-header>
      <a slot='title'>走访报告</a>
    </page-header>
    <div>
        <radar-chart :chart-data='sendData' :height='600'></radar-chart>
      <!--<radar-chart :my-data='sendData'></radar-chart>-->
    </div>
    <!--<button class="commit-btn" v-show='btnShow' @click='btnHandler'>查看整改计划</button>-->
    <button class="commit-btn" v-show='btnShow' @click='btnHandler'>{{btnText}}</button>
  </div>
</template>

<script>
  import RadarChart from '../common/RadarChart'
  import PageHeader from '../components/PageHeader'

  import {HTTP} from '../common/http'
  import router from '../router'
  import {Toast} from 'mint-ui'

  export default {
    name: 'radarchart',
    data: function () {
      return {
        type: '',
        sendData: '',
        year: '',
        month: '',
        currType: '',
        zoneId: '',
        subzoneId: '',
        currReportUrl: '',
        upReportUrl: '',
        planId: '',
        btnShow: false,
        label1: '',
        label2: '',
        myActionId: '',
        myCommit: '',
        btnText: ''
      }
    },
    components: {
      HTTP,
      'pageHeader': PageHeader,
      RadarChart
    },
    created: function () {
      this.fetchData()
    },
    methods: {
      fetchData: function () {
        this.type = this.$localStorage.get('type')
        this.currType = this.$route.params.currType
        if (!this.currType) {
          this.currType = this.$localStorage.get('currType')
        } else {
          this.$localStorage.set('currType', this.currType)
        }
        this.label1 = this.$route.params.currTitle
        if (!this.label1) {
          this.label1 = this.$localStorage.get('label1')
        } else {
          this.$localStorage.set('label1', this.label1)
        }
        this.year = this.$route.params.year
        this.month = this.$route.params.month

        if (this.currType === '1') {
          this.currReportUrl = '/nationreport?'
          this.fetchDataInner()
        } else if (this.currType === '2') {
          this.zoneId = this.$route.params.zoneId
          this.currReportUrl = '/zonereport?zoneid=' + this.zoneId + '&'
          this.upReportUrl = '/nationreport?'
          this.label2 = '全国'
          this.fetchDataInner()
        } else if (this.currType === '3') {
          this.subzoneId = this.$route.params.subzoneId
          this.currReportUrl = '/subzonereport?subzoneid=' + this.subzoneId + '&'
          this.upReportUrl = '/zonereportBysubzone?subzoneid=' + this.subzoneId + '&'
          this.label2 = '大区'
          this.fetchDataInner()
        } else {
          this.planId = this.$route.params.planId
          if (!this.planId) {
            this.planId = this.$localStorage.get('planId')
          } else {
            this.$localStorage.set('planId', this.planId)
          }
          this.label2 = '小区'
          this.btnShow = true
          HTTP.get('/report/dealerreport?planid=' + this.planId)
            .then(response => {
//              console.log(response.data)
              var dataSet1 = []
              var labelTxt = []
              for (var obj in response.data) {
                labelTxt.push(obj)
                dataSet1.push(response.data[obj].rate)
              }
              HTTP.get('/report/dealersubzonereport?planid=' + this.planId)
                .then(response => {
//                  console.log(response.data)
                  var dataSet2 = []
                  for (var obj in response.data) {
                    dataSet2.push(response.data[obj].rate)
                  }
                  this.calSendData(this.label1, dataSet1, this.label2, dataSet2, labelTxt)
//                  console.log('myTestData22: ' + JSON.stringify(this.sendData))
                  this.getActionId()
                })
                .catch(function (error) {
                  console.log(error)
                })
            })
            .catch(error => {
              console.log(error)
            })
        }
      },
      fetchDataInner: function () {
        var set1 = []
        var set2 = []
        var labelTxt = []
//        console.log('currReportUrl: ' + this.currReportUrl)
//        console.log('upReportUrl: ' + this.upReportUrl)
        HTTP.get('/report' + this.currReportUrl + 'year=' + this.year + '&month=' + this.month)
          .then(response => {
//            console.log(response.data)
            for (var obj in response.data) {
              labelTxt.push(obj)
              set1.push(response.data[obj].rate)
            }
            if (this.currType === '1') {
              this.calSendData(this.label1, set1, '', '', labelTxt)
//              console.log('myTestData23: ' + JSON.stringify(this.sendData))
            } else {
              HTTP.get('/report' + this.upReportUrl + 'year=' + this.year + '&month=' + this.month)
                .then(function (response) {
//                  console.log(response.data)
                  for (var obj in response.data) {
                    set2.push(response.data[obj].rate)
                  }
                  this.calSendData(this.label1, set1, this.label2, set2, labelTxt)
//                  console.log('myTestData2: ' + JSON.stringify(this.sendData))
                }.bind(this))
                .catch(error => {
                  console.log('error: ' + error)
                  console.log(status)
                })
            }
          })
          .catch(error => {
            console.log('error: ' + error)
            if (error.response.status === 404) {
              Toast('走访报告不存在')
              router.go(-1)
            }
          })
      },
      getActionId: function () {
        HTTP.get('/action/getId?plan=' + this.planId)
          .then(function (response) {
            this.myActionId = response.data.actionid
            this.myCommit = response.data.iscommit
            if (this.myActionId === 0 && this.type === '1') {
              this.btnText = '创建行动计划'
            } else {
              this.btnText = '查看行动计划'
            }
          }.bind(this))
          .catch(function (error) {
            console.log(error)
          })
      },
      btnHandler: function () {
        if (this.myActionId === 0 && this.type === '1') {
          this.postAction()
        } else if ((this.type === '2' || this.type === '3') && !this.myCommit) {
          Toast('行动计划待确认')
          return
        }
        router.push({name: 'ActionDetails', params: {id: this.myActionId}})
      },
      postAction: function () {
        HTTP.post('/action', {
          'data': {
            'planid': this.planId
          }
        }).then(function (response) {
          if (response.status === 201 || response.status === 200) {
            Toast('生成成功')
            this.myActionId = response.data.data.id
          } else {
            Toast('生成失败' + response.status)
          }
        })
          .catch(e => {
            this.errors.push(e)
          })
      },
      calSendData: function (label1, set1, label2, set2, labelTxt) {
        if (set2 === '') {
          this.sendData = {
            labels: labelTxt,
            datasets: [
              {
                label: label1,
                backgroundColor: '#A1DCFF',
                borderColor: '#A1DCFF',
                pointBackgroundColor: 'rgba(255,99,132,0.2)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(255,99,132,0.2)',
                data: set1
              }
            ]
          }
        } else {
          this.sendData = {
            labels: labelTxt,
            datasets: [
              {
                label: label1,
                backgroundColor: '#A1DCFF',
                borderColor: '#A1DCFF',
                pointBackgroundColor: 'rgba(255,99,132,0.2)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(255,99,132,0.2)',
                data: set1
              },
              {
                label: label2,
                backgroundColor: '#E0BCD9',
                borderColor: '#DAA4BD',
                pointBackgroundColor: 'rgba(179,181,198,0.2)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(179,181,198,0.2)',
                data: set2
              }
            ]
          }
        }
      }
    }
  }
</script>



<style lang="scss" scoped>
  @import "../style/mixin.scss";
  .page-wrapper {
    position: relative;
    height: 100%;
  }
  .commit-btn {
    color: #ffffff;
    font-size: 1rem;
    @include wh(12rem,2.5rem)
    border-radius: 0.5rem;
    @include mg(0.5rem,0.5rem,0.5rem,0.5rem);
    /*border: none;*/
  /*@include bgc(#5c83f3);*/
  @include bgc(rgba(25, 65, 155, 1));
    border: 0.01rem solid rgba(55, 85, 140, 1);
  }
</style>
