export function addEventListeners(
    target: EventTarget,
    eventTypes: ReadonlyArray<string>,
    callback: (event: Event) => void | Promise<void>,
): void {
    eventTypes.forEach((eventType) => {
        target.addEventListener(eventType, callback);
    });
}
