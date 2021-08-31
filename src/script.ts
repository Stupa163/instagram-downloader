import AbstractContext from "./Contexts/AbstractContext";
import ChromeMessage from "./Messages/ChromeMessage";
import UrlChangeMessage from "./Messages/UrlChangeMessage";
import FeedContext from "./Contexts/FeedContext";
import ProfileContext from "./Contexts/ProfileContext";

let context: AbstractContext;

const targetElement = (): void => {
    changeCursor('pointer')
    document.addEventListener('click', getTarget, false)
}

const getTarget = (e: MouseEvent): void => {
    changeCursor('auto')
    document.removeEventListener('click', getTarget, false)

    try {
        context.handleTarget(<HTMLElement>e.target)
    } catch (e: unknown) {
        console.error(e)
    }
}

const changeCursor = (cursor: string): void => {
    document.getElementsByTagName('html')[0].style.cursor = cursor
}

const listenForMessages = (message: ChromeMessage) => {
    switch (message.type) {
        case UrlChangeMessage.TYPE:
            try {
                context = determineContext((message as UrlChangeMessage).url)
            } catch (e: unknown) {
                console.error(e)
            }
    }
}

const determineContext = (url: string): AbstractContext => {
    if (url === AbstractContext.FEED_CONTEXT_URL) {
        return new FeedContext()
    }

    if (url.includes(AbstractContext.STORIES_CONTEXT_URL)) {
        //TODO: Implement stories context
    }

    if (url.includes(AbstractContext.PROFILE_CONTEXT_URL)) {
        return new ProfileContext()
    }

    throw new Error(`Unable to determine context for given url : ${url}`)
}

document.addEventListener('keydown', (e: KeyboardEvent) => (e.code === 'KeyD') ? targetElement() : null)

chrome.runtime.onMessage.addListener(listenForMessages)
