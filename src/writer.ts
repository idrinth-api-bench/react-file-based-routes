export default interface Writer {
  add(path: string, url: string, changed: string): void;
  toString(): string;
  fileName(): string;
}
