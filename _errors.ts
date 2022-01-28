export class EnvVarsError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = 'EnvVarsError';
  }
}

export class UpstashError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = 'UpstashError';
  }
}
