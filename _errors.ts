export class EnvVarsError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = 'EnvVarsError';
  }
}

export class DBFetchError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = 'DBFetchError';
  }
}
