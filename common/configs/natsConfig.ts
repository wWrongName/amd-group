const NATS_HOST = process.env.NATS_HOST ?? 'nats://localhost'
const NATS_PORT = process.env.NATS_PORT ?? '4222'

const natsUrl = `${NATS_HOST}:${NATS_PORT}`
const updTopic = 'currency_service.*'

export { natsUrl, updTopic }
