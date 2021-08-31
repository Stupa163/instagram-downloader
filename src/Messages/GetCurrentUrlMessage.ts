import ChromeMessage from "./ChromeMessage";

export default class GetCurrentUrlMessage extends ChromeMessage {
    static TYPE: string = 'get_url'

    constructor() {
        super(GetCurrentUrlMessage.TYPE)
    }
}
