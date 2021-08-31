import ChromeResponse from "../Responses/ChromeResponse";
import DownloadMessage from "../Messages/DownloadMessage";

export default abstract class AbstractContext {
    static IMAGE_CLASS: string = '_9AhH0'

    static FEED_CONTEXT_URL = 'https://www.instagram.com/'
    static STORIES_CONTEXT_URL = 'https://www.instagram.com/stories'
    static PROFILE_CONTEXT_URL = 'https://www.instagram.com/'

    abstract handleTarget(target: HTMLElement): void

    dispatchDownloadEvent = (target: string): void => {
        chrome.runtime.sendMessage(new DownloadMessage(target), this.listenForResponse)
    }

    listenForResponse = (response: ChromeResponse) => {
        console.log('response received from background : ', response)
    }
}
