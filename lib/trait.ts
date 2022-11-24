function trait<T>(extension: T) {
  return {
    extension,
    __isTrait__: true,
  };
}

/**
 @hide
 */
export default trait;
