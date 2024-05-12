import { Box, Button, HStack, VStack, Select, Spinner, Input } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { useConversation, AudioDeviceConfig, ConversationConfig } from "vocode";
import MicrophoneIcon from "../Components/MicrophoneIcon";
import AudioVisualization from "../Components/AudioVisualization";
import { isMobile } from "react-device-detect";
import { signOut as amplifySignOut } from '@aws-amplify/auth';
import { useNavigate } from 'react-router-dom';
import AppNavBar from "../Components/AppBar";
import getUserData from '../UserManagement/getUserData';
import { Typography } from "@mui/material";
import decrementCallsLeft from "../UserManagement/increaseUsage";
import { getMoreCredits } from "../UserManagement/getMoreCredits";

interface AttributeMap {
  [key: string]: any;
}

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
  const [userData, setUserData] = useState<AttributeMap | null>(null);
  const [loadingUserData, setLoadingUserData] = useState(true); // State to manage loading status
  const [trait, setTrait] = useState("");
  const [role, setRole] = useState("");
  const [goal, setGoal] = useState("");
  const [behavior, setBehavior] = useState("");
  const [tone, setTone] = useState("");
  /*let transcripts: any[] = [];
  const { status, start, stop, analyserNode } = useConversation(
    Object.assign(config, { audioDeviceConfig })
  );*/

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      setInputDevices(devices.filter((device) => device.deviceId && device.kind === 'audioinput'));
      setOutputDevices(devices.filter((device) => device.deviceId && device.kind === 'audiooutput'));
    }).catch((err) => console.error(err));

    const fetchUserData = async () => {
      try {
        const data = await getUserData();
        setUserData(data);
        setLoadingUserData(false);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        setLoadingUserData(false);
      }
    };

    fetchUserData();
  }, []);


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

const navigate = useNavigate();
if (userData === null) {
  // Handle the null case, maybe return a loading spinner or a placeholder
  return null;
}
const handleBuyCredits = async () => {
  try {
    getMoreCredits(userData.Email, userData.userID);
  } catch (error) {
    //console.error('Error redirecting: ', error);
  }
};


const sendPrompt = async () => {
  const fullPrompt = `Imagine you are a ${trait} ${role}. Your primary objective is to ${goal}. In this role, you should craft responses that align closely with the objectives set for your character. Make sure your replies demonstrate a clear understanding of your position and responsibilities.\nWhen interacting, focus on ${behavior} to convincingly portray your character. Your communication should be consistent with someone who embodies the archetype of ${trait} ${role}, ensuring that all responses are in character and realistic.\nThroughout the interaction, maintain a tone that is ${tone} and use language that reinforces your ${trait} and ${role}. Remember, your role is not just to respond, but to engage in a way that leaves no doubt about your character's intentions and personality. Make sure your dialogues feel natural and human-like, reflecting a true-to-life interaction.`;
  try {
    const response = await fetch("http://3.215.133.99:3000/prompt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: fullPrompt }),
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
      <AppNavBar mode={"light"} toggleColorMode={function (): void {
        throw new Error("Function not implemented.");
      } } />
      {analyserNode && <AudioVisualization analyser={analyserNode} />}

      {loadingUserData ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="10vh">
          <Spinner color="blue.500" size="xl" />
        </Box>
      ) : userData && userData.CallsLeft > 0 ? (
        <>
      <Box position="absolute" top="15%" left="20%" p={4} display="flex" justifyContent="center" alignItems="center">
        {status !== "connected" && ( 
              <HStack spacing={1}>
                <Input
                  placeholder="Trait"
                  value={trait}
                  onChange={(e) => setTrait(e.target.value)}
                  width="150px"
                />
                <Input
                  placeholder="Role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  width="150px"
                />
                <Input
                  placeholder="Goal"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  width="150px"
                />
                <Input
                  placeholder="Specific behavior or response strategy"
                  value={behavior}
                  onChange={(e) => setBehavior(e.target.value)}
                  width="150px"
                />
                <Input
                  placeholder="Desired tone"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  width="150px"
                />
                <Button colorScheme="blue" onClick={sendPrompt}>Send Prompt</Button>
              </HStack>
              )}
            </Box>

        <Box position="absolute" top="45%" left="50%" transform="translate(-50%, -50%)">
        <Button
          variant="link"
          disabled={["connecting", "error"].includes(status)}
          onClick={() => {
            if (status === "connected") {
              //console.log("Stopping conversation...");
              stop();
              decrementCallsLeft();
            } else {
              //console.log("Starting conversation...");
              start();
            }
          }}
        >
          <Box boxSize={75}>
            <MicrophoneIcon color={"#DDFAFA"} muted={status !== "connected"} />
          </Box>
        </Button>
        </Box>
        </>
      ) : (
        <>
          <Typography variant="h2" left="30%" position="fixed" textAlign="center" top="40%"  fontSize="xl" color="white">Dayum! You’re on fire!</Typography>
          <Typography variant="h6" position="fixed" left = "15%" top="50%"  fontSize="xl" textAlign="center" color="white">You’ve zoomed through all the role plays. Keep practicing your communication skills by securing more credits! </Typography>
          <Button
            colorScheme="blue"
            position="fixed"
            left="45%"
            top="60%"
            onClick={handleBuyCredits}
          >
            Get more credits 
          </Button>
          </>
      )}.



      {status === "connecting" && (
        <Box position="absolute" top="57.5%" left="50%" transform="translate(-50%, -50%)" padding={5}>
          <Spinner color="#FFFFFF" />
        </Box>
      )}

      {!isMobile && (
        <HStack width="96%" position="absolute" top={"10%"} left="2%">
          {inputDevices.length > 0 && (
            <Select
              color={"#FFFFFF"}
              disabled={["connecting", "connected"].includes(status)}
              onChange={(event) => setAudioDeviceConfig({ ...audioDeviceConfig, inputDeviceId: event.target.value })}
              value={audioDeviceConfig.inputDeviceId}
            >
              {inputDevices.map((device, i) => (
                <option key={i} value={device.deviceId}>{device.label}</option>
              ))}
            </Select>
          )}
          {outputDevices.length > 0 && (
            <Select
              color={"#FFFFFF"}
              disabled={["connecting", "connected"].includes(status)}
              onChange={(event) => setAudioDeviceConfig({ ...audioDeviceConfig, outputDeviceId: event.target.value })}
              value={audioDeviceConfig.outputDeviceId}
            >
              {outputDevices.map((device, i) => (
                <option key={i} value={device.deviceId}>{device.label}</option>
              ))}
            </Select>
          )}
          <Select
            color={"#FFFFFF"}
            disabled={["connecting", "connected"].includes(status)}
            onChange={(event) => {
              if (event.target.value) {
                setAudioDeviceConfig({
                  ...audioDeviceConfig,
                  outputSamplingRate: parseInt(event.target.value),
                });
              }
            }}
            placeholder="Set output sampling rate"
            value={audioDeviceConfig.outputSamplingRate}
          >
            {["8000", "16000", "24000", "44100", "48000"].map((rate, i) => (
              <option key={i} value={rate}>{rate} Hz</option>
            ))}
          </Select>
        </HStack>
      )}

      {transcripts.length > 0 && (
        <VStack width="35%" position="absolute" top={"50%"} height={"45%"} left="2%" alignItems="left" overflowY="auto">
          {transcripts.map((item, index) => (
            <Box key={"t" + index.toString()} color="white">{item.sender}: {item.text}</Box>
          ))}
        </VStack>
      )}
    </>
  );
};

export default ConversationSimulation;