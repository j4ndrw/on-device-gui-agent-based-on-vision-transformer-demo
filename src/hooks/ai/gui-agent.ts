// Credit: https://github.com/SamsungLabs/TinyClick/blob/main/main.py
import { takeScreenshotOfDOM } from "@/utils";
import {
  AutoProcessor,
  AutoModelForCausalLM,
  Tensor,
  PreTrainedModel,
  Processor,
} from "@huggingface/transformers";
import { useEffect, useState } from "react";

type Options = {
  selectorToExcludeFromVisionAgent: string;
};

const MODEL = "Samsung/TinyClick";

export const useGuiAgent = (options: Options) => {
  const [processor, setProcessor] = useState<Processor>();
  const [model, setModel] = useState<PreTrainedModel>();

  useEffect(() => {
    (async () => {
      const processor = await AutoProcessor.from_pretrained(MODEL, {
        trust_remote_code: true,
      });
      const model = await AutoModelForCausalLM.from_pretrained(MODEL, {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        trust_remote_code: true,
      });
      setProcessor(processor);
      setModel(model);
    })();
  }, []);

  const generate = async (prompt: string) => {
    if (!processor || !model) return;

    const target = await takeScreenshotOfDOM({
      exceptSelectors: [options.selectorToExcludeFromVisionAgent],
    });

    const inputs = await processor({
      images: target.image,
      text: prompt,
      return_tensors: "pt",
      do_resize: true,
    });
    const outputs = (await model.generate({ inputs })) as Tensor;
    const generatedTexts = processor.batch_decode(outputs, {
      skip_special_tokens: false,
    });
    return generatedTexts;
  };

  return { generate };
};
