import AbstractContext from "./AbstractContext";
import EdgeInterface from "../Interfaces/EdgeInterface";
import ChromeMessage from "../Messages/ChromeMessage";
import UpdateEdgesMessage from "../Messages/UpdateEdgesMessage";
import {getImageUrl} from "../Utils/ImageUtils";
import {getPosterUrl, getVideoUrlBasedOnPosterName} from "../Utils/VideoUtils";

export default class FeedContext extends AbstractContext {
    private edges: Array<EdgeInterface> = [];

    static ADDITIONAL_DATA_EVENT: string = '__additionalData'
    static SCRIPT: string = `document.dispatchEvent(new CustomEvent('${FeedContext.ADDITIONAL_DATA_EVENT}', {detail: window.__additionalData}))`
    static VIDEO_CLASS: string = 'fXIG0'

    public constructor() {
        super();
        document.addEventListener(FeedContext.ADDITIONAL_DATA_EVENT, this.listenForAdditionalData)
        chrome.runtime.onMessage.addListener(this.listenForMessages)
        this.injectScript(FeedContext.SCRIPT)
    }

    handleTarget(target: HTMLElement) {
        this.dispatchDownloadEvent(this.getUrlToDownload(target))
    }

    getUrlToDownload = (element: HTMLElement): string => {
        switch (element.getAttribute('class')) {
            case FeedContext.IMAGE_CLASS:
                return getImageUrl(element);
            case FeedContext.VIDEO_CLASS:
                return getVideoUrlBasedOnPosterName(getPosterUrl(element), this.edges)
            default:
                throw new Error(`Unknown element class : ${element.getAttribute('class')}`)
        }
    }

    listenForAdditionalData = (e: Event): void => {
        if ((e as CustomEvent).detail.feed) {
            this.updateEdges((e as CustomEvent).detail.feed.data.user.edge_web_feed_timeline.edges)
        }
        document.removeEventListener(FeedContext.ADDITIONAL_DATA_EVENT, this.listenForAdditionalData)
    }

    updateEdges = (newEdges: Array<EdgeInterface>): void => {
        console.log('edges received', newEdges)
        this.edges = this.edges.concat(newEdges)
    }

    listenForMessages = (message: ChromeMessage): void => {
        switch (message.type) {
            case UpdateEdgesMessage.TYPE:
                this.updateEdges((message as UpdateEdgesMessage).edges)
                break;
        }
    }

    injectScript = (scriptContent: string): void => {
        let script: HTMLScriptElement = document.createElement('script')
        script.setAttribute('type', 'text/javascript')
        script.textContent = scriptContent
        document.getElementsByTagName('body')[0].appendChild(script);
    }
}
