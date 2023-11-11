import { Kafka } from "kafkajs";

class kafkaConfig{
    constructor(){
        this.Kafka = new Kafka({
            clientId: "nodejs-kafka",
            brokers: ['localhost:9093']
        })
        this.producer = this.Kafka.producer();
        this.consumer = this.Kafka.consumer({groupId: 'test-group'})
    }

    async produce(topic,messages){
        try{

            await this.producer.connect()
            await this.producer.send({
                topic: topic,
                messages: messages
            })

        }catch(err){
            console.log(err)
        }finally{
            await this.producer,disconnect()
        }
    }

    async consume(topic,messages){
        try{

            await this.consumer.connect()
            await this.consumer.subscribe({
                topic: topic,
                fromBeginning: true
            })
            await this.consumer.run({
                eachMessage: async ({topic,partiion,message}) =>{
                const value = message.value.toString()
                callback(value)
            }

        })
    }catch(err){
            console.log(err)
        }
    }
    
}
export default kafkaConfig