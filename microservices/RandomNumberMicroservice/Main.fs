module Main

open System
open System.Collections.Generic
open System.Text

open RabbitMQ.Client
open MongoDB.Driver
open MongoDB.Bson
open Microsoft.FSharp.Reflection

type RandomNumber = {
    Value: int;
}

let startMsgQueueListener () = 
    let factory = ConnectionFactory()
    factory.HostName <- "localhost"
    use connection = factory.CreateConnection()
    use channel = connection.CreateModel()
    //todo: if you use durable=true, there seem to always be leftover requests that get processed when you start the microservice. (even if you haven't made any requests yet)
    //  * you will have to investigate this issue if you need a durable queue
    //  * leftover requests exist even after going into the RabbitMQ management console and purging the queue or deleting the queue!
    let queueResult = channel.QueueDeclare(queue = "rpc_queue", durable = false, exclusive = false, autoDelete = false, arguments = null)
    let consumer = QueueingBasicConsumer(channel)
    
    channel.BasicConsume(queue = "rpc_queue", autoAck = false, consumer = consumer) |> ignore
    let random = Random()
    while true do   
        let ea = consumer.Queue.Dequeue() //:> BasicDeliverEventArgs
        let body = ea.Body
        let props = ea.BasicProperties
        let replyProps = channel.CreateBasicProperties()
        replyProps.CorrelationId <- props.CorrelationId
        let message = Encoding.UTF8.GetString(body)
        let responseValue = random.Next()
        let responseString = "{\"data\":" + responseValue.ToString() + "}"
        let responseBytes = Encoding.UTF8.GetBytes(responseString)
        let addr = PublicationAddress(exchangeName = "", exchangeType = ExchangeType.Direct, routingKey = props.ReplyTo)
        channel.BasicPublish(addr = addr, basicProperties = replyProps, body = responseBytes)

        printfn "received %s" message
        printfn "publishing: %s" responseString

let convertToDictionary (record) =
    seq {
        //todo: load test to see how slow Reflection is
        //  * cache FSharpType.GetRecordFields and check how fast it is
        //  * compare to hardcoded conversion to dictionary
        for prop in FSharpType.GetRecordFields(record.GetType()) -> 
        prop.Name, prop.GetValue(record)
    } |> dict

let writeToMongo () = 
    let client = MongoClient()
    let database = client.GetDatabase("FirstRabbitMQApp")
    let collection = database.GetCollection<BsonDocument>("RandomNumbers");
    let record = { Value = 456 }
    let document = 
        record 
        |> convertToDictionary 
        |> BsonDocument

    collection.InsertOne(document) 
        |> ignore
    
[<EntryPoint>]
let main argv =
    printfn "RandomNumberMicroservice running"
    writeToMongo ()
    startMsgQueueListener ()
    0 // return an integer exit code