//----------------用户配置区----------------
//同传文本
let text = `待机`;
//设置发言字数限制
let maxword = 30;

//是否需要文本分割的全局预览？需要请将下面这行代码的false改成true，否则将true改成false

let printResult = true;

//---------------代码区-----------------
//---------接下来的您不需要关心----------
//-----------配置区-------------
//输入框css选择符
let inputSelector = 'textarea';
//发送按钮css选择符
let sendSelector = '.bl-button.live-skin-highlight-button-bg.live-skin-button-text.bl-button--primary.bl-button--small';
//----------正式代码------------
console.log('正在处理...');
let ss = [];
//中/英文为主判断
let c = 0,
  e = 0;
const len = text.length;
for (let i = 0; i < len; i++) {
  if (/([a-z]|[A-Z])/.test(text[i])) {
    e++;
  } else {
    c++;
  }
}
if (e > c) { //英文为主文本
  text = text.replace(/　/g, ' ');
  text = text.replace(/。/g, ' ');
  text = text.replace(/；/g, ' ');
  text = text.replace(/，/g, ' ');
  text = text.replace(/,/g, ' ');
  text = text.replace(/\./g, '\n');
  text = text.replace(/ {2,}/g, ' ');//当连续出现两个或两个以上空格变成一个空格
  text = text.replace(/\n{2,}/g, '\n');

  ss = text.split('\n');

  for (let i = 0; i < ss.length; i++) {
    if (ss[i].length > maxword) {
      let temp = ss[i].split(' ');
      let res = [temp[0]];
      let currlen = temp[0].length;
      let currindex = 0;
      for(let i = 1; i < temp.length; i++){
        let nextlen = currlen + temp[i].length + 1;
        if(nextlen <= maxword){
          res[currindex] += (' ' + temp[i]);
          currlen = nextlen;
        }else{
          res[++currindex] = temp[i];
          currlen = temp[i].length;
        }
      }
      ss.splice(i, 1, ...res);
      i += res.length - 1;
    }
  }
} else { //非英文为主文本
  text = text.replace(/　/g, ' ');
  text = text.replace(/。/g, ' ');
  text = text.replace(/；/g, ' ');
  text = text.replace(/，/g, ' ');
  text = text.replace(/,/g, ' ');
  text = text.replace(/\./g, ' ');
  text = text.replace(/ {2,}/g, ' ');//当连续出现两个或两个以上空格变成一个空格
  text = text.replace(/\n{2,}/g, '\n');

  ss = text.split('\n');

  for (let i = 0; i < ss.length; i++) {
    if (ss[i].length > maxword) {
      let temp;
      if(ss[i].includes(' ')){
        temp = ss[i].split(' ');
        ss.splice(i, 1, ...temp);
        i--;
      }else{
        temp = [];
        for (let j = 0; j < ss[i].length; j += maxword) {
          temp.push(ss[i].slice(j, j + maxword));
        }
        ss.splice(i, 1, ...temp);
        i += temp.length - 1;
      }
    }
  }
}


let currindex = 0;
const _input = document.querySelector(inputSelector);
const btn = document.querySelector(sendSelector);
const inputEvent = document.createEvent('Event');

inputEvent.initEvent('input', true, true);

let next = function(){
  if(currindex < ss.length){
    _input.value = ss[currindex++];
    _input.dispatchEvent(inputEvent);
  }
}
let pre = function(){
  if(currindex > 0){
    _input.value = ss[--currindex];
    _input.dispatchEvent(inputEvent);
  }
}
let inputHandler = function(e){
  //enter 13 shang 38 xia 40
  if(e.keyCode === 13){//enter
    next();
  }else if(e.keyCode === 38){//方向键上
    pre();
  }else if(e.keyCode === 40){//方向键下
    next();
  }
}
next();
btn.addEventListener('click', next);
_input.addEventListener('keydown', inputHandler);
console.log('处理结束，您可以关闭开发者工具（点×或者按f12）开始同传了');
console.log('您可以在同传过程中将鼠标点进输入框然后按上下键进行滚动选择');

if(printResult){
  console.log('以下是文本分割的全局预览：');
  console.log(ss);
  console.log('您不想看到这个信息？那么请修改代码最开始的配置区里的printResult变量');
}