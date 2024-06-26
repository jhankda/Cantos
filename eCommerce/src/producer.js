import { createClient } from "redis";
import {v4 as uuidv4} from "uuid";

const client1  = createClient({
	url:"redis://redis:6379"})
const client2 = createClient({
	url:"redis://redis:6379"})

const pendingOperation = new Map()


client1.connect()
client2.connect()



export function addOperationinQ(userId, Action, Model, body){
    
    try {
        const operationId  = uuidv4()
        const objectData  = {Action, Model, body, userId, operationId}
        const data = JSON.stringify(objectData)
        console.log("23")
        console.log(data)
        client1.lPush('Submissions', data);
        console.log("error no buddy")
        return new Promise((resolve, reject)=> {
            pendingOperation.set(operationId, {resolve, reject}
            )
        })
        


    } catch (error) {
        console.error("THIS IS ERORRRRRRRRRRRR:",error)
        
    }

}

export async function handleResponse(){
    console.log("sampoooo hahahah")
    await client2.brPop('Results', 0).then((data)=> {
        console.log("halooooooooo")
        
        try{
            console.log("value of data",data)
            console.log(typeof data)

            const response = data.element
            const parseddata = JSON.parse(response)

            console.log(typeof parseddata)
            

            const { result , error } = parseddata
            const operationId = parseddata.operationId

            console.log("operationId",operationId)
            console.log("result",result)


            if(pendingOperation.has(operationId)){
                console.log("inside if and OPERATION ID IS ", operationId)
                const{ resolve,reject} = pendingOperation.get(operationId)
                if(error){
                    reject(error)
                }
                else{
                    resolve(result)
                }
                pendingOperation.delete(operationId)
            }
            handleResponse()
        }
        catch(err){
            console.log("Error occured while parsing data",err)
        }})

    
    console.log("1")
}

process.on('SIGTERM', async () => {
    console.log("redis should disconnect")
    client1.quit();
    console.log('Gracefully shut down');
    process.exit(0);
  });

