<template>
    <div class="hfq-record hfq-component">
      <!-- 上传录音 -->
      <el-upload
        action="/file/api/uploadfile/"
        :file-list="recordList"
        accept="audio/*"
        :data="uploadReqBody"
        :on-success="handleUploadSuccess"
        :on-progress="handleUploadProcess"
        class="upload"
        :show-file-list="false"
      >
        <div class="hfq-component-title">录音
          <el-button type="text" :loading="isLoading">上传录音</el-button>
        </div>
      </el-upload>

      <!-- 播放录音 -->
      <div class="hfq-component-content">
          <div class="hfq-cell" v-for="(item,index) in recordList">
            <audio :id="'hfq-audio-'+index" :src="item.url" @canplay="initAudio(index,item)">你的浏览器不支持音频播放器!</audio>
            <div class="hfq-cell-hd">
              <div>
                <el-button @click="play(index,item)" v-show="!item.isPlay" type="primary" class="m-btn">
                  <img src="./img/play.png" width="11" height="16" style="margin-left: 1px;">
                </el-button>
              </div>
              <div>
                <el-button @click="pause(index,item)" v-show="item.isPlay" type="primary" class="m-btn">
                  <img  src="./img/pause.png" width="12" height="12">
                </el-button>
              </div>
            </div>
            <div class="hfq-cell-bd hfq-cell record-process">
                    <div class="hfq-cell-hd text">{{formateTime(item.curTime)}}/{{formateTime(item.totalTime)}}</div>
                    <div class="hfq-cell-hd">
                      <Slider :tip-format="tipFormat(item)" @on-change="handleProcessDrag(index,item)" class="m-slider" v-model="item.process"></Slider>
                    </div>
            </div>
            <div class="hfq-cell-bd hfq-cell m-icons">
                <div class="hfq-cell-bd m-download" @click="handleDownload(item)">
                  <a :href="item.url" download="录音">
                  <img src="./img/download.png" alt="" width="14" height="17">
                  </a>
                </div>
                <div class="hfq-cell-bd">
                  <el-switch
                    v-model="item.isValid"
                    on-text="有效"
                    off-text="无效"
                    on-color="#20A0FF"
                    off-color="#C0CCDA">
                  </el-switch>
                </div>
            </div>
          </div>
      </div>

    </div>
</template>

<script>
    import Slider from 'iview/src/components/slider'


    export default{
        name: '',
        components:{ Slider },
        data(){
            return {
                // 录音列表
                recordList:[
                  /*{
                    // 播放
                    isPlay: false,
                    // 进度
                    process: 0,
                    // 是否有效
                    isValid: true,
                    // 总时长
                    totalTime: 0,
                    // 当期时长
                    curTime: 0,
                    // 录音的地址
                    url: 'static/test.mp3',
                    // 合同号
                    contractNo: ''
                  }*/
                ],
                // 录音加载中
                isLoading:false,
                // 定时器
                interval:'',
                // 文件上传的参数
                uploadReqBody:{
                  platform:'inner',
                  group_name:'hfqboss',
                  compress: 1
                }
            }
        },
        methods: {
          // 播放或暂停,先将其他所有的录音播放暂停
          play(index,item){
            if(item.process == 100){
              return false
            }
            let that = this;
            this.recordList.forEach(function (record,i) {
              record.isPlay = false;
              that.updatePlayProcess(i,record);
            });
            item.isPlay = true;
            let audio = this.$el.querySelectorAll('#hfq-audio-'+index)[0];
            audio.play();
            this.updatePlayProcess(index,item);
          },
          // 暂停
          pause(index,item){
            console.log('暂停');
            item.isPlay = false;
            let audio = this.$el.querySelectorAll('#hfq-audio-'+index)[0];
            audio.pause();
            this.updatePlayProcess(index,item);
          },
          // 下载
          handleDownload(item){

          },
          // 格式化时间,将秒转化成'00:00'的格式
          formateTime(n){
              let total = parseInt(n);
              if(total === NaN){
                  throw Error('参数异常')
                  return false
              }
              let mm = Math.floor(total/60);
              mm = mm > 9 ? mm : '0'+ mm ;
              let ss = total%60;
              ss = ss > 9 ? ss : '0'+ ss ;
              return mm + ':' + ss
          },
          // tip格式化
          tipFormat(item){
              let that = this;
              return function () {
                return that.formateTime(item.process * item.totalTime /100)
              }
          },
          // 更新当期播放进度
          updatePlayProcess(index,item){
            let that = this;
            let audio = this.$el.querySelectorAll('#hfq-audio-'+index)[0];
            if(item.isPlay){
                clearInterval(this.interval);
                this.interval =  setInterval(function () {
                  if(item.process == 100){
                    item.isPlay = false;
                    clearInterval(that.interval);
                  }else {
                      let process = parseInt(audio.currentTime / audio.duration * 100);
                      if(process - item.process == 1){
                        item.process = process;
                      }
                    item.curTime = audio.currentTime;
                  }
                },100);
            }else {
                audio.pause();
                clearInterval(this.interval);
            }
          },
          // 初始化播放器
          initAudio(index,item){
            let audio = this.$el.querySelectorAll('#hfq-audio-'+index)[0];
            item.totalTime = audio.duration;
            console.log(index,item.totalTime);
          },
          // 拖拽进度条
          handleProcessDrag(index,item){
            console.log('进度',item.process);
            let audio = this.$el.querySelectorAll('#hfq-audio-'+index)[0];
            clearInterval(this.interval);
            setTimeout(()=>{
            item.curTime = parseInt(item.process * item.totalTime /100);
            audio.currentTime = item.curTime;
              this.updatePlayProcess(index,item);
            },100);
          },
          // 上传进度
          handleUploadProcess(e,file,fileList){
            this.isLoading = true;
            console.log(e,file,fileList);
          },
          // 录音上传成功
          handleUploadSuccess(response,file,fileList){
            console.log(fileList);
            this.isLoading = false;
            this.recordList.push({
              isPlay: false,
              process: 0,
              isValid: true,
              totalTime: file.totalTime,
              curTime: 0,
              name:file.name,
              url:file.url
            });
          },
        },
        mounted(){
          // 获取录音列表
          let params = {contract_no:'201704130002'};
          this.$axios.post('/api/audit/qc_contract_records/',params)
            .then((res)  => {
              console.log(res.data);
              res.data.result.records.forEach((item,index) => {
                this.recordList.push({
                  isPlay: false,
                  process: 0,
                  isValid: item.f_state === 1,
                  totalTime: 0,
                  curTime: 0,
                  url:this.utils.replaceUrl(item.f_record_url,/http:\/\/file\.huifenqi\.com/),
                  contractNo:item.f_contract_no
                });
              });
            })
        }
    }
</script>

<style lang="less">
    .hfq-record{
        .m-btn{padding:6px 8px;width: 32px;height: 32px;}
        .hfq-cell.hfq-cell-bd{
            height: 32px;
            border: 1px solid #C0CCDA;
            border-radius: 4px;
            padding-left: 12px;
            padding-right: 12px;
        }
        .record-process{ margin-right: 10px; }
        .record-process .m-slider{ width: 200px; }

        .record-process>.hfq-cell-hd.text{width: 79px;}

        .m-icons .m-slider{ width: 84px; }

        .m-icons .m-download{ margin-right: 20px; cursor: pointer; }

        .ivu-slider-button-wrap{top:-7px;}
        /* 录音组件 */
        .upload{width: 360px;}

        .hfq-component-title .el-button{padding: 0;}
    }

</style>
