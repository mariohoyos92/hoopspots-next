/// <reference types="next" />
/// <reference types="next/types/global" />
declare namespace jest {
  interface Matchers<R> {
    toHaveNoViolations(): CustomMatcherResult;
  }
}
