export default abstract class ChromeResponse {
    type: string;

    static FAILED = 'failed'
    static SUCCESS = 'success'

    success: boolean
    status: string

    protected constructor(type: string, status: string) {
        this.type = type
        this.status = status
        this.success = status === ChromeResponse.SUCCESS
    }
}
