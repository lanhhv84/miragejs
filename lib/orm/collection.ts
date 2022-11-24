import assert from "@lib/assert";

/** Represents the type of instantiated Mirage model.  */
export type ModelInstance<Data extends {} = {}> = Data & {
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
export default class Collection<
  T extends {},
  ElementType extends ModelInstance<T> = ModelInstance<T>
> {
  /**
   The dasherized model name this Collection represents.

   ```js
   let posts = user.blogPosts;

   posts.modelName; // "blog-post"
   ```

   The model name is separate from the actual models, since Collections can be empty.

   @property modelName
   @type {String}
   @public
   */
  readonly modelName: string;

  /**
   The underlying plain JavaScript array of Models in this Collection.

   ```js
   posts.models // [ post:1, post:2, ... ]
   ```

   While Collections have many array-ish methods like `filter` and `sort`, it
   can be useful to work with the plain array if you want to work with methods
   like `map`, or use the `[]` accessor.

   For example, in testing you might want to assert against a model from the
   collection:

   ```js
   let newPost = user.posts.models[0].title;

   assert.equal(newPost, "My first post");
   ```

   @property models
   @type {Array}
   @public
   */
  models: ElementType[];

  constructor(modelName: string, models?: ElementType[]) {
    assert(
      modelName && typeof modelName === "string",
      "You must pass a `modelName` into a Collection"
    );
    this.modelName = modelName;
    this.models = models ?? [];
  }

  /**
   The number of models in the collection.

   ```js
   user.posts.length; // 2
   ```

   @property length
   @type {Integer}
   @public
   */
  get length() {
    return this.models.length;
  }

  update<K extends keyof T>(key: K & string, val: T[K]) {
    this.models.forEach((model) => model.update(key, val));
    return this;
  }

  /**
   Saves all models in the collection.

   ```js
   let posts = user.blogPosts;

   posts.models[0].published = true;

   posts.save(); // all posts saved to db
   ```

   @method save
   @return this
   @public
   */
  save() {
    this.models.forEach((model) => model.save());

    return this;
  }

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
  reload() {
    this.models.forEach((model) => model.reload());

    return this;
  }

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
  destroy() {
    this.models.forEach((model) => model.destroy());

    return this;
  }

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
  add(model: ElementType) {
    this.models.push(model);

    return this;
  }

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
  remove(model: T) {
    const match = this.models.find((m) => m.toString() === model.toString());
    if (match) {
      const i = this.models.indexOf(match);
      this.models.splice(i, 1);
    }

    return this;
  }

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
  includes(model: T) {
    return this.models.some((m) => m.toString() === model.toString());
  }

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
  filter(f: (value: T, index: number, models: T[]) => unknown) {
    const filteredModels = this.models.filter(f);

    return new Collection<T, ElementType>(this.modelName, filteredModels);
  }

  /**
   Returns a new Collection with its models sorted according to the provided [compare function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#Parameters).

   ```js
   let postsByTitleAsc = user.posts.sort((a, b) => a.title > b.title ? 1 : -1 );
   ```

   @method sort
   @param {Function} f
   @return {Collection}
   @public
   */
  sort(f: (a: T, b: T) => number) {
    const sortedModels = this.models.concat().sort(f);

    return new Collection<T, ElementType>(this.modelName, sortedModels);
  }

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
  slice(begin: number, end?: number) {
    const slicedModels = this.models.slice(begin, end);

    return new Collection<T, ElementType>(this.modelName, slicedModels);
  }

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
  mergeCollection(collection: Collection<T, ElementType>) {
    this.models = this.models.concat(collection.models);

    return this;
  }

  /**
   Simple string representation of the collection and id.

   ```js
   user.posts.toString(); // collection:post(post:1,post:4)
   ```

   @method toString
   @return {String}
   @public
   */
  toString() {
    return `collection:${this.modelName}(${this.models
      .map((m) => m.id)
      .join(",")})`;
  }
}
