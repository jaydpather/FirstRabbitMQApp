module Main

open System
open System.Text
open System.Collections.Concurrent
open Fable.Import

open RabbitMQ.Client
open RabbitMQ.Client.Events

type RPCInfo = {
    connection : IConnection;
    channel : IModel;
    replyQueueName : string;
    consumer : EventingBasicConsumer;
    respQueue : BlockingCollection<string>;
    props : IBasicProperties;
}

let onMessageReceived (respQueue:BlockingCollection<string>) correlationId (ea:BasicDeliverEventArgs) = 
    let response = Encoding.UTF8.GetString(ea.Body)
    if(ea.BasicProperties.CorrelationId = correlationId) then
        respQueue.Add(response)


let createClient = 
    let factory = new ConnectionFactory()
    factory.HostName <- "localhost" //todo: does F# have object initializer?
    let respQueue = new BlockingCollection<string>()
    let connection = factory.CreateConnection()
    let channel = connection.CreateModel()
    let replyQueueName = channel.QueueDeclare().QueueName
    let consumer = new EventingBasicConsumer(channel)
    let props = channel.CreateBasicProperties();
    props.CorrelationId <- Guid.NewGuid().ToString()
    props.ReplyTo <- replyQueueName
    consumer.Received.Add(onMessageReceived respQueue props.CorrelationId)

    let rpcInfo = {
        connection = connection;
        channel = channel;
        replyQueueName = replyQueueName;
        consumer = consumer;
        respQueue = respQueue;
        props = props;
    }
    rpcInfo

let public callRPC msg =
    printfn "callRPC: %s" msg