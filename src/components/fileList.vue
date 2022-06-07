<template>
  <div id="fileList">
    <template v-if="fileList.length != 0 && !loading">
      <div class="fileWarp">
        <div class="fileItem" v-for="file in fileList" :key="file.file_cd" @click="openOverlay(file)">
          <template v-if="file.file_ext === '.jpg' || file.file_ext === '.png'">
            <!-- {{file.file_url}} -->
            <img :src="file.file_url" alt="">
            <!-- <div>
              <icon-pic theme="outline" size="20" :strokeWidth="3"/>
            </div>
            <div>
              <span class="fileTitle">{{file.file_titl}}</span>{{file.file_ext}}
            </div> -->
          </template>

          <template v-if="file.file_ext === '.pdf'">
            <div>
              <icon-file-pdf theme="outline" size="20" :strokeWidth="3"/>

            </div>
            <div style="display: flex; align-items: center; justify-content: center;">
              <p class="fileTitle">{{file.file_titl}}</p>
              <p>{{file.file_ext}}</p>
            </div>
          </template>
        </div>

      </div>

      <van-overlay :show="show" class="overlay">
        <div class="closeBtn" @click="show = false">
          <icon-close theme="outline" size="28" fill="#fff" :strokeWidth="3"/>
        </div>
        <!-- <img v-if="currentFile.file_ext === '.jpg' || currentFile.file_ext === '.png'" class="imgContent" :src="currentFile.file_url"> -->
        <!-- <pdf v-if="currentFile.file_ext === '.pdf'" class="pdfContent" :src="currentFile.file_url" /> -->
        <div v-if="currentFile.pdf_pages" class="pdfContent">
          <pdf      
            ref="pdf"
            v-for="i in currentFile.pdf_pages" 
            :key="i"  
            :src="currentFile.file_url" 
            :page="i">
          </pdf>
        </div>

      </van-overlay>
    </template>

    <div v-else>暂无附件</div>
  </div>
</template>

<script>
import { Overlay, ImagePreview } from 'vant';
import { checkTokenBeforeRequest } from "@/util/auth.js";
import pdf from 'vue-pdf';

export default {
  name: "fileList",
  props: {
    fileList: {
      type: Array,
      default: []
    }
  },
  components: {
    [Overlay.name]: Overlay,
    pdf
  },
  data() {
    return {
      show: false,
      loading: true,
      currentFile: {
        file_url: undefined,
        file_ext: undefined,
        pdf_pages: undefined
      }
    }
  },
  methods: {
    async fileListAddUrl() {
      this.fileList.forEach(item => {
        item["file_url"] = this.getfileUrl(item);
      })
    },

    getfileUrl(file) {
      
      return `${process.env.VUE_APP_API}gateway/only.do?action=previewFile&file_cd=${file.file_cd}&token=${checkTokenBeforeRequest()}&redirect=no`;
    },

    openOverlay(file) {
      this.currentFile.file_url = this.getfileUrl(file);
      this.currentFile.file_ext = file.file_ext;
      debugger
      if (this.currentFile.file_ext === ".pdf") {
        
        this.show = true;
        let loadingTask = pdf.createLoadingTask(this.currentFile.file_url)
        loadingTask.promise.then(pdf => {
          this.currentFile.pdf_pages = pdf.numPages
        }).catch((err) => {
          console.error('pdf加载失败')
        });
      }else if (this.currentFile.file_ext === '.jpg' || this.currentFile.file_ext === '.png') {
        ImagePreview([this.currentFile.file_url]);
      }
        
    },

  },
  async mounted() {
    await this.fileListAddUrl();
    this.loading = false;
  },
  watch: {}
}
</script>
<style lang="scss" scoped>
#fileList{
  width: 100%;
}

.fileWarp{
  display: grid;
  grid-template-columns: repeat(3, 33%);
  justify-items: center;
  align-items: center;
  justify-content: space-around;
}

.fileItem{
  width: 80px;
  height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  img{
    width: 80px;
    height: 80px;
    object-fit: contain;
  }
  .fileTitle{
    max-width: 40px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  p {
    margin: 0px;
  }
}

.overlay {
  // position: relative;
  .closeBtn {
    position: absolute;
    top: 5px;
    right: 5px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    z-index: 10;
    padding: 5px;
    background-color: #00000066;
    border-radius: 50%;
  }
  .pdfContent {
    width: calc(100% - 10px);
    height: calc(100% - 50px - 20px);
    overflow-y: auto;
    padding: 10px 5px;
  }
  .imgContent {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}
</style>