export function pickIf<T>(decider: boolean, trueCase: T, falseCase?: T): T | undefined {
    return decider ? trueCase : falseCase;
}
