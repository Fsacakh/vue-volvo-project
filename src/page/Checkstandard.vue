<!--硬件检测，达标上传图片页-->
<!--add by llf-->
<!--2017/6/16-->

<template>
  <div class="table-wrapper">
    <page-header>
      <a slot="title">{{response.question.type.name}}</a>
      <a slot="right-btn" @click="saveInspect">保存</a>
    </page-header>

    <div class="table-content">
      <div style="padding: 0.5rem">
        <div class="box-title">检核内容</div>
        <div class="box-details">{{response.question.content}}</div>
        <div v-show="state === 1" style="position: relative; height: 6rem;">
          <div v-show="!uploadpic">
            <input :disabled='isClosed' class="file-input" type="file" accept="image/*" @change="picChange"/>
            <Icon name="camera" class="take-photo-btn" scale="4"></Icon><br>
          </div>
          <div v-show="uploadpic" class="picture">
            <img class="check-img" v-show="uploadpic" :src="uploadpic" @click="preview"/>
            <div @click="deletePic"><Icon name="times-circle-o" class="img-delete" scale="2"></Icon></div>
          </div>
        </div>
        <div v-show="state === 2" style="height: 6rem">
          <textarea :disabled="isClosed" class="reason-input" v-model="suggestionText" placeholder="请输入未达标的具体内容"></textarea>
        </div>
      </div>
      <div class="btn-body">
        <button :disabled="isClosed" :class="[confirmClass]" @click="confirmClick">{{confirmBtnName}}</button>
        <button :disabled="isClosed" :class="[redoClass]" v-on:click="redoClick">{{redoBtnName}}</button>
      </div>
    </div>

    <div class="pic-preview" v-show="picPreview">
      <img :src="uploadpic" @click="closePreview"/>
    </div>
  </div>
</template>

<script>
  import * as Icon from 'vue-awesome'
  import PageHeader from '../components/PageHeader.vue'
  import {HTTP} from '../common/http'
  import {Indicator, Toast} from 'mint-ui'
  import router from '../router'

  export default {
    name: 'checkstandard',
    components: {
      Icon,
      PageHeader
    },
//    本页面的state控制BTN的显示情况
//      0 刚进来打分
//      1 达标
//      2 未达标
//    是否检核完成this.response.plan.state
//      0 已完成
//      1 已创建
//      2 未创建
    data: function () {
      return {
        detailId: '',
        response: '',
        suggestionText: '',
        state: 0,
        uploadpic: '',
        policy: {},
        picPreview: false,
        isClosed: true,
        type: '',
        picMust: ''
      }
    },
    computed: {
      confirmClass: function () {
        return this.state === 0 ? 'confirm-btn confirm-btn-5' : this.state === 1 ? 'confirm-btn confirm-btn-9' : 'confirm-btn confirm-btn-1'
      },
      redoClass: function () {
        return this.state === 0 ? 'redo-btn redo-btn-5' : this.state === 1 ? 'redo-btn redo-btn-1' : 'redo-btn redo-btn-9'
      },
      confirmBtnName: function () {
        return this.state === 2 ? '' : '达标'
      },
      redoBtnName: function () {
        return this.state === 1 ? '' : '未达标'
      }
    },
    methods: {
      fetchData: function () {
        this.type = this.$localStorage.get('type')
        this.detailId = this.$route.params.detailId
        if (!this.detailId) {
          this.detailId = this.$localStorage.get('detailId')
        } else {
          this.$localStorage.set('detailId', this.detailId)
        }
        HTTP.get('/plandetail/' + this.detailId)
          .then(function (response) {
//            console.log(response.data)
            this.response = response.data.data
            this.picMust = response.data.data.question.picture
            if (!(this.response.plan.state === 0) && this.type === '1') {
              this.isClosed = false
            }
            if (this.response.ispass) {
              this.state = 1
              this.uploadpic = this.response.picurl
            } else if (this.response.isinspected) {
              this.state = 2
              this.suggestionText = this.response.suggestion
            } else {
              this.state = 0
            }
          }.bind(this))
          .catch(function (error) {
            console.log(error)
          })
      },
      confirmClick: function () {
        this.state = 1
      },
      redoClick: function () {
        this.state = 2
      },
      picChange: function () {
        var data = new FormData()
        var input = document.querySelector('.file-input')
        var file = input.files[0]
        var key = this.calculate_object_name(file.name)
        data.append('key', key)
        data.append('policy', this.policy.policy)
        data.append('OSSAccessKeyId', this.policy.accessid)
        data.append('success_action_status', 200)
        data.append('signature', this.policy.signature)
        data.append('file', file)
        var config = {header: {'content-type': false}}
        Indicator.open('上传中...')
        HTTP.post(this.policy.host, data, config)
          .then(function (response) {
            if (response.status === 200) {
              Indicator.close()
              Toast('上传成功')
              this.uploadpic = this.policy.host + '/' + key
            } else {
              Indicator.close()
              Toast('上传失败')
            }
          }.bind(this))
          .catch(function (error) {
            Indicator.close()
            console.log(error)
          })
      },
      random_string: function (len) {
        len = len || 32
        var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz123456789'
        var maxPos = chars.length
        var pwd = ''
        for (var i = 0; i < len; i++) {
          pwd += chars.charAt(Math.floor(Math.random() * maxPos))
        }
        return pwd
      },
      get_suffix: function (filename) {
        var pos = filename.lastIndexOf('.')
        var suffix = ''
        if (pos !== -1) {
          suffix = filename.substring(pos)
        }
        return suffix
      },
      calculate_object_name: function (filename) {
        var policy = this.policy
        var suffix = this.get_suffix(filename)
        var key = policy.dir
        var gobjectname = key + this.random_string(10) + suffix
        return gobjectname
      },
      preview: function () {
        this.picPreview = true
      },
      closePreview: function () {
        this.picPreview = false
      },
      deletePic: function () {
        if (this.isClosed) {
          return
        }
        this.uploadpic = ''
      },
      saveInspect: function () {
        if (this.isClosed) {
          return
        }
        if (this.state === 1) {
          if (this.picMust && !this.uploadpic) {
            Toast('请上传图片')
            return
          }
          HTTP.patch('/plandetail/' + this.detailId, {
            'data': {
              'picurl': this.uploadpic,
              'ispass': true
            }
          }).then(function (response) {
            if (response.status === 200) {
              Toast('保存成功')
              router.go(-1)
            } else {
              Toast('保存失败' + response.status)
            }
          })
            .catch(e => {
              this.errors.push(e)
            })
        } else {
          if (!this.suggestionText) {
            Toast('请填写未达标理由')
            return
          }
          HTTP.patch('/plandetail/' + this.detailId, {
            'data': {
              'suggestion': this.suggestionText,
              'ispass': false
            }
          }).then(function (response) {
            if (response.status === 200) {
              Toast('保存成功')
              router.go(-1)
            } else {
              Toast('保存失败' + response.status)
            }
          })
            .catch(e => {
              this.errors.push(e)
            })
        }
      }
    },
    created: function () {
      this.fetchData()
      HTTP.get('/file/policy')
        .then(function (response) {
          this.policy = response.data
        }.bind(this))
        .catch(function () {
          Toast('网络连接错误')
        })
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../style/mixin.scss";

  .table-wrapper {
    position: relative;
    height: 100%;
    background-color: #f6f6f6;
  }

  .take-photo-btn {
    color:#9D9D9D;
    @include center();
  }

  .table-content {
    border:0.1rem solid white;
    -webkit-border-radius: 0.5rem;
    -moz-border-radius: 0.5rem;
    border-radius: 0.5rem;
    background-color: #ffffff;
    @include mg(0.5rem,0.2rem,0,0.2rem);
  }
  .box-title {
    text-align: left;
    @include mg(0.2rem,0,0,0.5rem);
    border-bottom: 0.1rem solid #e5e5e5;
  }

  .box-details {
    text-align: left;
    font-size: 0.9rem;
    @include mg(0.2rem,0,0,0.5rem);
  }

  .standard-btn{
    border: none;
    background-color: #5c83f3;
    @include sc(0.9rem, #ffffff, normal);
    @include wh(100%, 40px);
    margin-top: 1.5rem;
  }

  .reason-input {
    @include wh(90%, 5rem);
    @include sc(0.9rem, #D2D2D2, normal);
  }

  .btn-body {
    @include wh(100%, 2.5rem);
    .confirm-btn{
      float: left;
      color: #ffffff;
      border: none;
      border-bottom-left-radius: 0.5rem;
      background-color: #5c83f3;
      height: 2.5rem;
      transition: width 0.5s;
      font-size: 1rem;
    }
    .redo-btn {
      float: right;
      color: #ffffff;
      border: none;
      border-bottom-right-radius: 0.5rem;
      background-color: #DD7E8F;
      height: 2.5rem;
      transition: width 0.5s;
      font-size: 1rem;
    }

    .confirm-btn-9 {
      float: left;
      width: 90%;
    }
    .redo-btn-9 {
      float: right;
      width: 90%;
    }
    .confirm-btn-1 {
      float: left;
      width: 10%;
    }
    .redo-btn-1 {
      float: right;
      width: 10%;
    }
    .confirm-btn-5 {
      float: left;
      width: 50%;
    }
    .redo-btn-5 {
      float: right;
      width: 50%;
    }
  }

  .file-input {
    @include wh(3rem, 3rem);
    @include center();
    opacity: 0;
    z-index: 10;
  }

  .picture {
    @include wh(3rem, 5rem);
    @include center();
    position: relative;
  }
  .check-img {
    @include wh(100%, 100%);
  }

  .img-delete {
    position: absolute;
    top: -0.5rem;
    right: -0.5rem;
    color: #dedede;
    background-color: transparent;
  }

  .pic-preview {
    z-index: 120;
    position: absolute;
    top: 0;
    @include wh(100%, 100%);
    background-color: white;

    img {
      width: 100%;
      height: auto;
      @include center()
    }
  }
</style>
