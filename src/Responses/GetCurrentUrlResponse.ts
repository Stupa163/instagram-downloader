import ChromeResponse from "./ChromeResponse";
import GetCurrentUrlMessage from "../Messages/GetCurrentUrlMessage";

export default class GetCurrentUrlResponse extends ChromeResponse {
    static TYPE: string = 'get_url'

    url: string;

    constructor(status: string, url: string) {
        super(GetCurrentUrlMessage.TYPE, status)
        this.url = url
    }
}
