import DownloadMessage from "./Messages/DownloadMessage";
import ChromeMessage from "./Messages/ChromeMessage";
import UpdateEdgesMessage from "./Messages/UpdateEdgesMessage";
import EdgeInterface from "./Interfaces/EdgeInterface";
import ChromeResponse from "./Responses/ChromeResponse";

const ADDITIONAL_DATA_EVENT: string = '__additionalData'
const SCRIPT: string = `document.dispatchEvent(new CustomEvent('${ADDITIONAL_DATA_EVENT}', {detail: window.__additionalData}))`

const IMAGE_CLASS: string = '_9AhH0'
const VIDEO_CLASS: string = 'fXIG0'

let edges: Array<EdgeInterface> = [];

const targetElement = (): void => {
    changeCursor('pointer')
    document.addEventListener('click', getTarget, false)
}

const getTarget = (e: MouseEvent): void => {
    changeCursor('auto')
    document.removeEventListener('click', getTarget, false)
    try {
        dispatchDownloadEvent(getUrlToDownload((e.target as HTMLElement)))
    } catch (e: unknown) {
        console.error(e)
        alert('An error has occurred')
    }
}

const changeCursor = (cursor: string): void => {
    document.getElementsByTagName('html')[0].style.cursor = cursor
}

const getUrlToDownload = (element: HTMLElement): string => {
    switch (element.getAttribute('class')) {
        case IMAGE_CLASS:
            return element.parentElement!.querySelector('img')!.getAttribute('src')!;
        case VIDEO_CLASS:
            return getVideoUrlBasedOnPosterName((element.parentElement!.firstChild! as HTMLElement).querySelector('video')!.getAttribute('poster')!)
        default:
            throw new Error(`Unknown element class : ${element.getAttribute('class')}`)
    }
}

const getVideoUrlBasedOnPosterName = (posterName: string): string => {
    let edge: EdgeInterface = edges.filter((edge: EdgeInterface) => {
        return edge.node.__typename === 'GraphVideo' && edge.node.display_url.includes(posterName.split('?')[0])
    })[0]
    if (edge !== undefined) {
        return edge.node.video_url
    } else {
        throw new Error('Unable to locate video node')
    }
}

const dispatchDownloadEvent = (target: string): void => {
    chrome.runtime.sendMessage(new DownloadMessage(target), listenForResponse)
}

const listenForResponse = (response: ChromeResponse) => {
    console.log('response received from background : ', response)
}

const injectScript = (scriptContent: string): void => {
    let script: HTMLScriptElement = document.createElement('script')
    script.setAttribute('type', 'text/javascript')
    script.textContent = scriptContent
    document.getElementsByTagName('body')[0].appendChild(script);
}

const listenForAdditionalData = (e: Event): void => {
    if ((e as CustomEvent).detail.feed) {
        updateEdges((e as CustomEvent).detail.feed.data.user.edge_web_feed_timeline.edges)
    }
    document.removeEventListener(ADDITIONAL_DATA_EVENT, listenForAdditionalData)
}

const listenForMessages = (message: ChromeMessage): void => {
    switch (message.type) {
        case UpdateEdgesMessage.TYPE:
            updateEdges((message as UpdateEdgesMessage).edges)
            break;
    }
}

const updateEdges = (newEdges: Array<EdgeInterface>): void => {
    edges = edges.concat(newEdges)
}

document.addEventListener(ADDITIONAL_DATA_EVENT, listenForAdditionalData)

document.addEventListener('keydown', (e: KeyboardEvent) => (e.code === 'KeyD') ? targetElement() : null)

chrome.runtime.onMessage.addListener(listenForMessages)

injectScript(SCRIPT)
