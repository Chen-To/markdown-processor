export function isNumeric(str: string): boolean {
    if (isNaN(Number(str))) {
        return false;
    }
    return true;
}