import { Box, Button, Flex, FormControl, FormLabel, Input, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper } from "@chakra-ui/react"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setAlertChannels } from "redux/alertChannelSlide"
import { RootState } from "redux/store"

interface Props {
    channelId?: string,
    delay?: string
    randomId?: string
    isEdit?: boolean
}

export const AlertForm: React.FC<Props> = ({ channelId = "", delay = "0", randomId, isEdit = true }) => {
    const useDispath = useDispatch()
    const channels = useSelector((state: RootState) => state.alertChannel.channels)

    const [currChannelId, setCurrChannelId] = useState<string>(channelId)
    const [currDelay, setCurrDelay] = useState<string>(delay)
    const [currEdit, setCurrEdit] = useState<boolean>(isEdit)


    const handleDelete = () => {
        const newChannels = channels.filter(channel => channel.randomId !== randomId)
        useDispath(setAlertChannels(newChannels))
    }

    const handleEdit = () => {
        if (currEdit) {
            const newChannels = channels.map(channel => {
                return channel.randomId === randomId ? {id: currChannelId, alertDelay: currDelay, randomId} :channel
            })

            useDispath(setAlertChannels(newChannels))
        }

        setCurrEdit(!currEdit)
    }

    return <Flex flexDir={{ base: "column", md: "row" }} align="center" border="1px solid #ccc" borderRadius="1rem" p="2rem">
        <FormControl isRequired>
            <FormLabel htmlFor={`${randomId}-id`}>Nhập channel id: </FormLabel>
            <Input id={`${randomId}-id`} value={currChannelId} onChange={e => setCurrChannelId(e.target.value)} disabled={!currEdit} />
        </FormControl>

        <FormControl mx={5}>
            <FormLabel htmlFor={`${randomId}-delay`}>Nhập thời gian delay(s): </FormLabel>
            <NumberInput min={0}>
                <NumberInputField id={`${randomId}-delay`} value={currDelay} onChange={e => setCurrDelay(e.target.value)} disabled={!currEdit} />
                <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                </NumberInputStepper>
            </NumberInput>
        </FormControl>

        <Box>
            <Button w="6rem" colorScheme="red" onClick={handleDelete} >Xóa</Button>
            <Button w="6rem" colorScheme="teal" onClick={handleEdit} mt={3}>{currEdit ? "Lưu" : "Chỉnh sửa"}</Button>
        </Box>
    </Flex>
}