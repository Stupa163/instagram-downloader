export default class ChromeResponse {
    static FAILED = 'failed'
    static SUCCESS = 'success'

    success: boolean
    status: string

    constructor(status: string) {
        this.status = status
        this.success = status === ChromeResponse.SUCCESS
    }
}
