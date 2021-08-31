import ChromeResponse from "./ChromeResponse";

export default class DefaultChromeResponse extends ChromeResponse {
    static TYPE: string = 'default'

    constructor(status: string) {
        super(DefaultChromeResponse.TYPE, status)
    }
}
