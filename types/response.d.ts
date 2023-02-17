/**
  You can use this class when you want more control over your route handlers response.

  Pass the `code`, `headers` and `data` into the constructor and return an instance from any route handler.

  ```js
  import { Response } from 'miragejs';

  this.get('/users', () => {
    return new Response(400, { some: 'header' }, { errors: [ 'name cannot be blank'] });
  });
  ```
*/
export default class Response {
    constructor(code: any, headers: {} | undefined, data: any);
    code: any;
    headers: {};
    data: any;
    toRackResponse(): any[];
}
//# sourceMappingURL=response.d.ts.map