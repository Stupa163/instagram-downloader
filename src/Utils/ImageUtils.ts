export function getImageUrl(target: HTMLElement): string {
    return target.parentElement!.querySelector('img')!.getAttribute('src')!
}
