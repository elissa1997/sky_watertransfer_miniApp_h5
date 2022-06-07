import {instance_api} from "@/network/axios.js";

export function filePreview(params) {
  return instance_api({
    url: 'gateway/only.do',
    method: 'get',
    params
  })
}

// FileReader异步封装为promise
async function reader(blob) {
  return new Promise(function(resolve, reject){
    let reader = new FileReader();
    reader.readAsArrayBuffer(blob);
    reader.onload = function(e) {
      let buffer = reader.result;
      // 将这四个字节的内容，视作一个32位整数
      let view = new DataView(buffer);
      let magic = view.getUint32(0, false);
      resolve(magic);
    }
    reader.onerror = function(error){
      reject(error);
    }
  });
}

export async function getFileType(fileId) {
  let raw = undefined;
  let fileType = undefined;
  let magic = undefined;
  if (fileId) {
    await filePreview({action: "previewFile", file_cd: fileId}).then(res => {
      raw = res;
    })
    if (raw) {
      let blob = new Blob([raw]);
      await reader(blob).then(res => {
        magic = res;
      })
    }

    switch(magic) {
      case 4022320623:
        fileType = "image";
        // (key === '1') ? that.fileType = "image" : that.replyFileType = "image"; 
        break;
        case 4022320464: 
        fileType = "image";
        // (key === '1') ? that.fileType = "image" : that.replyFileType = "image"; 
        break;
        case 626017350: 
        fileType = "pdf"; 
        // (key === '1') ? that.fileType = "pdf" : that.replyFileType = "pdf"; 
        break;
      }

    return fileType;
  }
}