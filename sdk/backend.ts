import { Inputs } from "./output.ts";

export abstract class Backend {
  #name: string;
  #props: Inputs;

  get name() {
    return this.#name;
  }

  get props() {
    return this.#props;
  }

  constructor(name: string, path: string, props: Inputs = {}) {
    new __mashin.DynamicBackend(name, path, props);
  }
}
