type OsRecord<T> = { [os in typeof Deno.build.os]: T };
type ArchRecord<T> = { [os in typeof Deno.build.arch]: T };

const defaultExtensions: OsRecord<string> = {
  darwin: "dylib",
  linux: "so",
  windows: "dll",
  freebsd: "so",
  netbsd: "so",
  aix: "so",
  solaris: "so",
  illumos: "so",
};

const defaultPrefixes: OsRecord<string> = {
  darwin: "lib",
  linux: "lib",
  netbsd: "lib",
  freebsd: "lib",
  aix: "lib",
  solaris: "lib",
  illumos: "lib",
  windows: "",
};

type NestedCrossRecord<T> = Partial<
  OsRecord<T | Partial<ArchRecord<T>>> | ArchRecord<T | Partial<OsRecord<T>>>
>;

export function createDownloadURL(name: string, base_url: URL): string {
  const extensions = defaultExtensions;
  const prefixes = defaultPrefixes;
  // FIXME: implement default suffix
  const suffix = "";

  // Clean extensions to not contain a leading dot
  for (const key in extensions) {
    const os = key as typeof Deno.build.os;
    if (extensions[os] !== undefined) {
      extensions[os] = extensions[os].replace(/\.?(.+)/, "$1");
    }
  }

  if (!base_url.pathname.endsWith("/")) {
    base_url.pathname = `${base_url.pathname}/`;
  }

  const prefix = getCrossOption(prefixes) ?? "";
  const extension = extensions[Deno.build.os];
  const filename = `${prefix}${name}${suffix}.${extension}`;

  return new URL(filename, base_url).toString();
}

function getCrossOption<T>(record?: NestedCrossRecord<T>): T | undefined {
  if (record === undefined) {
    return;
  }

  if (
    "darwin" in record ||
    "linux" in record ||
    "netbsd" in record ||
    "freebsd" in record ||
    "aix" in record ||
    "solaris" in record ||
    "illumos" in record ||
    "windows" in record
  ) {
    const subrecord = record[Deno.build.os];

    if (
      subrecord &&
      typeof subrecord === "object" &&
      ("x86_64" in subrecord || "aarch64" in subrecord)
    ) {
      return (subrecord as ArchRecord<T>)[Deno.build.arch];
    } else {
      return subrecord as T;
    }
  }

  if ("x86_64" in record || "aarch64" in record) {
    const subrecord = record[Deno.build.arch];

    if (
      subrecord &&
      typeof subrecord === "object" &&
      ("darwin" in subrecord || "linux" in subrecord || "windows" in subrecord)
    ) {
      return (subrecord as OsRecord<T>)[Deno.build.os];
    } else {
      return subrecord as T;
    }
  }
}
