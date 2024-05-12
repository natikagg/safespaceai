import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import '@aws-amplify/ui-react/styles.css';
import LandingPage from './Pages/LandingPage';
import Login from './Pages/Login';
import ConversationSimulation from './Pages/ConversationSimulation';
import { ChakraProvider } from '@chakra-ui/react';
import {
  DeepgramTranscriberConfig,
  LLMAgentConfig,
  AzureSynthesizerConfig,
  VocodeConfig,
  EchoAgentConfig,
  ChatGPTAgentConfig,
  RESTfulUserImplementedAgentConfig,
  WebSocketUserImplementedAgentConfig,
} from "vocode";

// const client = generateClient();
const transcriberConfig: Omit<
    DeepgramTranscriberConfig,
    "samplingRate" | "audioEncoding"
  > = {
    type: "transcriber_deepgram",
    chunkSize: 2048,
    endpointingConfig: {
      type: "endpointing_punctuation_based",
    },
  };
  const agentConfig: ChatGPTAgentConfig = {
    type: "agent_chat_gpt",
    initialMessage: { type: "message_base", text: "Hello!" },
    promptPreamble:
      "Vocode is an SDK that allows developers to create voice bots like this one in less than 10 lines of code. The AI is explaining to the human what Vocode is.",
    endConversationOnGoodbye: true,
    generateResponses: true,
    cutOffResponse: {},
  };
  const synthesizerConfig: Omit<
    AzureSynthesizerConfig,
    "samplingRate" | "audioEncoding"
  > = {
    type: "synthesizer_azure",
    shouldEncodeAsWav: true,
    voiceName: "en-US-SteffanNeural",
  };
  const vocodeConfig: VocodeConfig = {
    apiKey: "f374ad92a7788ae73230e2c48f05f0e5",
    baseUrl: "wss://backend.safespaceai.com/conversation",
  };


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<div>Not Found</div>} />
        <Route path="/app" element={
                <ConversationSimulation
                config={{
                  transcriberConfig,
                  agentConfig,
                  synthesizerConfig,
                  vocodeConfig,
                }}
              />
        } />
      </Routes>
    </BrowserRouter>

  );
}

export default App;
