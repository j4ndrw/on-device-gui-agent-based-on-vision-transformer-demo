
import { useGuiAgent } from "./hooks/ai/gui-agent";
import * as Vibes from "./vibes";

const guiAgentPanelSelector = "#gui-agent-panel";

function App() {
  const { generate } = useGuiAgent({
    selectorToExcludeFromVisionAgent: guiAgentPanelSelector,
  });
  return (
    <>
      <Vibes.InteractiveDashboard />
      <Vibes.ChatBottomPanel
        placeholder="Tell the GUI agent what to do"
        onSendMessage={async (prompt: string) => {
          const output = await generate(prompt);
          console.log({ output });
        }}
      />
    </>
  );
}

export default App;
