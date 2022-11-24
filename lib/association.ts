/**
 @hide
 */
function association<T>(...traitsAndOverrides: T[]) {
  return {
    __isAssociation__: true,
    traitsAndOverrides,
  };
}

export default association;
