import ChromeMessage from "./ChromeMessage";

export default class UrlChangeMessage extends ChromeMessage {
    static TYPE: string = 'url_change'

    url: string

    constructor(url: string) {
        super(UrlChangeMessage.TYPE)
        this.url = url
    }
}
