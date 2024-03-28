import { connect, Payload, NatsConnection } from 'nats'
import { natsUrl, updTopic } from '../../common/configs/natsConfig'
import { UpdateData } from '../interfaces/UpdateData'

/**
 * Establishes connection and sends a message to the NATS server with the given data.
 * @param currencyRatesUpdateData object with last currencies to update
 */
export async function sendCourseUpdate(currencyRatesUpdateData: UpdateData): Promise<void> {
    const nc = await connect({ servers: natsUrl })
    try {
        sendMessage(updTopic, currencyRatesUpdateData, nc)
    } catch (err) {
        console.error(err)
    } finally {
        nc.close()
    }
}

/**
 * Sends a message to the NATS server with the given data.
 * @param topic the topic on which to publish the message
 * @param data the data to be sent as the message payload
 * @param nc the NATS connection to use for sending the message
 */
function sendMessage(topic: string, data: UpdateData, nc: NatsConnection): void {
    const payload: Payload = JSON.stringify(data)
    nc.request(topic, payload)
    console.trace(`Send message on topic (${topic}): ${payload}`)
}
