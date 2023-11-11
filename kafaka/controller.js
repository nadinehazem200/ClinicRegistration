import kafkaConfig from "./config.js";


const sendMessageToKafka = async (req, res) => {
    try {

        const { message } = req.body
        const kafkaConfig = new kafkaConfig()
        const messages = [
            { key: 'key1', value: message }
        ]
        kafkaConfig.produce("my-topic", message);

        res.status(200).json({
            status: "OK!",
            message: "Message successfully send!"
        })

    } catch (err) {
        console.log(err)
    }
}
const controllers = { sendMessageToKafka }

export default controllers;