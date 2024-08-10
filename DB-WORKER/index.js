import connectDB from "./db/index.js";
import dotenv from 'dotenv';
import { createClient,  } from 'redis';
import { aggregationLine, comparePass, convertKeysToObjectId, creation, find, getAccessToken, getRefreshToken, ifexists, ifexistsById, updateById, updateOne, verifyAccessToken, verifyRefreshToken } from "./src/index.js";
import { DBerror } from "./utils/DBerror.js";

dotenv.config({
    path: './env'
});
connectDB();


const client = createClient({
    url:"redis://redis:6379"
}); 

async function DBPickup() {
      try {
        await client.connect();
        console.log("\n DB ALPHA IS Connected to the Q");
        while (true) {
            console.log("again waiting for the data")
            const parsedata = await client.brPop('Submissions', 0)

            const data = JSON.parse(parsedata.element);
            console.log(`\n DB ALPHA is processing the data: ${data}`);


            try { 
                let result;
                data.mongoose_Object?convertKeysToObjectId(data.body,data.mongoose_Object):null;
                switch (data.Action) {
                    case "CREATE":
                        result = await creation(data);
                        break;
                    case "FIND":
                        result = await find(data);
                        break;
                    case "FINDONE":
                        result  = await ifexists(data);
                        break;
                    case "FINDBYID":
                        result  = await ifexistsById(data);
                        break;
                    case "COMPARE_PASS": 
                        result = await comparePass(data);
                        break;
                    case "UPDATEONE":
                        result = await updateOne(data);
                        break;
                    case "GENRATE-ACCESS-TOKEN":
                        result  = await getAccessToken(data);
                        break;
                    case "GENRATE-REFRESH-TOKEN":
                        result = await getRefreshToken(data);
                        break;
                    case "VERIFY-ACCESS-TOKEN":
                        result = await verifyAccessToken(data);
                        break;
                    case "VERIFY-REFRESH-TOKEN":
                        result = await verifyRefreshToken(data);
                        break;
                    case "UPDATEBYID":
                        result = await updateById(data);
                        break;
                    case "AGGREGATE":
                        result = await aggregationLine(data);
                        break;
                    default:
                        console.log("Invalid action");
                        throw new DBerror(500, "Invalid action");
                        break;
                }
                const operationId = data.operationId
                if(result instanceof DBerror){
                    console.error(`Error processing data:`,result);
                    client.lPush('Results', JSON.stringify({ operationId, error: result.message, code: result.statusCode }));
                }
                else{ 
                    console.log(`\n DB ALPHA has processed the data: ${JSON.stringify(data)}`); 
                    client.lPush('Results', JSON.stringify({ operationId, result }));
                }
            } catch (error) {
                console.error('Error in processing the data', error);
                client.lPush('Results', JSON.stringify({ operationId, error: error.message }));
            }
        } 
    } catch (err) {
        console.error('Error in DBPickup function', err);
    }
}

DBPickup().catch((err) => {
    console.error('Error starting DBPickup function', err);
});

process.on('SIGTERM', async () => {
    client.quit();
    console.log('Gracefully shut down');
    process.exit(0);
});
