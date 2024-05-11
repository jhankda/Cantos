import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';


console.log(cloudinary.config(
    {
        secure:true
    }
).cloud_name);
console.log("--------------------")


const uploadOnCloudinary  = async (localFilePath ) => {

    try {
        const result  = await cloudinary.uploader.upload(localFilePath,{resource_type:"auto"});
        console.log("response from cloudinary",result);
    
        if(result){
            console.log("file uploaded successfully");
        }
        fs.unlinkSync(localFilePath)
        return null;
    } catch (error) {
        console.log("error uploading file",error);
        fs.unlinkSync(localFilePath)
        return null;
        
    }
}

export {uploadOnCloudinary};