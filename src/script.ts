import DownloadMessage from "./Messages/DownloadMessage";
import ChromeMessage from "./Messages/ChromeMessage";
import UpdateEdgesMessage from "./Messages/UpdateEdgesMessage";

const ADDITIONAL_DATA_EVENT: string = '__additionalData'
const SCRIPT: string = `document.dispatchEvent(new CustomEvent('${ADDITIONAL_DATA_EVENT}', {detail: window.__additionalData}))`

const IMAGE_CLASS: string = '_9AhH0'
const VIDEO_CLASS: string = 'fXIG0'

let edges: Array<any> = [];

const targetElement = () => {
    changeCursor('pointer')
    document.addEventListener('click', getTarget, false)
}

const getTarget = (e: any) => {
    changeCursor('auto')
    document.removeEventListener('click', getTarget, false)
    dispatchDownloadEvent(getUrlToDownload(e.target))
}

const getUrlToDownload = (element: any) => {
    switch (element.getAttribute('class')) {
        case IMAGE_CLASS:
            return element.parentElement.querySelector('img').getAttribute('src');
        case VIDEO_CLASS:
            return getVideoUrlBasedOnPosterName(element.parentElement.firstChild.querySelector('video').getAttribute('poster'))
    }
}

const getVideoUrlBasedOnPosterName = (posterName: string) => {
    return edges.filter((edge) => {
        return edge.node.__typename === 'GraphVideo' && edge.node.display_url.includes(posterName.split('?')[0])
    })[0].node.video_url
}

const changeCursor = (cursor: string) => {
    document.getElementsByTagName('html')[0].style.cursor = cursor
}

const dispatchDownloadEvent = (target: string) => {
    chrome.runtime.sendMessage(new DownloadMessage(target), listenForResponse)
}

const listenForResponse = (response: any) => {
    console.log(response)
}

const injectScript = () => {
    let script: HTMLScriptElement = document.createElement('script')
    script.setAttribute('type', 'text/javascript')
    script.textContent = SCRIPT
    document.getElementsByTagName('body')[0].appendChild(script);
}

const listenForAdditionalData = (e: any) => {
    updateEdges(e.detail.feed.data.user.edge_web_feed_timeline.edges)
    document.removeEventListener(ADDITIONAL_DATA_EVENT, listenForAdditionalData, false)
}

const listenForMessages = (message: ChromeMessage) => {
    switch (message.type) {
        case UpdateEdgesMessage.TYPE:
            updateEdges((message as UpdateEdgesMessage).edges)
            break;
    }
}

const updateEdges = (newEdges: Array<any>) => {
    edges = edges.concat(newEdges)
}

document.addEventListener(ADDITIONAL_DATA_EVENT, listenForAdditionalData, false)

document.addEventListener('keydown', (e) => (e.code === 'KeyD') ? targetElement() : null)

chrome.runtime.onMessage.addListener(listenForMessages)

injectScript()
