import { Writable } from 'stream';

export class TestSink extends Writable {
  public result = [];
  constructor() {
    super({ objectMode: true });
  }

  _write(
    chunk: any,
    _encoding: BufferEncoding,
    callback: (error?: Error | null) => void,
  ): void {
    this.result.push(chunk);
    callback();
  }
}
