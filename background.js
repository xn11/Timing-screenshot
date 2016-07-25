
var startDate;
var ONE_HOUR = 10 * 60 * 1000;

var interval = 60 * 1000;
var timer = null;
var id = 100;

var capturing = false;

chrome.browserAction.onClicked.addListener(() => {
  startDate = new Date();
  startCapture();
});

function startCapture() {
  capturing = true;
  capture_loop();
}

function stopCapture() {
  capturing = false;
}

function capture_loop() {
  if (capturing) {
    capture().then(() => {
      if (capturing) {
        setTimeout(() => {
          if (capturing) {
            capture_loop();
          }
        }, interval);
      }
    });
  }
}

function capture() {
  return new Promise((resolve, reject) => {
    console.log("Capturing");
    screenshot();
    resolve();
  // setTimeout(() => {
  //   console.log("Captured");
  //   resolve();
  // }, 2000);
  });
}

function screenshot() {
  // alert("min");
  var timeDiff = new Date().getTime() - startDate.getTime();
  if (timeDiff > ONE_HOUR) {
    stopCapture();
    alert("over");
    return;
  }

  chrome.tabs.captureVisibleTab(null, {
    format: "png"
  }, function(screenshotUrl) {
    // alert("capture");
    var viewTabUrl = chrome.extension.getURL('screenshot.html?id=' + id++)
    var targetId = null;

    var views = chrome.extension.getViews();
    var view = null;
    for (var i = 0; i < views.length; i++) {
      view = views[i];
      if (view.location.href == viewTabUrl) {
        view.setScreenshotUrl(screenshotUrl);
        break;
      }
    }

    chrome.tabs.onUpdated.addListener(function listener(tabId, changedProps) {
      if (tabId != targetId || changedProps.status != "complete")
        return;

      chrome.tabs.onUpdated.removeListener(listener);

      var views = chrome.extension.getViews();
      var view = null;
      for (var i = 0; i < views.length; i++) {
        view = views[i];
        if (view.location.href == viewTabUrl) {
          view.setScreenshotUrl(screenshotUrl);
          break;
        }
      }
    });

    chrome.tabs.create({
      url: viewTabUrl
    }, function(tab) {
      targetId = tab.id;
    });
  });
}
