/**
 * Created by lulifei on 17/7/5.
 */
import {Radar, mixins} from 'vue-chartjs'
const { reactiveProp } = mixins

export default Radar.extend({
  mixins: [reactiveProp],
  mounted () {
    // console.log('chartData init: ' + this.chartData)
    if (!this.chartData) {
      return
    }
    this.renderChart(this.chartData, {responsive: true, maintainAspectRatio: false})
  },
  watch: {
    chartData: function () {
      // console.log('chartData change: ' + this.chartData)
      this.renderChart(this.chartData, {responsive: true,
        maintainAspectRatio: false,
        scale: {
          ticks: {
            beginAtZero: true,
            max: 100
          }
        }
      })
    }
  }
})
