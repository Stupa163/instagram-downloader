import ChromeMessage from "./Messages/ChromeMessage";
import DownloadMessage from "./Messages/DownloadMessage";
import MessageSender = chrome.runtime.MessageSender;
import ChromeResponse from "./Responses/ChromeResponse";
import UpdateEdgesMessage from "./Messages/UpdateEdgesMessage";
import Tab = chrome.tabs.Tab;

const GRAPHQL_LISTENER = '*://www.instagram.com/graphql/query/*'

const messageListener = (message: ChromeMessage, sender: MessageSender, callback: CallableFunction): void => {
    switch (message.type) {
        case DownloadMessage.TYPE:
            chrome.downloads.download({url: (message as DownloadMessage).url})
            callback(new ChromeResponse(ChromeResponse.SUCCESS))
            break
        default:
            callback(new ChromeResponse(ChromeResponse.FAILED))
    }
}

const requestListener = (e: any) => {
    chrome.webRequest.onCompleted.removeListener(requestListener)
    fetch(e.url)
        .then((response: Response) => {
            response.json()
                .then((content: any) => {
                    if (content.data.user.edge_web_feed_timeline) {
                        chrome.tabs.query({active: true, currentWindow: true}, (tabs: Array<Tab>) => {
                            chrome.tabs.sendMessage(tabs[0].id!, new UpdateEdgesMessage(content.data.user.edge_web_feed_timeline.edges))
                        });
                    }
                })
            chrome.webRequest.onCompleted.addListener(requestListener, {urls: [GRAPHQL_LISTENER]})
        })
        .catch((error) => {
            chrome.webRequest.onCompleted.addListener(requestListener, {urls: [GRAPHQL_LISTENER]})
            console.log('error', error)
        })
}

chrome.runtime.onMessage.addListener(messageListener)

chrome.webRequest.onCompleted.addListener(requestListener, {urls: [GRAPHQL_LISTENER]})
