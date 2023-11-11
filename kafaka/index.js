import bodyParser from "body-parser";
import express from "express";
import controllers from "./controller";
import kafkaConfig from "./config";

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const app = express()
const jsonParser = bodyParser.json()

app.post('/api/send', jsonParser, controllers.sendMessageToKafka)

//consume from topic "test-topic"
const kafkaConfig = new kafkaConfig()
kafkaConfig.consume('my-topic', (value)=>{
    console.log(value)
})

app.listen(8080,()=>{
    console.log("server is running on port 8080.")
})