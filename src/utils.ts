export async function sleep(timeout: number) {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

export function clsx(...classNames: (string | boolean)[]) {
    return classNames.filter(Boolean).join(' ');
}