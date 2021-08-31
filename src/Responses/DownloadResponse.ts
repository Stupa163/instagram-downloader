import ChromeResponse from "./ChromeResponse";

export default class DownloadResponse extends ChromeResponse {
    static TYPE: string = 'download'

    constructor(status: string) {
        super(DownloadResponse.TYPE, status)
    }
}
