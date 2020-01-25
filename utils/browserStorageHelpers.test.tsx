import * as browserStorageHelper from "./browserStorageHelpers";

describe("localStorageHelper.isExpired", () => {
  it("returns false when no expiryTime is present", () => {
    expect(browserStorageHelper.isExpired()).toEqual(false);
  });
  it("returns false when expiryTime is greater than currentTime", () => {
    expect(browserStorageHelper.isExpired(1000, 1)).toEqual(false);
  });
  it("returns true when expiryTime is less than currentTime", () => {
    expect(browserStorageHelper.isExpired(1, 1000)).toEqual(true);
  });
});

describe("localStorageHelper.getExpiry", () => {
  it("returns new expiryTime from currentTime when given days", () => {
    expect(
      browserStorageHelper.getExpiry({ unit: "days", value: 1 }, 1)
    ).toEqual(1000 * 60 * 60 * 24 + 1);
  });
  it("returns new expiryTime from currentTime when given minutes", () => {
    expect(
      browserStorageHelper.getExpiry({ unit: "minutes", value: 1 }, 1)
    ).toEqual(1000 * 60 + 1);
  });
});

const getSpy = jest.spyOn(Storage.prototype, "getItem");
const setSpy = jest.spyOn(Storage.prototype, "setItem");
const removeSpy = jest.spyOn(Storage.prototype, "removeItem");

describe("localStorageHelper.getFromStorage", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("gets value from localStorage", () => {
    const value = "test";
    getSpy.mockImplementationOnce(() => {
      return JSON.stringify({ value, expiryTime: 9999999999999 });
    });
    const localValue = browserStorageHelper.getFromStorage({
      type: "localStorage",
      key: "example"
    });
    expect(localValue).toEqual(value);
  });
  it("gets the entire key from localStorage", () => {
    const value = "test";
    getSpy.mockImplementationOnce(() => {
      return JSON.stringify({ value, expiryTime: 9999999999999 });
    });
    const localValue = browserStorageHelper.getFromStorage({
      type: "localStorage",
      key: "example"
    });
    expect(localValue).toEqual(value);
  });
  it("returns null if value is expired and removes it", () => {
    const value = "test";
    getSpy.mockImplementationOnce(() => {
      return JSON.stringify({ value, expiryTime: 1000 });
    });
    const localValue = browserStorageHelper.getFromStorage({
      type: "localStorage",
      key: "example"
    });
    expect(localValue).toEqual(null);
    expect(removeSpy).toHaveBeenCalled();
  });
  it("returns null if errors with localStorage", () => {
    getSpy.mockImplementationOnce(() => {
      throw new Error();
    });
    const localValue = browserStorageHelper.getFromStorage({
      type: "localStorage",
      key: "example"
    });
    expect(localValue).toEqual(null);
    expect(removeSpy).not.toHaveBeenCalled();
  });

  it("gets value from sessionStorage", () => {
    const value = "test";
    getSpy.mockImplementationOnce(() => {
      return JSON.stringify({ value, expiryTime: 9999999999999 });
    });
    const localValue = browserStorageHelper.getFromStorage({
      type: "sessionStorage",
      key: "example"
    });
    expect(localValue).toEqual(value);
  });
  it("gets the entire key from sessionStorage", () => {
    const value = "test";
    getSpy.mockImplementationOnce(() => {
      return JSON.stringify({ value, expiryTime: 9999999999999 });
    });
    const localValue = browserStorageHelper.getFromStorage({
      type: "sessionStorage",
      key: "example"
    });
    expect(localValue).toEqual(value);
  });
  it("returns null if value is expired and removes it", () => {
    const value = "test";
    getSpy.mockImplementationOnce(() => {
      return JSON.stringify({ value, expiryTime: 1000 });
    });
    const localValue = browserStorageHelper.getFromStorage({
      type: "sessionStorage",
      key: "example"
    });
    expect(localValue).toEqual(null);
    expect(removeSpy).toHaveBeenCalled();
  });
  it("returns null if errors with sessionStorage", () => {
    getSpy.mockImplementationOnce(() => {
      throw new Error();
    });
    const localValue = browserStorageHelper.getFromStorage({
      type: "sessionStorage",
      key: "example"
    });
    expect(localValue).toEqual(null);
    expect(removeSpy).not.toHaveBeenCalled();
  });
});

describe("localStorageHelper.setToStorage", () => {
  it("return true if successful", () => {
    const localValue = browserStorageHelper.setToStorage({
      type: "localStorage",
      key: "example",
      value: "test1",
      expiry: { unit: "days", value: 1 }
    });
    expect(setSpy).toHaveBeenCalled();
    expect(localValue).toEqual(true);
  });

  it("returns false if errors with localStorage", () => {
    setSpy.mockImplementationOnce(() => {
      throw new Error();
    });
    const localValue = browserStorageHelper.setToStorage({
      type: "localStorage",
      key: "example",
      value: "test1"
    });
    expect(localValue).toEqual(false);
  });
});

describe("StorageHelper.refreshStorage", () => {
  it("should update expiry on unexpired values", () => {
    const value = "test";
    getSpy.mockImplementationOnce(() => {
      return JSON.stringify({ value, expiryTime: 9999999999999 });
    });
    const result = browserStorageHelper.refreshStorage({
      key: "example",
      type: "sessionStorage"
    });
    expect(result).toEqual(true);
  });
  it("should fail to update expiry on expired values", () => {
    getSpy.mockImplementationOnce(() => {
      throw new Error();
    });
    const result = browserStorageHelper.refreshStorage({
      key: "example",
      type: "sessionStorage",
      expiry: { unit: "minutes", value: 1 }
    });
    expect(result).toEqual(false);
  });
});

describe("StorageHelper.removeFromStorage", () => {
  it("return true if successful", () => {
    const localValue = browserStorageHelper.removeFromStorage({
      type: "localStorage",
      key: "example"
    });
    expect(removeSpy).toHaveBeenCalled();
    expect(localValue).toEqual(true);
  });

  it("returns false if errors with removing from Storage", () => {
    removeSpy.mockImplementationOnce(() => {
      throw new Error();
    });
    const localValue = browserStorageHelper.removeFromStorage({
      type: "localStorage",
      key: "example"
    });
    expect(removeSpy).toHaveBeenCalled();
    expect(localValue).toEqual(false);
  });
});
