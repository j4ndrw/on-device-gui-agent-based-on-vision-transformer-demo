/* eslint-disable @typescript-eslint/no-explicit-any */
// Credit: https://github.com/SamsungLabs/TinyClick/blob/main/main.py
import { takeScreenshotOfDOM } from "@/utils";
import {
  load_image,
  RawImage,
  AutoProcessor,
  Florence2Processor,
  Florence2PreTrainedModel,
  Tensor,
  Florence2ForConditionalGeneration,
} from "@huggingface/transformers";

type Options = {
  selectorToExcludeFromVisionAgent: string;
};

const MODEL = "onnx-community/Florence-2-base";

export const useGuiAgent = (options: Options) => {
  const generate = async (prompt: string) => {
    const model = await Florence2ForConditionalGeneration.from_pretrained(
      MODEL,
      { device: "wasm" },
    ) as Florence2PreTrainedModel;
    const processor = (await AutoProcessor.from_pretrained(
      MODEL,
      {},
    )) as Florence2Processor;

    const url = await takeScreenshotOfDOM({
      exceptSelectors: [options.selectorToExcludeFromVisionAgent],
    });

    const image = ((await load_image(url)) as RawImage).rgb();
    const task = `<CAPTION_TO_PHRASE_GROUNDING>`;
    const prompts = [`${processor.construct_prompts(task)[0]}${prompt}`];
    const inputs = await processor(image, prompts);
    const generatedIds = (await model.generate({
      ...inputs,
      max_new_tokens: 100,
    })) as Tensor;

    const [generatedText] = processor.batch_decode(generatedIds, {
      skip_special_tokens: false,
    });
    const postprocessed = processor.post_process_generation(generatedText, task, image.size);
    console.log({ postprocessed });
    const [x, y, w, h] = (postprocessed.task as any).bboxes as [number, number, number, number];
    const element = document.elementFromPoint(
      Math.floor((x + w) / 2),
      Math.floor((y + h) / 2),
    );
    console.log(element, [x, y, w, h]);
  };

  return { generate };
};
