export default interface Writer {
  add(path: string, url: string, domain: string, changed: string): void;
  toString(): string;
  fileName(): string;
}
