/** Represents the type of an instantiated Mirage model.  */
export declare type ModelInstance<Data extends {} = {}> = Data & {
    id?: string;
    attrs: Data;
    modelName: string;
    /** Persists any updates on this model back to the Mirage database. */
    save(): void;
    /** Updates and immediately persists a single or multiple attr(s) on this model. */
    update<K extends keyof Data>(key: K, value: Data[K]): void;
    update(changes: Partial<Data>): void;
    /** Removes this model from the Mirage database. */
    destroy(): void;
    /** Reloads this model's data from the Mirage database. */
    reload(): void;
    toString(): string;
};
/**
  Collections represent arrays of models. They are returned by a hasMany association, or by one of the ModelClass query methods:

  ```js
  let posts = user.blogPosts;
  let posts = schema.blogPosts.all();
  let posts = schema.blogPosts.find([1, 2, 4]);
  let posts = schema.blogPosts.where({ published: true });
  ```

  Note that there is also a `PolymorphicCollection` class that is identical to `Collection`, except it can contain a heterogeneous array of models. Thus, it has no `modelName` property. This lets serializers and other parts of the system interact with it differently.

  @class Collection
  @constructor
  @public
*/
export default class Collection<T extends {}> extends Array<ModelInstance<T>> {
    modelName: string;
    constructor(modelName: string | number, items: ModelInstance<T>[] | undefined);
    get models(): ModelInstance<T>[];
    set models(models: ModelInstance<T>[]);
    /**
        Adds a model to this collection.

        ```js
        posts.length; // 1

        posts.add(newPost);

        posts.length; // 2
        ```

        @method add
        @param {Model} model
        @return this
        @public
    */
    add(model: ModelInstance<T>): Collection<T>;
    /**
        Destroys the db record for all models in the collection.

        ```js
        let posts = user.blogPosts;

        posts.destroy(); // all posts removed from db
        ```

        @method destroy
        @return this
        @public
    */
    destroy(): Collection<T>;
    /**
        Returns a new Collection with its models filtered according to the provided [callback function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter).

        ```js
        let publishedPosts = user.posts.filter(post => post.isPublished);
        ```
        @method filter
        @param {Function} f
        @return {Collection}
        @public
    */
    filter(f: (value: ModelInstance<T>, index: number, models: ModelInstance<T>[]) => unknown): Collection<T>;
    concat(...items: ConcatArray<ModelInstance<T>>[]): Collection<T>;
    /**
        Checks if the Collection includes the given model.

        ```js
        posts.includes(newPost);
        ```

        Works by checking if the given model name and id exists in the Collection,
        making it a bit more flexible than strict object equality.

        ```js
        let post = server.create('post');
        let programming = server.create('tag', { text: 'Programming' });

        visit(`/posts/${post.id}`);
        click('.tag-selector');
        click('.tag:contains(Programming)');

        post.reload();
        assert.ok(post.tags.includes(programming));
        ```

        @method includes
        @return {Boolean}
        @public
    */
    includes(model: ModelInstance<T>): boolean;
    /**
        Modifies the Collection by merging the models from another collection.

        ```js
        user.posts.mergeCollection(newPosts);
        user.posts.save();
        ```

        @method mergeCollection
        @param {Collection} collection
        @return this
        @public
    */
    mergeCollection(collection: Collection<T>): Collection<T>;
    /**
        Reloads each model in the collection.

        ```js
        let posts = author.blogPosts;

        // ...

        posts.reload(); // reloads data for each post from the db
        ```

        @method reload
        @return this
        @public
    */
    reload(): Collection<T>;
    /**
        Removes a model from this collection.

        ```js
        posts.length; // 5

        let firstPost = posts.models[0];
        posts.remove(firstPost);
        posts.save();

        posts.length; // 4
        ```

        @method remove
        @param {Model} model
        @return this
        @public
    */
    remove(model: ModelInstance<T>): Collection<T>;
    /**
        Returns a new Collection with a subset of its models selected from `begin` to `end`.

        ```js
        let firstThreePosts = user.posts.slice(0, 3);
        ```

        @method slice
        @param {Integer} begin
        @param {Integer} end
        @return {Collection}
        @public
    */
    slice(begin: number, end: number): Collection<T>;
    /**
         Updates each model in the collection, and immediately persists all changes to the db.

        ```js
        let posts = user.blogPosts;

        posts.update('published', true); // the db was updated for all posts
        ```

        @method update
        @param key
        @param val
        @return this
    */
    update<K extends keyof T>(key: K & string, val: T[K]): Collection<T>;
    save(): Collection<T>;
    map<U>(callbackfn: (value: ModelInstance<T>, index: number, array: ModelInstance<T>[]) => U, thisArg?: any): U[];
    /**
         Simple string representation of the collection and id.

        ```js
        user.posts.toString(); // collection:post(post:1,post:4)
        ```

        @method toString
        @return {String}
        @public
    */
    toString(): string;
}
//# sourceMappingURL=collection.d.ts.map