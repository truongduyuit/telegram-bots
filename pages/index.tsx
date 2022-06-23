import { Box, Button, Flex, FormControl, FormLabel, Input, InputGroup, InputRightElement, SimpleGrid, useToast } from "@chakra-ui/react";
import { AlertForm } from "components";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAlertChannels } from "redux/alertChannelSlide";
import { RootState } from "redux/store";
import { generate } from "randomstring";
import axios from "axios";

export default function Home() {
  const [serverUrl, setServerUrl] = useState<string>("")
  const [showServerUrl, setShowServerUrl] = useState(false)
  const [showBotToken, setShowBotToken] = useState(false)
  const [botToken, setBotToken] = useState<string>("")

  const toast = useToast()
  const dispatch = useDispatch()
  const channels = useSelector((state: RootState) => state.alertChannel.channels)

  const addChannel = () => {
    const newChannel = [...channels]
    newChannel.push({ id: "", alertDelay: "0", randomId: generate({ length: 10 }) })
    dispatch(setAlertChannels(newChannel))
  }

  const startTool = async () => {
    let data = {} as any

    channels.map(channel => {
      const { alertDelay, id } = channel
      if (id !== "") {
        data = {
          ...data, [id]: {
            id, alertDelay
          }
        }
      }

    })

    const result = await axios.post("/api", {
      botToken, serverUrl, channels: { ...data }
    })

    if (result.data.ok) {
      toast({
        title: `Tool start`,
        isClosable: true,
        duration: 5000,
        position: "bottom-right",
        status: "success"
      })
    } else {
      toast({
        title: `Start error`,
        isClosable: true,
        duration: 5000,
        position: "bottom-right",
        status: "error"
      })
    }
  }

  return (
    <Flex justify="center" w="100%" h="100vh">
      <Flex flexDir="column">
        <Box textAlign="center" my={5} fontSize="1.8rem" fontWeight="bold">Telegram Bot Signals</Box>

        <SimpleGrid columns={1} spacingY={5} w={{ base: "20rem", md: "40rem" }}>
          <FormControl>
            <FormLabel htmlFor='bot-token'>Nhập Server Url: </FormLabel>
            <InputGroup size='md'>
              <Input
                pr='4.5rem'
                type={showServerUrl ? 'text' : 'password'}
                placeholder='Enter token'
                id="bot-token"
                value={serverUrl}
                onChange={e => setServerUrl(e.target.value)}
                required={true}
              />
              <InputRightElement width='4.5rem'>
                <Button h='1.75rem' size='sm' onClick={() => setShowServerUrl(!showBotToken)}>
                  {showServerUrl ? 'Hide' : 'Show'}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <FormControl>
            <FormLabel htmlFor='bot-token'>Nhập bot token: </FormLabel>
            <InputGroup size='md'>
              <Input
                pr='4.5rem'
                type={showBotToken ? 'text' : 'password'}
                placeholder='Enter token'
                id="bot-token"
                value={botToken}
                onChange={e => setBotToken(e.target.value)}
              />
              <InputRightElement width='4.5rem'>
                <Button h='1.75rem' size='sm' onClick={() => setShowBotToken(!showBotToken)}>
                  {showBotToken ? 'Hide' : 'Show'}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <br />
          {
            channels.map(channel => {
              const { id, randomId, alertDelay } = channel
              return <AlertForm key={randomId} channelId={id} delay={alertDelay} randomId={randomId} isEdit={id === "" ? true : false} />
            })
          }

          <Flex justify="space-between">
            <Button colorScheme="teal" onClick={addChannel}>Thêm channel</Button>
            <Button colorScheme="teal" onClick={startTool}>Bắt đầu</Button>
          </Flex>
        </SimpleGrid>
      </Flex>
    </Flex>
  )
}
