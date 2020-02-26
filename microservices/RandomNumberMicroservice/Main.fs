module Main

open System
open System.Collections.Generic
open System.Text

open RabbitMQ.Client
open MongoDB.Driver
open MongoDB.Bson

let startMsgQueueListener () = 
    let factory = ConnectionFactory()
    factory.HostName <- "localhost"
    use connection = factory.CreateConnection()
    use channel = connection.CreateModel()
    let queueResult = channel.QueueDeclare(queue = "rpc_queue", durable = true, exclusive = false, autoDelete = false, arguments = null)
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

let writeToMongo () = 
    let client = MongoClient()
    let database = client.GetDatabase("FirstRabbitMQApp")
    let collection = database.GetCollection<BsonDocument>("RandomNumbers");
    let values = Dictionary<string, obj>()
    values.["Value"] <- 123
    let document = BsonDocument(values)

    collection.InsertOne(document) 
        |> ignore
    
[<EntryPoint>]
let main argv =
    printfn "RandomNumberMicroservice running"
    writeToMongo ()
    startMsgQueueListener ()
    0 // return an integer exit code