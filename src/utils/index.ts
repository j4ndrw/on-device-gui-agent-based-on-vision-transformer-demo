import html2canvas from "html2canvas";
/* eslint-disable no-empty */
type Options = {
  exceptSelectors: string[];
};
export const takeScreenshotOfDOM = async (options: Options) => {
  const domCopy = structuredClone(document.body);
  const elementsToOmit = options.exceptSelectors.flatMap((selector) => [
    ...domCopy.querySelectorAll(selector),
  ]);
  for (const element of elementsToOmit) {
    try {
      element.remove();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_: unknown) { }
  }

  const canvas = await html2canvas(domCopy);
  const base64Image = canvas.toDataURL("image/png");

  const binaryString = atob(base64Image);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);

  for (let i = 0; i < len; ++i) bytes[i] = binaryString.charCodeAt(i);
  return { image: bytes, size: { width: canvas.width, height: canvas.height } };
};
