var videoWebsiteList = {
  "youtube": /youtube.com\/watch\?v=/
};

function isVideoWebsiteUrl(url){
  var currentWebsite = null;
  $.each(videoWebsiteList, function(key, pattern) {
    if (pattern.test(url)){
      currentWebsite = key;
    }
  });

  return currentWebsite; 
}


function checkForValidUrl(tabId, changeInfo, tab) {
  var currentSite = isVideoWebsiteUrl(tab.url);
  if (currentSite){
    chrome.pageAction.show(tabId);

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {url: tabs[0].url, currentSite: currentSite}, function(response) {
        console.log(response.farewell);
      });
    });
  };
};

chrome.tabs.onUpdated.addListener(checkForValidUrl);

