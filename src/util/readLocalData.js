import axios from 'axios'

export async function localData(fileName) {
  let data = undefined;
  await axios.get('/dist/json/'+fileName+'.json').then(res => {     // 获取public下的test.json文件数据
    // console.log(res)
    data = res.data;
  })
  return data;
}

export function dictTrans(dict, key, value) {
  if (dict.length) {
    for (let index = 0; index < dict.length; index++) {
      const element = dict[index];
      if (element[key] === value) {
        return element
      }
    }
  }else{
    console.log("字典为空");
  }
}