module Main

open System
open System.Text
open System.Collections.Concurrent

open RabbitMQ.Client
open RabbitMQ.Client.Events

// let onConsumerReceived = fun (ea:BasicDeliverEventArgs) ->
//         let body = ea.Body 
//         let message = Encoding.UTF8.GetString(body)
//         printfn "received %s" message

let startMsgQueueListener () = 
    let factory = new ConnectionFactory()
    factory.HostName <- "localhost"
    use connection = factory.CreateConnection()
    use channel = connection.CreateModel()
    let queueResult = channel.QueueDeclare(queue = "rpc_queue", durable = true, exclusive = false, autoDelete = false, arguments = null)
    let consumer = QueueingBasicConsumer(channel)
    
    //System.Threading.Thread.Sleep(100)
    
    //consumer.Received.Add onConsumerReceived
    channel.BasicConsume(queue = "rpc_queue", autoAck = false, consumer = consumer) |> ignore
    while true do   
        let ea = consumer.Queue.Dequeue() //:> BasicDeliverEventArgs
        let body = ea.Body
        let message = Encoding.UTF8.GetString(body)
        printfn "received %s" message

    //System.Threading.Thread.Sleep(100)

[<EntryPoint>]
let main argv =
    printfn "RandomNumberMicroservice running"
    startMsgQueueListener ()
    // while(true) do 
    //     System.Threading.Thread.Sleep(100)
    Console.ReadKey() |> ignore
    0 // return an integer exit code