((window) => {
  try {
    //-----------配置区-------------
    //输入框clyricResult选择符
    const inputSelector = 'textarea';
    //发送按钮clyricResult选择符
    const sendSelector = '.bl-button.live-skin-highlight-button-bg.live-skin-button-text.bl-button--primary.bl-button--small';
    //字数限制提示选择符
    const limiterSelector = '.input-limit-hint.p-absolute';

    const biliTextArea = window.document.querySelector(inputSelector);
    if(!biliTextArea){
      window.alert('gachi helper: 发生错误, 错误码001, 如果您能联系qq1789551634报告这个错误码, 作者将给第一个报告这个错误码的人一个小红包~');
      return;
    }
    const biliTextSender = window.document.querySelector(sendSelector);
    if(!biliTextSender){
      window.alert('gachi helper: 发生错误, 错误码002, 如果您能联系qq1789551634报告这个错误码, 作者将给第一个报告这个错误码的人一个小红包~');
      return;
    }
    const biliLimit = Number(window.document.querySelector(limiterSelector).innerHTML.split('/')[1]);
    if (isNaN(biliLimit)) {
      window.alert('gachi helper: 发生错误, 错误码003, 如果您能联系qq1789551634报告这个错误码, 作者将给第一个报告这个错误码的人一个小红包~');
      return;
    }
    console.log(`字数限制: ${biliLimit}`);

    //----------正式代码------------
    /**
     * 歌词分片函数
     * @param {string} lyric 歌词原文本
     * @returns {string []}
     */
    const lyricDealler = (lyric) => {
      let tempLyricResult = [];
      //中/英文为主判断
      let c = 0,
        e = 0;
      const len = lyric.length;
      for (let i = 0; i < len; i++) {
        if (/([a-z]|[A-Z])/.test(lyric[i])) {
          e++;
        } else {
          c++;
        }
      }
      if (e > c) { //英文为主文本
        lyric = lyric.replace(/　/g, ' ');
        lyric = lyric.replace(/。/g, ' ');
        lyric = lyric.replace(/；/g, ' ');
        lyric = lyric.replace(/，/g, ' ');
        lyric = lyric.replace(/,/g, ' ');
        lyric = lyric.replace(/\./g, '\n');
        lyric = lyric.replace(/ {2,}/g, ' '); //当连续出现两个或两个以上空格变成一个空格
        lyric = lyric.replace(/\n{2,}/g, '\n');

        tempLyricResult = lyric.split('\n');

        switch(lyricTypeSelector.value){
          case '双语混合取上': {
            tempLyricResult = tempLyricResult.filter((item, index)=>{
              return index % 2 === 0;
            });
            break;
          }
          case '双语混合取下': {
            tempLyricResult = tempLyricResult.filter((item, index) => {
              return index % 2 !== 0;
            });
            break;
          }
          default: {}
        }

        for (let i = 0; i < tempLyricResult.length; i++) {
          if (tempLyricResult[i].length > biliLimit) {
            let temp = tempLyricResult[i].split(' ');
            let res = [temp[0]];
            let currlen = temp[0].length;
            let currindex = 0;
            for (let i = 1; i < temp.length; i++) {
              let nextlen = currlen + temp[i].length + 1;
              if (nextlen <= biliLimit) {
                res[currindex] += (' ' + temp[i]);
                currlen = nextlen;
              } else {
                res[++currindex] = temp[i];
                currlen = temp[i].length;
              }
            }
            tempLyricResult.splice(i, 1, ...res);
            i += res.length - 1;
          }
        }
      } else { //非英文为主文本
        lyric = lyric.replace(/　/g, ' ');
        lyric = lyric.replace(/。/g, ' ');
        lyric = lyric.replace(/；/g, ' ');
        lyric = lyric.replace(/，/g, ' ');
        lyric = lyric.replace(/,/g, ' ');
        lyric = lyric.replace(/\./g, ' ');
        lyric = lyric.replace(/ {2,}/g, ' '); //当连续出现两个或两个以上空格变成一个空格
        lyric = lyric.replace(/\n{2,}/g, '\n');

        tempLyricResult = lyric.split('\n');

        switch(lyricTypeSelector.value){
          case '双语混合取上': {
            tempLyricResult = tempLyricResult.filter((item, index)=>{
              return index % 2 === 0;
            });
            break;
          }
          case '双语混合取下': {
            tempLyricResult = tempLyricResult.filter((item, index) => {
              return index % 2 !== 0;
            });
            break;
          }
          default: {}
        }

        for (let i = 0; i < tempLyricResult.length; i++) {
          if (tempLyricResult[i].length > biliLimit) {
            let temp;
            if (tempLyricResult[i].includes(' ')) {
              temp = tempLyricResult[i].split(' ');
              tempLyricResult.splice(i, 1, ...temp);
              i--;
            } else {
              temp = [];
              for (let j = 0; j < tempLyricResult[i].length; j += biliLimit) {
                temp.push(tempLyricResult[i].slice(j, j + biliLimit));
              }
              tempLyricResult.splice(i, 1, ...temp);
              i += temp.length - 1;
            }
          }
        }
      }
      return tempLyricResult;
    }
    let lyricResult = [];
    let currIndex = 0;
    const inputEvent = document.createEvent("Event");
    inputEvent.initEvent("input");
    const next = function () {
      currIndex < lyricResult.length && (biliTextArea.value = lyricResult[currIndex++], biliTextArea.dispatchEvent(inputEvent))
    }
    const pre = function () {
      currIndex > 0 && (biliTextArea.value = lyricResult[--currIndex], biliTextArea.dispatchEvent(inputEvent))
    }
    const clear = function () {
      biliTextArea.value = '';
      biliTextArea.dispatchEvent(inputEvent);
    }
    const fill = function(){
      biliTextArea.value = lyricResult[currIndex];
      biliTextArea.dispatchEvent(inputEvent);
    }
    const init = function(){
      currIndex = 0;
      biliTextArea.value = lyricResult[currIndex++];
      biliTextArea.dispatchEvent(inputEvent);
    }
    const inputHandler = function (e) {
      if (e.key === 'Enter') {
        next();
      }
      if (e.key === 'ArrowUp') {
        pre();
      }
      if (e.key === 'ArrowDown') {
        next();
      }
      if((navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) && e.key === 'ArrowLeft'){
        clear();
      }
      if((navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) && e.key === 'ArrowRight'){
        fill();
      }
    };

    biliTextSender.addEventListener('click', next);
    biliTextArea.addEventListener('keydown', inputHandler);
    // ------------------GUI设计开始---------------

    // 总容器
    const contaienr = window.document.createElement('div');
    with(contaienr.style) {
      width = '400px';
      position = 'fixed';
      bottom = '5px';
      left = '5px';
      zIndex = '999';
      boxSizing = 'border-box';
    }
    // 关闭按钮等的工具条
    const topTool = window.document.createElement('div');
    topTool.innerText = 'gachi helper';
    with(topTool.style) {
      textAlign = 'center';
      lineHeight = '20px';
      height = '20px';
      width = '100%';
      color = 'rgb(210,143,166)';
      fontSize = '14px';
    }
    // 小化按钮
    const collapseButton = window.document.createElement('button');
    collapseButton.innerText = '收起';
    with(collapseButton.style) {
      float = 'right';
      width = '40px';
      height = '20px';
      border = 'none';
      cursor = 'pointer';
      backgroundColor = '#1890ff';
      borderRadius = '0';
      color = '#ffffff';
    }
    // 主窗口
    const mainWindow = window.document.createElement('div');
    with(mainWindow.style) {
      width = '100%';
      backgroundColor = 'rgba(220, 192, 221, .5)';
      padding = '10px';
      boxSizing = 'border-box';
    }
    // 歌词框
    const textArea = window.document.createElement('textarea');
    textArea.placeholder = '请在此处粘贴歌词，并尽可能保留原格式，需注意双语混合模式歌词请删去歌名、作者等信息，直接从歌词正文开始'
    with(textArea.style) {
      boxSizing = 'border-box';
      width = '100%';
      height = '100px';
      resize = 'none';
      outline = 'none';
      background = 'rgba(255,255,255,.5)';
    }
    // 按钮区容器
    const buttonArea = window.document.createElement('div');
    with(buttonArea.style){
      width = '100%';
      boxSizing = 'border-box';
      height = '30px';
      display = 'flex';
    }
    // 歌词类型选择列提示文本
    const buttonLabel = window.document.createElement('div');
    buttonLabel.innerText = '请选择歌词类型: '
    with(buttonLabel.style){
      width = 'max-content';
      height = '28px';
      lineHeight = '28px';
    }
    // 歌词模式选择
    const lyricTypeSelector = window.document.createElement('select');
    lyricTypeSelector.options.add(new Option('单语种', '单语种', true, true));
    lyricTypeSelector.options.add(new Option('双语混合取上', '双语混合取上', false, false));
    lyricTypeSelector.options.add(new Option('双语混合取下', '双语混合取下', false, false));
    with(lyricTypeSelector.style){
      width = 'max-content';
      padding = '0 5px';
      height = '28px';
      marginLeft = '5px';
    }

    // 更新歌词按钮
    const lyricUpdateButton = window.document.createElement('button');
    lyricUpdateButton.innerText = '解析歌词';
    with(lyricUpdateButton.style){
      width = 'max-content';
      height = '28px';
      padding = '0 5px';
      marginLeft = '5px';
    }

    // 查看分片结果按钮
    const resultShowButton = window.document.createElement('button');
    resultShowButton.innerText = '查看分片结果';
    with(resultShowButton.style){
      display = 'none';
      width = 'max-content';
      padding = '0 5px';
      height = '28px';
      marginLeft = '5px';
    }
    // 结果反馈区域（歌词分片结果、其他动态提示等）
    const responesArea = window.document.createElement('div');
    with(responesArea.style) {
      display = 'none';
      boxSizing = 'border-box';
      width = '100%';
      minHeight = '50px';
      maxHeight = '200px';
      marginTop = '5px';
      overflow = 'auto';
      position = 'relative';
      backgroundColor = 'rgba(255,255,255,.5)';
    }

    // 组装
    topTool.appendChild(collapseButton);
    contaienr.appendChild(topTool);

    mainWindow.appendChild(textArea);

    buttonArea.appendChild(buttonLabel);
    buttonArea.appendChild(lyricTypeSelector);
    buttonArea.appendChild(lyricUpdateButton);
    buttonArea.appendChild(resultShowButton);
    mainWindow.appendChild(buttonArea);

    mainWindow.appendChild(responesArea);

    contaienr.appendChild(mainWindow);
    window.document.body.appendChild(contaienr);

    // 显示逻辑控制
    collapseButton.addEventListener('click', () => {
      if (collapseButton.innerText === '收起') {
        mainWindow.style.display = 'none';
        collapseButton.innerText = '展开';
        return;
      }
      if (collapseButton.innerText === '展开') {
        mainWindow.style.display = 'block';
        collapseButton.innerText = '收起';
        return;
      }
    }, false);

    resultShowButton.addEventListener('click', ()=>{
      if(resultShowButton.innerText === '查看分片结果'){
        resultShowButton.innerText = '关闭分片结果';
        responesArea.style.display = 'block';
        return;
      }
      if(resultShowButton.innerText === '关闭分片结果'){
        resultShowButton.innerText = '查看分片结果';
        responesArea.style.display = 'none';
        return;
      }
    }, false);

    const refershResponseArea = ()=>{
      let tempString = '';
      for(let i = 0; i < lyricResult.length; i++){
        tempString += `${i + 1}: ${lyricResult[i]}\n`;
      }
      responesArea.innerText = tempString;
    }

    //-------------------gui设计结束------------------
    lyricUpdateButton.addEventListener('click', () => {
      const value = textArea.value;
      if (value === '') {
        window.alert('gachi helper: 您还没有输入歌词');
        return;
      }
      if (lyricResult.length !== 0 && !window.confirm('gachi helper: 此操作将清除之前的歌词记录，是否继续')) {
        return;
      }
      lyricResult = lyricDealler(value);
      refershResponseArea();
      resultShowButton.style.display = 'block';
      init();
    }, false);
  } catch (e) {
    window.alert('gachi helper: 发生未知错误，如果您能截图下面内容并联系qq1789551634, 作者将给第一个报告这个问题的人一个小红包~\n' + e);
  }
})(window);
console.log('gachi helper: 作者: 五更耗纸，联系方式: qq1789551634，欢迎提出意见与建议~')