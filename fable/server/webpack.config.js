var path = require("path");
 
module.exports = {
    mode: "development",
    entry: "C:\\Users\\jaydp\\Documents\\Github\\RabbitMQ\\FirstRabbitMQApp\\fable\\server\\src\\Main\\Main.fsproj",
    output: {
        path: "C:\\Users\\jaydp\\Documents\\Github\\RabbitMQ\\FirstRabbitMQApp\\fable\\server\\public",
        filename: "server-fable.js",
    },
    devServer: {
        contentBase: "public",
        port: 8080,
    },
    module: {
        rules: [{
            test: /\.fs(x|proj)?$/,
            use: "fable-loader"
        }]
    }
}