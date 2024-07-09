export class DtoUtils {
    static getPropetyNames<T>(dto: T): string[] {
        return Object.keys(dto);
    }

    static getExistPropertyNames<T>(dto: T): (keyof T)[] {
        const keys = this.getPropetyNames(dto);
        return keys.filter((key) => dto[key] !== undefined && dto[key] !== null) as (keyof T)[];
    }
}
