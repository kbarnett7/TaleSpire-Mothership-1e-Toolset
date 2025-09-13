export class DbSet<T> {
    private collection: T[];

    constructor(collection: T[]) {
        this.collection = collection;
    }

    public toArray(): T[] {
        return [...this.collection];
    }

    public add(entity: T): void {
        this.collection.push(entity);
    }

    public update(existingEntity: T, updatedEntity: T): void {
        const index = this.collection.findIndex((entity) => entity === existingEntity);

        if (index === -1) return;

        this.collection[index] = updatedEntity;
    }

    public remove(entity: T): void {
        const index = this.collection.indexOf(entity);

        if (index !== -1) {
            this.collection.splice(index, 1);
        }
    }
}
