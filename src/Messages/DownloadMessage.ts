import ChromeMessage from "./ChromeMessage";

export default class DownloadMessage extends ChromeMessage{
    static TYPE: string = 'download'
    url: string

    constructor(url: string) {
        super(DownloadMessage.TYPE)
        this.url = url
    }
}
