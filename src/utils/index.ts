import html2canvas from "html2canvas-pro";

type Options = {
  exceptSelectors: string[];
};

export const takeScreenshotOfDOM = async (options: Options) => {
  const elementsToOmit = options.exceptSelectors.flatMap((selector) => [
    ...document.body.querySelectorAll(selector),
  ]) as HTMLElement[];
  for (const element of elementsToOmit) {
    element.style.display = "none";
  }

  const canvas = await html2canvas(document.body);
  const base64Image = canvas.toDataURL("image/png");

  for (const element of elementsToOmit) {
    element.style.display = "none";
  }

  const bytes = atob(base64Image.split(",")[1]);
  const byteArray = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) byteArray[i] = bytes.charCodeAt(i);

  const blob = new Blob([byteArray], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  return url;
};
