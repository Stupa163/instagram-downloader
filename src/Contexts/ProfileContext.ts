import AbstractContext from "./AbstractContext";
import {getImageUrl} from "../Utils/ImageUtils";

export default class ProfileContext extends AbstractContext {
    static VIDEO_CLASS: string = 'tWeCl'

    public constructor() {
        super();
    }

    handleTarget(target: HTMLElement): void {
        this.dispatchDownloadEvent(this.getUrlToDownload(target))
    }

    getUrlToDownload = (element: HTMLElement): string => {
        switch (element.getAttribute('class')) {
            case ProfileContext.IMAGE_CLASS:
                return getImageUrl(element);
            case ProfileContext.VIDEO_CLASS:
                return element.getAttribute('src')!
            default:
                throw new Error(`Unknown element class : ${element.getAttribute('class')}`)
        }
    }
}
