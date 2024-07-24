import { createClient } from "redis";
import {v4 as uuidv4} from "uuid";
import { ApiError } from "./utils/ApiError.js";

const client1  = createClient({
    url:"redis://redis:6379"
})
const client2 = createClient({
    url:"redis://redis:6379"
})

const pendingOperation = new Map()

client1.connect()
client2.connect()


export function addOperationinQ(userId, Action, Model, body){
    
    try {
        const operationId  = uuidv4()
        const objectData  = {Action, Model, body, userId, operationId}
        const data = JSON.stringify(objectData)
        console.log("SENDING Data ::",data)
        client1.lPush('Submissions', data);
        console.log("\n Data sent to redis")


        return new Promise((resolve, reject)=> {
            pendingOperation.set(operationId, {resolve, reject}
            )
        })
        


    } catch (error) {
        console.error("ERROR in sending operation data",error)
        throw new ApiError(error,"Unexpected Error", 400)
        return Promise.reject(error);
    }

}

export async function handleResponse(){
    console.log("handleResponse function called")
    await client2.brPop('Results', 0).then((data)=> {
        
        try{
            console.log("RECIEVED DATA,")
            

            const response = data.element
            const parseddata = JSON.parse(response)

            console.log("\nDATATYPE :: ",typeof data, "\nParsed Data :: ",parseddata)
            

            const { result , error } = parseddata
            const operationId = parseddata.operationId
            console.log("operationId :: ",operationId)
            console.log("Error? :: ",error)
            console.log("Result? :: ",result)


            if(pendingOperation.has(operationId)){
                console.log("mapped operation ID in pending Operations:", operationId)
                const{ resolve,reject} = pendingOperation.get(operationId)
                if(error){
                    // throw new ApiError(400,error)
                    reject(new Error(error));

                } 
                else{
                    resolve(result)
                }
                pendingOperation.delete(operationId)
            }
            
            handleResponse()
        }
        catch(err){
            console.error("ERROR while recieving Data",err.message)
        }})

    
    console.log("1")
}

process.on('SIGTERM', async () => {
    console.log("redis should disconnect")
    client1.quit();
    console.log('Gracefully shut down');
    process.exit(0);
  });

