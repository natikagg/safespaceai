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
import increaseUsage from "../UserManagement/increaseUsage";

interface UserData {
  CallsLeft: number;       // Assuming 'Decimal' is just a numeric value
  userID: string;
  Email: string;
  Name: string;
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
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loadingUserData, setLoadingUserData] = useState(true); // State to manage loading status
  const [trait, setTrait] = useState("Stubborn");
  const [role, setRole] = useState("Manager");
  const [scenario, setScenario] = useState("Ask for a raise");
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
     backendUrl: "wss://backend.safespaceai.com/conversation",
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
  var fullPrompt = "";
  if (scenario === "Ask for a raise" )
    {
      fullPrompt = `Imagine you are a ${trait} ${role}. You find yourself in a scenario where one of your subordinates, who believes they have been performing exceptionally, approaches you to discuss a potential raise. Your task is to infer your primary objective based on your character's trait and role, and the context of this personnel and financial management challenge.
      When interacting, focus on your defined trait and the dynamic role to convincingly portray your character. Ensure your communication aligns with someone who embodies the archetype of ${trait} ${role}, making all responses in-character and realistic.
      Throughout the interaction, maintain a tone and use language that reinforces your character's specific traits and professional role. Engage in a way that clearly conveys your character's intentions and personality based on the scenario. Your dialogue should feel natural and human-like, reflecting a true-to-life interaction where you address the subordinate's request within the framework of your role's expectations and responsibilities.`;
    }
  else if (scenario === "Talk about scope creep")
    {
      fullPrompt = `Imagine you are a ${trait} ${role}. You find yourself in a scenario where a colleague approaches you to discuss scope creep in a current project. Your task is to infer your primary objective based on your character's trait and role, and the context of managing project boundaries and expectations effectively.
      When interacting, focus on your defined trait and the dynamic role to convincingly portray your character. Ensure your communication aligns with someone who embodies the archetype of ${trait} ${role}, making all responses in-character and realistic.
      Throughout the interaction, maintain a tone and use language that reinforces your character's specific traits and professional role. Engage in a way that clearly conveys your character's intentions and personality based on the scenario. Your dialogue should feel natural and human-like, reflecting a true-to-life interaction where you address the issue of scope creep thoughtfully, considering the project's goals and constraints.`;
    }
  else if (scenario === "Address extra workload")
    {
      fullPrompt = `Imagine you are a ${trait} ${role}. You find yourself in a scenario where one of your subordinates approaches you to talk about their current workload, expressing concerns over being overwhelmed. Your task is to infer your primary objective based on your character's trait and role, and the context of managing team capacity and morale effectively.
      When interacting, focus on your defined trait and the dynamic role to convincingly portray your character. Ensure your communication aligns with someone who embodies the archetype of ${trait} ${role}, making all responses in-character and realistic.
      Throughout the interaction, maintain a tone and use language that reinforces your character's specific traits and professional role. Engage in a way that clearly conveys your character's intentions and personality based on the scenario. Your dialogue should feel natural and human-like, reflecting a true-to-life interaction where you address the subordinate's concerns with empathy and pragmatism, balancing the needs of the individual with the requirements of the organization.`;
    }
  try {
    const response = await fetch("https://backend.safespaceai.com/prompt", {
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
      ) : userData.CallsLeft > 0 ? (
        <>
      <Box position="absolute" top="15%" left="20%" p={4} display="flex" justifyContent="center" alignItems="center">
        {status !== "connected" && ( 
              <HStack spacing={1}>
                <Select placeholder={trait} value={trait} onChange={(e) => setTrait(e.target.value)} width="200px">
                  <option value="Stubborn">Stubborn</option>
                  <option value="Friendly">Friendly</option>
                  <option value="Frustrated">Frustrated</option>
                  <option value="Stressed">Stressed</option>
                  <option value="Reserved">Reserved</option>
                  <option value="Skeptical">Skeptical</option>
                </Select>
                <Select placeholder={role} value={role} onChange={(e) => setRole(e.target.value)} width="200px">
                  <option value="Manager">Manager</option>
                  <option value="Coworker">Coworker</option>
                </Select>
                <Select placeholder={scenario} value={scenario} onChange={(e) => setScenario(e.target.value)} width="200px">
                  <option value="Ask for a raise">Ask for a raise</option>
                  <option value="Talk about scope creep">Talk about scope creep</option>
                  <option value="Address extra workload">Address extra workload</option>
                </Select>
              </HStack>
              )}
            </Box>

        <Box position="absolute" top="45%" left="50%" transform="translate(-50%, -50%)">
        <Button
          disabled={["connecting", "error"].includes(status)}
          onClick={() => {
            if (status === "connected") {
              //console.log("Stopping conversation...");
              stop();
              increaseUsage();
            } else {
              //console.log("Starting conversation...");
              sendPrompt();
              start();
            }
          }}
        >
          <Box boxSize={75}>
            <MicrophoneIcon color={"#DDFAFA"} muted={status !== "connected"} />
          </Box>
        </Button>
        </Box>
        <HStack
        justifyContent="center" spacing="50px" width="full" position="fixed" bottom="150px" left="40%"
        >
          <Button 
            colorScheme="blue"
            onClick={() => {
              sendPrompt();
              start();
            }}
          >
            Start Call
          </Button>
          <Button
          colorScheme="blue" 
          onClick={() => {
            stop();
            increaseUsage();
          }
          }
          >
          End Call
          </Button>
        </HStack>
        </>
      ) : (
        <>
          <Typography variant="h2" left="30%" position="fixed" textAlign="center" top="40%"  fontSize="xl" color="white">Dayum! You’re on fire!</Typography>
          <Typography variant="h6" position="fixed" left = "15%" top="50%"  fontSize="xl" textAlign="center" color="white">You’ve zoomed through all the role plays. Keep practicing on your communication skills by securing more credits! </Typography>
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
            disabled={true}
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