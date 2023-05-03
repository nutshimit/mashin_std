/// <reference types="./mashin.d.ts" />

export class Mashin {}
export { Resource, Provider } from "./resource.ts";
export type { ResourceName, ResourceOptions } from "./resource.ts";
export type { Inputs, Outputs } from "./output.ts";
export { getFileName } from "./download.ts";

export abstract class Backend {}
