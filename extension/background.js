var videoWebsiteList = {
  "youtube": /youtube.com\/watch\?v=/
};

function isVideoWebsiteUrl(url){
  var currentWebsite;
  $.each(videoWebsiteList, function(key, pattern) {
    if (pattern.test(url)){
      currentWebsite = key;
    }
  });

  return currentWebsite; 
}

function checkForValidUrl(tabId, changeInfo, tab) {
  if (isVideoWebsiteUrl(tab.url)){
    chrome.pageAction.show(tabId);

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: "test", data: friends_list}, function(response) {
        console.log(response.farewell);
      });
    });
  };
};

chrome.tabs.onUpdated.addListener(checkForValidUrl);

