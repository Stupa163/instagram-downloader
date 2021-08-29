export default abstract class ChromeMessage {
    type: string;

    protected constructor(type: string) {
        this.type = type
    }
}
