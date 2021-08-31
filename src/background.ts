import ChromeMessage from "./Messages/ChromeMessage";
import DownloadMessage from "./Messages/DownloadMessage";
import MessageSender = chrome.runtime.MessageSender;
import UpdateEdgesMessage from "./Messages/UpdateEdgesMessage";
import Tab = chrome.tabs.Tab;
import DownloadResponse from "./Responses/DownloadResponse";
import GetCurrentUrlMessage from "./Messages/GetCurrentUrlMessage";
import GetCurrentUrlResponse from "./Responses/GetCurrentUrlResponse";
import ChromeResponse from "./Responses/ChromeResponse";
import DefaultChromeResponse from "./Responses/DefaultChromeResponse";
import UrlChangeMessage from "./Messages/UrlChangeMessage";
import TabChangeInfo = chrome.tabs.TabChangeInfo;
import WebResponseCacheDetails = chrome.webRequest.WebResponseCacheDetails;

const GRAPHQL_LISTENER = '*://www.instagram.com/graphql/query/*'

const messageListener = (message: ChromeMessage, sender: MessageSender, callback: CallableFunction): void => {
    switch (message.type) {
        case DownloadMessage.TYPE:
            chrome.downloads.download({url: (message as DownloadMessage).url})
            callback(new DownloadResponse(ChromeResponse.SUCCESS))
            break
        case GetCurrentUrlMessage.TYPE:
            callback(new GetCurrentUrlResponse(ChromeResponse.SUCCESS, sender.url!))
            break
        default:
            callback(new DefaultChromeResponse(ChromeResponse.FAILED))
    }
}

const sendMessageToActiveTab = (message: ChromeMessage) => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs: Array<Tab>) => {
        chrome.tabs.sendMessage(tabs[0].id!, message)
    });
}

const requestListener = (e: WebResponseCacheDetails) => {
    chrome.webRequest.onCompleted.removeListener(requestListener)
    fetch(e.url)
        .then((response: Response) => {
            response.json()
                .then((content: any) => {
                    if (content.data.user!.edge_web_feed_timeline) {
                        console.log('edges loaded', content.data.user.edge_web_feed_timeline.edges)
                        sendMessageToActiveTab(new UpdateEdgesMessage(content.data.user.edge_web_feed_timeline.edges))
                    }
                })
            chrome.webRequest.onCompleted.addListener(requestListener, {urls: [GRAPHQL_LISTENER]})
        })
        .catch((error) => {
            chrome.webRequest.onCompleted.addListener(requestListener, {urls: [GRAPHQL_LISTENER]})
            console.log('error', error)
        })
}

const tabsListener = (id: number, infos: TabChangeInfo, tab: Tab) => {
    if (infos.status === 'complete' && tab.url!.includes('www.instagram.com')) {
        sendMessageToActiveTab(new UrlChangeMessage(tab.url!))
    }
}

chrome.runtime.onMessage.addListener(messageListener)

chrome.webRequest.onCompleted.addListener(requestListener, {urls: [GRAPHQL_LISTENER]})

chrome.tabs.onUpdated.addListener(tabsListener)
