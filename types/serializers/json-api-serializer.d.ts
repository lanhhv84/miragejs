export default JSONAPISerializer;
/**
  The JSONAPISerializer. Subclass of Serializer.

  @class JSONAPISerializer
  @constructor
  @public
 */
declare class JSONAPISerializer extends Serializer {
    constructor(...args: any[]);
    /**
      By default, JSON:API's linkage data is only added for relationships that are being included in the current request.

      That means given an `author` model with a `posts` relationship, a GET request to /authors/1 would return a JSON:API document with an empty `relationships` hash:

      ```js
      {
        data: {
          type: 'authors',
          id: '1',
          attributes: { ... }
        }
      }
      ```

      but a request to GET /authors/1?include=posts would have linkage data added (in addition to the included resources):

      ```js
      {
        data: {
          type: 'authors',
          id: '1',
          attributes: { ... },
          relationships: {
            data: [
              { type: 'posts', id: '1' },
              { type: 'posts', id: '2' },
              { type: 'posts', id: '3' }
            ]
          }
        },
        included: [ ... ]
      }
      ```

      To add the linkage data for all relationships, you could set `alwaysIncludeLinkageData` to `true`:

      ```js
      JSONAPISerializer.extend({
        alwaysIncludeLinkageData: true
      });
      ```

      Then, a GET to /authors/1 would respond with

      ```js
      {
        data: {
          type: 'authors',
          id: '1',
          attributes: { ... },
          relationships: {
            posts: {
              data: [
                { type: 'posts', id: '1' },
                { type: 'posts', id: '2' },
                { type: 'posts', id: '3' }
              ]
            }
          }
        }
      }
      ```

      even though the related `posts` are not included in the same document.

      You can also use the `links` method (on the Serializer base class) to add relationship links (which will always be added regardless of the relationship is being included document), or you could use `shouldIncludeLinkageData` for more granular control.

      For more background on the behavior of this API, see [this blog post](http://www.ember-cli-mirage.com/blog/changing-mirages-default-linkage-data-behavior-1475).

      @property alwaysIncludeLinkageData
      @type {Boolean}
      @public
    */
    public alwaysIncludeLinkageData: boolean;
    /**
      Use this hook to add top-level `links` data to JSON:API resource objects. The argument is the model being serialized.
  
      ```js
      // serializers/author.js
      import { JSONAPISerializer } from 'miragejs';
  
      export default JSONAPISerializer.extend({
  
        links(author) {
          return {
            'posts': {
              related: `/api/authors/${author.id}/posts`
            }
          };
        }
  
      });
      ```
  
      @method links
      @param model
    */
    links(): void;
    getAddToIncludesForResource(resource: any): any;
    getAddToIncludesForResourceAndPaths(resource: any, relationshipPaths: any): any;
    getIncludesForResourceAndPath(resource: any, ...names: any[]): any[];
    getResourceObjectForModel(model: any): any;
    _maybeAddRelationshipsToResourceObjectForModel(hash: any, model: any): any;
    hasLinksForRelationship(model: any, relationshipKey: any): any;
    _relationshipIsIncludedForModel(relationshipKey: any, model: any): any;
    _createRequestedIncludesGraph(primaryResource: any, secondaryResource?: null): void;
    _addPrimaryModelToRequestedIncludesGraph(graph: any, model: any): void;
    _addResourceToRequestedIncludesGraph(graph: any, resource: any, relationshipNames: any): void;
    _addModelToRequestedIncludesGraph(graph: any, model: any, relationshipNames: any): void;
    _addResourceRelationshipsToRequestedIncludesGraph(graph: any, collectionName: any, resourceKey: any, model: any, relationshipNames: any): void;
    _graphKeyForModel(model: any): string;
    getQueryParamIncludes(): any;
    hasQueryParamIncludes(): boolean;
    /**
      Used to customize the `type` field of the document. By default, pluralizes and dasherizes the model's `modelName`.
  
      For example, the JSON:API document for a `blogPost` model would be:
  
      ```js
      {
        data: {
          id: 1,
          type: 'blog-posts'
        }
      }
      ```
  
      @method typeKeyForModel
      @param {Model} model
      @return {String}
      @public
    */
    public typeKeyForModel(model: any): string;
    /**
      Allows for per-relationship inclusion of linkage data. Use this when `alwaysIncludeLinkageData` is not granular enough.
  
      ```js
      export default JSONAPISerializer.extend({
        shouldIncludeLinkageData(relationshipKey, model) {
          if (relationshipKey === 'author' || relationshipKey === 'ghostWriter') {
            return true;
          }
          return false;
        }
      });
      ```
  
      @method shouldIncludeLinkageData
      @param {String} relationshipKey
      @param {Model} model
      @return {Boolean}
      @public
    */
    public shouldIncludeLinkageData(relationshipKey: string, model: any): boolean;
}
import Serializer from "../serializer";
//# sourceMappingURL=json-api-serializer.d.ts.map