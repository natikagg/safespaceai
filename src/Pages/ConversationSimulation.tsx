import { Box, Button, HStack, VStack, Select, Spinner, Input } from "@chakra-ui/react";
import React, { useState } from "react";
import { useConversation, AudioDeviceConfig, ConversationConfig } from "vocode";
import MicrophoneIcon from "../Components/MicrophoneIcon";
import AudioVisualization from "../Components/AudioVisualization";
import { isMobile } from "react-device-detect";
const ConversationSimulation = ({
  config,
}: {
  config: Omit<ConversationConfig, "audioDeviceConfig">;
}) => {
  const [audioDeviceConfig, setAudioDeviceConfig] =
    React.useState<AudioDeviceConfig>({});
  const [inputDevices, setInputDevices] = React.useState<MediaDeviceInfo[]>([]);
  const [outputDevices, setOutputDevices] = React.useState<MediaDeviceInfo[]>(
    []
  );
  /*let transcripts: any[] = [];
  const { status, start, stop, analyserNode } = useConversation(
    Object.assign(config, { audioDeviceConfig })
  );*/
   const { status, start, stop, analyserNode, transcripts } = useConversation({
     backendUrl: "ws://3.215.133.99:3000/conversation",
     subscribeTranscript: false,
     audioDeviceConfig,
   });
  React.useEffect(() => {
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        setInputDevices(
          devices.filter(
            (device) => device.deviceId && device.kind === "audioinput"
          )
        );
        setOutputDevices(
          devices.filter(
            (device) => device.deviceId && device.kind === "audiooutput"
          )
        );
      })
      .catch((err) => {
        console.error(err);
      });
  });
  const [prompt, setPrompt] = useState("");
  const sendPrompt = async () => {
    try {
      const response = await fetch("http://3.215.133.99:3000/prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt : prompt }), // Send the prompt in the request body
      });
      if (response.ok) {
        console.log("Prompt sent successfully");
      } else {
        console.error("Failed to send prompt");
      }
    } catch (error) {
      console.error("Error sending prompt:", error);
    }
  };
  return (
    <>
      {analyserNode && <AudioVisualization analyser={analyserNode} />}
      <Box p={4} display="flex" justifyContent="center" alignItems="center">
      <Input
        placeholder="Enter prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        width="300px"
        mr={2}
      />
      <Button colorScheme="blue" onClick={sendPrompt}>Send Prompt</Button>
    </Box>
      <Button
        variant="link"
        disabled={["connecting", "error"].includes(status)}
        onClick={status === "connected" ? stop : start}
        position={"absolute"}
        top={"45%"}
        left={"50%"}
        transform={"translate(-50%, -50%)"}
      >
        <Box boxSize={75}>
          <MicrophoneIcon color={"#DDFAFA"} muted={status !== "connected"} />
        </Box>
      </Button>
      <Box boxSize={50} />
      {status === "connecting" && (
        <Box
          position={"absolute"}
          top="57.5%"
          left="50%"
          transform={"translate(-50%, -50%)"}
          padding={5}
        >
          <Spinner color="#FFFFFF" />
        </Box>
      )}
      {!isMobile && (
        <HStack width="96%" position="absolute" top={"10%"} left="2%">
          {inputDevices.length > 0 && (
            <Select
              color={"#FFFFFF"}
              disabled={["connecting", "connected"].includes(status)}
              onChange={(event) =>
                setAudioDeviceConfig({
                  ...audioDeviceConfig,
                  inputDeviceId: event.target.value,
                })
              }
              value={audioDeviceConfig.inputDeviceId}
            >
              {inputDevices.map((device, i) => {
                return (
                  <option key={i} value={device.deviceId}>
                    {device.label}
                  </option>
                );
              })}
            </Select>
          )}
          {outputDevices.length > 0 && (
            <Select
              color={"#FFFFFF"}
              disabled
              onChange={(event) =>
                setAudioDeviceConfig({
                  ...audioDeviceConfig,
                  outputDeviceId: event.target.value,
                })
              }
              value={audioDeviceConfig.outputDeviceId}
            >
              {outputDevices.map((device, i) => {
                return (
                  <option key={i} value={device.deviceId}>
                    {device.label}
                  </option>
                );
              })}
            </Select>
          )}
          <Select
            color={"#FFFFFF"}
            disabled={["connecting", "connected"].includes(status)}
            onChange={(event) =>
              event.target.value &&
              setAudioDeviceConfig({
                ...audioDeviceConfig,
                outputSamplingRate: parseInt(event.target.value),
              })
            }
            placeholder="Set output sampling rate"
            value={audioDeviceConfig.outputSamplingRate}
          >
            {["8000", "16000", "24000", "44100", "48000"].map((rate, i) => {
              return (
                <option key={i} value={rate}>
                  {rate} Hz
                </option>
              );
            })}
          </Select>
        </HStack>
      )}
      { transcripts.length > 0 && (
        <VStack width="35%" position="absolute" top={"50%"} height={"45%"} left="2%" alignItems="left" overflowY="auto">
          {
            transcripts.map((item, index) => {
              return <Box key={"t" + index.toString()} color="white">{item.sender}: {item.text}</Box>
            })
          }
        </VStack>
      )}
    </>
  );
};
export default ConversationSimulation;