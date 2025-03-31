// eslint-disable-next-line @typescript-eslint/no-explicit-any
let Identicon: any = $state(null);

export async function loadIdenticon() {
  const identiconModule = await import("identicon.js");
  Identicon = identiconModule.default;
}

export async function getIdenticon() {
  if (!Identicon) {
    await loadIdenticon();
  }
  return Identicon;
}
