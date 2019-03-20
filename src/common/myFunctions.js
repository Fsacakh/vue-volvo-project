/**
 * Created by lulifei on 17/7/17.
 */

// 根据身份定位界面
export function setLinkUrl (type, areaId, areaName) {
  var checkUrl, actionUrl, reportUrl
  if (type === 0) {
    checkUrl = JSON.stringify({name: 'Dealerlist', params: { dealerId: areaId, dealerName: areaName }})
    actionUrl = JSON.stringify({name: 'DealerAction', params: { dealerId: areaId, dealerName: areaName }})
    reportUrl = JSON.stringify({name: 'DealerReport', params: { currType: '4', dealerId: areaId, dealerName: areaName }})
  } else if (type === 1) {
    checkUrl = JSON.stringify({name: 'CheckListSubzone', params: { subzoneId: areaId, subzoneName: areaName }})
    actionUrl = JSON.stringify({name: 'ActionListSubzone', params: { subzoneId: areaId, subzoneName: areaName }})
    reportUrl = JSON.stringify({name: 'ReportListSubzone', params: { subzoneId: areaId, subzoneName: areaName }})
  } else if (type === 2) {
    checkUrl = JSON.stringify({name: 'CheckListZone', params: { zoneId: areaId, zoneName: areaName }})
    actionUrl = JSON.stringify({name: 'ActionListZone', params: { zoneId: areaId, zoneName: areaName }})
    reportUrl = JSON.stringify({name: 'ReportListZone', params: { zoneId: areaId, zoneName: areaName }})
  } else {
    checkUrl = '/checklists'
    actionUrl = '/actionlists'
    reportUrl = '/report'
  }
  // console.log(checkUrl)
  // console.log(actionUrl)
  // console.log(reportUrl)
  window.localStorage.setItem('checkUrl', checkUrl)
  window.localStorage.setItem('actionUrl', actionUrl)
  window.localStorage.setItem('reportUrl', reportUrl)
}
