export default Serializer;
/**
  Serializers are responsible for formatting your route handler's response.

  The application serializer will apply to every response. To make specific customizations, define per-model serializers.

  ```js
  import { createServer, RestSerializer } from 'miragejs';

  createServer({
    serializers: {
      application: RestSerializer,
      user: RestSerializer.extend({
        // user-specific customizations
      })
    }
  })
  ```

  Any Model or Collection returned from a route handler will pass through the serializer layer. Highest priority will be given to a model-specific serializer, then the application serializer, then the default serializer.

  Mirage ships with three named serializers:

  - **JSONAPISerializer**, to simulate JSON:API compliant API servers:

    ```js
    import { createServer, JSONAPISerializer } from 'miragejs';

    createServer({
      serializers: {
        application: JSONAPISerializer
      }
    })
    ```

  - **ActiveModelSerializer**, to mock Rails APIs that use AMS-style responses:

    ```js
    import { createServer, ActiveModelSerializer } from 'miragejs';

    createServer({
      serializers: {
        application: ActiveModelSerializer
      }
    })
    ```

  - **RestSerializer**, a good starting point for many generic REST APIs:

    ```js
    import { createServer, RestSerializer } from 'miragejs';

    createServer({
      serializers: {
        application: RestSerializer
      }
    })
    ```

  Additionally, Mirage has a basic Serializer class which you can customize using the hooks documented below:

  ```js
  import { createServer, Serializer } from 'miragejs';

  createServer({
    serializers: {
      application: Serializer
    }
  })
  ```

  When writing model-specific serializers, remember to extend from your application serializer so shared logic is used by your model-specific classes:

  ```js
  import { createServer, Serializer } from 'miragejs';

  const ApplicationSerializer = Serializer.extend()

  createServer({
    serializers: {
      application: ApplicationSerializer,
      blogPost: ApplicationSerializer.extend({
        include: ['comments']
      })
    }
  })
  ```

  @class Serializer
  @constructor
  @public
*/
declare class Serializer {
    constructor(registry: any, type: any, request?: {});
    registry: any;
    type: any;
    request: {};
    /**
      Use this property on a model serializer to whitelist attributes that will be used in your JSON payload.

      For example, if you had a `blog-post` model in your database that looked like

      ```
      {
        id: 1,
        title: 'Lorem ipsum',
        createdAt: '2014-01-01 10:00:00',
        updatedAt: '2014-01-03 11:42:12'
      }
      ```

      and you just wanted `id` and `title`, you could write

      ```js
      Serializer.extend({
        attrs: ['id', 'title']
      });
      ```

      and the payload would look like

      ```
      {
        id: 1,
        title: 'Lorem ipsum'
      }
      ```

      @property attrs
      @public
    */
    public attrs: any;
    /**
      Use this property on a model serializer to specify related models you'd like to include in your JSON payload. (These can be considered default server-side includes.)

      For example, if you had an `author` with many `blog-post`s and you wanted to sideload these, specify so in the `include` key:

      ```js
      createServer({
        models: {
          author: Model.extend({
            blogPosts: hasMany()
          })
        },
        serializers: {
          author: Serializer.extend({
            include: ['blogPosts']
          });
        }
      })
      ```

      Now a response to a request for an author would look like this:

      ```
      GET /authors/1

      {
        author: {
          id: 1,
          name: 'Link',
          blogPostIds: [1, 2]
        },
        blogPosts: [
          {id: 1, authorId: 1, title: 'Lorem'},
          {id: 2, authorId: 1, title: 'Ipsum'}
        ]
      }
      ```

      You can also define `include` as a function so it can be determined dynamically.
      
      For example, you could conditionally include a relationship based on an `include` query parameter:

      ```js
      // Include blog posts for a GET to /authors/1?include=blogPosts
      
      Serializer.extend({
        include: function(request) {
          if (request.queryParams.include === "blogPosts") {
            return ['blogPosts'];
          } else {
            return [];
          }
        }
      });
      ```

      **Query param includes for JSONAPISerializer**

      The JSONAPISerializer supports the use of `include` query parameter to return compound documents out of the box.

      For example, if your app makes the following request

      ```
      GET /api/authors?include=blogPosts
      ```

      the `JSONAPISerializer` will inspect the query params of the request, see that the blogPosts relationship is present, and then proceed as if this relationship was specified directly in the include: [] array on the serializer itself.

      Note that, in accordance with the spec, Mirage gives precedence to an ?include query param over a default include: [] array that you might have specified directly on the serializer. Default includes will still be in effect, however, if a request does not have an ?include query param.

      Also note that default includes specified with the `include: []` array can only take a single model; they cannot take dot-separated paths to nested relationships.

      If you'd like to set a default dot-separated (nested) include path for a resource, you have to do it at the route level by setting a default value for `request.queryParams`:

      ```js
      this.get('/users', function(schema, request) => {
        request.queryParams = request.queryParams || {};
        if (!request.queryParams.include) {
          request.queryParams.include = 'blog-posts.comments';
        }

        // rest of route handler logic
      });
      ```

      @property include
      @public
    */
    public include: any;
    /**
      Set whether your JSON response should have a root key in it.

      *Doesn't apply to JSONAPISerializer.*

      Defaults to true, so a request for an author looks like:

      ```
      GET /authors/1

      {
        author: {
          id: 1,
          name: 'Link'
        }
      }
      ```

      Setting `root` to false disables this:

      ```js
      Serializer.extend({
        root: false
      });
      ```

      Now the response looks like:

      ```
      GET /authors/1

      {
        id: 1,
        name: 'Link'
      }
      ```

      @property root
      @public
    */
    public root: any;
    /**
      Set whether related models should be embedded or sideloaded.

      *Doesn't apply to JSONAPISerializer.*

      By default this false, so relationships are sideloaded:

      ```
      GET /authors/1

      {
        author: {
          id: 1,
          name: 'Link',
          blogPostIds: [1, 2]
        },
        blogPosts: [
          { id: 1, authorId: 1, title: 'Lorem' },
          { id: 2, authorId: 1, title: 'Ipsum' }
        ]
      }
      ```

      Setting `embed` to true will embed all related records:

      ```js
      Serializer.extend({
        embed: true
      });
      ```

      Now the response looks like:

      ```
      GET /authors/1

      {
        author: {
          id: 1,
          name: 'Link',
          blogPosts: [
            { id: 1, authorId: 1, title: 'Lorem' },
            { id: 2, authorId: 1, title: 'Ipsum' }
          ]
        }
      }
      ```

      You can also define `embed` as a function so it can be determined dynamically.
    */
    embed: any;
    embedFn: any;
    /**
      Use this to define how your serializer handles serializing relationship keys. It can take one of three values:

      - `included`, which is the default, will serialize the ids of a relationship if that relationship is included (sideloaded) along with the model or collection in the response
      - `always` will always serialize the ids of all relationships for the model or collection in the response
      - `never` will never serialize the ids of relationships for the model or collection in the response

      @property serializeIds
      @public
    */
    public serializeIds: any;
    /**
      Override this method to implement your own custom serialize function. *response* is whatever was returned from your route handler, and *request* is the Pretender request object.
  
      Returns a plain JavaScript object or array, which Mirage uses as the response data to your app's XHR request.
  
      You can also override this method, call super, and manipulate the data before Mirage responds with it. This is a great place to add metadata, or for one-off operations that don't fit neatly into any of Mirage's other abstractions:
  
      ```js
      serialize(object, request) {
        // This is how to call super, as Mirage borrows [Backbone's implementation of extend](http://backbonejs.org/#Model-extend)
        let json = Serializer.prototype.serialize.apply(this, arguments);
  
        // Add metadata, sort parts of the response, etc.
  
        return json;
      }
      ```
  
      @param primaryResource
      @param request
      @return { Object } the json response
     */
    serialize(primaryResource: any): Object;
    primaryResource: any;
    /**
      This method is used by the POST and PUT shorthands. These shorthands expect a valid JSON:API document as part of the request, so that they know how to create or update the appropriate resouce. The *normalize* method allows you to transform your request body into a JSON:API document, which lets you take advantage of the shorthands when you otherwise may not be able to.
  
      Note that this method is a noop if you're using JSON:API already, since request payloads sent along with POST and PUT requests will already be in the correct format.
  
      Take a look at the included `ActiveModelSerializer`'s normalize method for an example.
  
      @method normalize
      @param json
      @public
     */
    public normalize(json: any): any;
    buildPayload(primaryResource: any, toInclude: any, didSerialize: any, json: any): any;
    getHashForPrimaryResource(resource: any): any[];
    getHashForIncludedResource(resource: any): any[];
    getHashForResource(resource: any, removeForeignKeys?: boolean, didSerialize?: {}, lookupSerializer?: boolean): any[];
    mergePayloads(json: any, resourceHash: any): any;
    keyForResource(resource: any): any;
    /**
      Used to define a custom key when serializing a primary model of modelName *modelName*. For example, the default Serializer will return something like the following:
  
      ```
      GET /blogPosts/1
  
      {
        blogPost: {
          id: 1,
          title: 'Lorem ipsum'
        }
      }
      ```
  
      If your API uses hyphenated keys, you could overwrite `keyForModel`:
  
      ```js
      // serializers/application.js
      export default Serializer.extend({
        keyForModel(modelName) {
          return hyphenate(modelName);
        }
      });
      ```
  
      Now the response will look like
  
      ```
      {
        'blog-post': {
          id: 1,
          title: 'Lorem ipsum'
        }
      }
      ```
  
      @method keyForModel
      @param modelName
      @public
     */
    public keyForModel(modelName: any): any;
    /**
      Used to customize the key when serializing a primary collection. By default this pluralizes the return value of `keyForModel`.
  
      For example, by default the following request may look like:
  
      ```
      GET /blogPosts
  
      {
        blogPosts: [
          {
            id: 1,
            title: 'Lorem ipsum'
          },
          ...
        ]
      }
      ```
  
      If your API hyphenates keys, you could overwrite `keyForCollection`:
  
      ```js
      // serializers/application.js
      export default Serializer.extend({
        keyForCollection(modelName) {
          return this._container.inflector.pluralize(dasherize(modelName));
        }
      });
      ```
  
      Now the response would look like:
  
      ```
      {
        'blog-posts': [
          {
            id: 1,
            title: 'Lorem ipsum'
          },
          ...
        ]
      }
      ```
  
      @method keyForCollection
      @param modelName
      @public
     */
    public keyForCollection(modelName: any): any;
    _hashForModel(model: any, removeForeignKeys: any, didSerialize?: {}): any;
    /**
      @method _attrsForModel
      @param model
      @private
      @hide
     */
    private _attrsForModel;
    /**
      @method _maybeAddAssociationIds
      @param model
      @param attrs
      @private
      @hide
     */
    private _maybeAddAssociationIds;
    /**
      Used to customize how a model's attribute is formatted in your JSON payload.
  
      By default, model attributes are camelCase:
  
      ```
      GET /authors/1
  
      {
        author: {
          firstName: 'Link',
          lastName: 'The WoodElf'
        }
      }
      ```
  
      If your API expects snake case, you could write the following:
  
      ```js
      // serializers/application.js
      export default Serializer.extend({
        keyForAttribute(attr) {
          return underscore(attr);
        }
      });
      ```
  
      Now the response would look like:
  
      ```
      {
        author: {
          first_name: 'Link',
          last_name: 'The WoodElf'
        }
      }
      ```
  
      @method keyForAttribute
      @param attr
      @public
     */
    public keyForAttribute(attr: any): any;
    /**
      Use this hook to format the key for collections related to this model. *modelName* is the named parameter for the relationship.
  
      For example, if you're serializing an `author` that
      sideloads many `blogPosts`, the default response will look like:
  
      ```
      {
        author: {...},
        blogPosts: [...]
      }
      ```
  
      Overwrite `keyForRelationship` to format this key:
  
      ```js
      // serializers/application.js
      export default Serializer.extend({
        keyForRelationship(modelName) {
          return underscore(modelName);
        }
      });
      ```
  
      Now the response will look like this:
  
      ```
      {
        author: {...},
        blog_posts: [...]
      }
      ```
  
      @method keyForRelationship
      @param modelName
      @public
     */
    public keyForRelationship(modelName: any): any;
    /**
      Like `keyForRelationship`, but for embedded relationships.
  
      @method keyForEmbeddedRelationship
      @param attributeName
      @public
     */
    public keyForEmbeddedRelationship(attributeName: any): any;
    /**
      Use this hook to format the key for the IDS of a `hasMany` relationship
      in this model's JSON representation.
  
      For example, if you're serializing an `author` that
      sideloads many `blogPosts`, by default your `author` JSON would include a `blogPostIds` key:
  
      ```
      {
        author: {
          id: 1,
          blogPostIds: [1, 2, 3]
        },
        blogPosts: [...]
      }
      ```
  
      Overwrite `keyForRelationshipIds` to format this key:
  
      ```js
      // serializers/application.js
      export default Serializer.extend({
        keyForRelationshipIds(relationship) {
          return underscore(relationship) + '_ids';
        }
      });
      ```
  
      Now the response will look like:
  
      ```
      {
        author: {
          id: 1,
          blog_post_ids: [1, 2, 3]
        },
        blogPosts: [...]
      }
      ```
  
      @method keyForRelationshipIds
      @param modelName
      @public
     */
    public keyForRelationshipIds(relationshipName: any): string;
    /**
      Like `keyForRelationshipIds`, but for `belongsTo` relationships.
  
      For example, if you're serializing a `blogPost` that sideloads one `author`,
      your `blogPost` JSON would include a `authorId` key:
  
      ```
      {
        blogPost: {
          id: 1,
          authorId: 1
        },
        author: ...
      }
      ```
  
      Overwrite `keyForForeignKey` to format this key:
  
      ```js
      // serializers/application.js
      export default Serializer.extend({
        keyForForeignKey(relationshipName) {
          return underscore(relationshipName) + '_id';
        }
      });
      ```
  
      Now the response will look like:
  
      ```js
      {
        blogPost: {
          id: 1,
          author_id: 1
        },
        author: ...
      }
      ```
  
      @method keyForForeignKey
      @param relationshipName
      @public
     */
    public keyForForeignKey(relationshipName: any): string;
    /**
      Polymorphic relationships are represented with type-id pairs.
  
      Given the following model
  
      ```js
      Model.extend({
        commentable: belongsTo({ polymorphic: true })
      });
      ```
  
      the default Serializer would produce
  
      ```js
      {
        comment: {
          id: 1,
          commentableType: 'post',
          commentableId: '1'
        }
      }
      ```
  
      This hook controls how the `id` field (`commentableId` in the above example)
      is serialized. By default it camelizes the relationship and adds `Id` as a suffix.
  
      @method keyForPolymorphicForeignKeyId
      @param {String} relationshipName
      @return {String}
      @public
    */
    public keyForPolymorphicForeignKeyId(relationshipName: string): string;
    /**
      Polymorphic relationships are represented with type-id pairs.
  
      Given the following model
  
      ```js
      Model.extend({
        commentable: belongsTo({ polymorphic: true })
      });
      ```
  
      the default Serializer would produce
  
      ```js
      {
        comment: {
          id: 1,
          commentableType: 'post',
          commentableId: '1'
        }
      }
      ```
  
      This hook controls how the `type` field (`commentableType` in the above example)
      is serialized. By default it camelizes the relationship and adds `Type` as a suffix.
  
      @method keyForPolymorphicForeignKeyType
      @param {String} relationshipName
      @return {String}
      @public
    */
    public keyForPolymorphicForeignKeyType(relationshipName: string): string;
    /**
      @method isModel
      @param object
      @return {Boolean}
      @public
      @hide
     */
    public isModel(object: any): boolean;
    /**
      @method isCollection
      @param object
      @return {Boolean}
      @public
      @hide
     */
    public isCollection(object: any): boolean;
    /**
      @method isModelOrCollection
      @param object
      @return {Boolean}
      @public
      @hide
     */
    public isModelOrCollection(object: any): boolean;
    /**
      @method serializerFor
      @param type
      @public
      @hide
     */
    public serializerFor(type: any): any;
    getAssociationKeys(): any;
    getKeysForEmbedded(): any;
    getKeysForIncluded(): any;
    /**
      A reference to the schema instance.
  
      Useful to reference registered schema information, for example in a Serializer's include hook to include all a resource's associations:
  
      ```js
      Serializer.extend({
        include(request, resource) {
          return Object.keys(this.schema.associationsFor(resource.modelName));
        }
      })
      ```
  
      @property
      @type {Object}
      @public
    */
    public get schema(): Object;
    /**
      @method _formatAttributeKeys
      @param attrs
      @private
      @hide
     */
    private _formatAttributeKeys;
    getCoalescedIds(): void;
}
declare namespace Serializer {
    export { extend };
}
import extend from "./utils/extend";
//# sourceMappingURL=serializer.d.ts.map