import ChromeMessage from "./ChromeMessage";

export default class UpdateEdgesMessage extends ChromeMessage {
    static TYPE: string = 'update_edges'
    edges: Array<any>

    constructor(edges: Array<any>) {
        super(UpdateEdgesMessage.TYPE)
        this.edges = edges
    }
}
