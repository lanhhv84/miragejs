/**
 @hide
 */
export default function assert(bool: boolean | string, text: string = "") {
  if (typeof bool === "string" && !text) {
    throw new MirageError(bool);
  }

  if (!bool) {
    throw new MirageError(text.replace(/^ +/gm, "") || "Assertion failed");
  }
}

/**
 @public
 @hide
 Copied from ember-metal/error
 */
export class MirageError extends Error {
  constructor(message: string, stack?: string) {
    super();
    if (stack) {
      this.stack = `Mirage: ${stack}`;
    }
    this.name = "MirageError";
    this.message = `Mirage: ${message}`;
  }
}
