module RandomNumbers

open Microsoft.AspNetCore.Http

let insertOne (httpContext:HttpContext) =
    httpContext.Response.WriteAsync("Hello World!")

