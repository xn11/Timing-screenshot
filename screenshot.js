// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

function setScreenshotUrl(url) {
  // document.getElementById('txt').text(url);
  document.getElementById('target').src = url;
  var filename = "map_" + formatDate(new Date()) + ".png";
  downloadFile2(filename, url);
}

// function downloadFile(fileName, content){
//     var aLink = document.createElement('a');
//     var blob = new Blob([content]);
//     var evt = document.createEvent("HTMLEvents");
//     evt.initEvent("click", false, false);//initEvent 不加后两个参数在FF下会报错, 感谢 Barret Lee 的反馈
//     aLink.download = fileName;
//     aLink.href = URL.createObjectURL(blob);
//     aLink.dispatchEvent(evt);
// }

function downloadFile2(fileName, url) {
  var self = this;
  var aLink = document.createElement('a');
  var evt = document.createEvent("HTMLEvents");
  evt.initEvent("click", false, false);
  aLink.download = fileName;
  aLink.href = url;
  aLink.dispatchEvent(evt);

  // console.log("finish load");

  setTimeout(function() {
    self.window.close();
  }, 5000);
  console.log("finish stop");
}

function formatDate(now) {
  var month = now.getMonth() + 1;
  var date = now.getDate();
  var hour = now.getHours();
  var minute = now.getMinutes();
  return month + "/" + date + "_" + hour + ":" + minute;
}
