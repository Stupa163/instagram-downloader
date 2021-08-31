import EdgeInterface from "../Interfaces/EdgeInterface";

export function getVideoUrlBasedOnPosterName(posterName: string, edges: Array<EdgeInterface>): string {
    let edge: EdgeInterface = edges.filter((edge: EdgeInterface) => {
        return edge.node.__typename === 'GraphVideo' && edge.node.display_url.includes(posterName.split('?')[0])
    })[0]
    if (edge !== undefined) {
        return edge.node.video_url
    } else {
        throw new Error('Unable to locate video node')
    }
}

export function getPosterUrl(target: HTMLElement): string {
    return (target.parentElement!.firstChild! as HTMLElement).querySelector('video')!.getAttribute('poster')!
}
