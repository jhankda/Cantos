import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
// import { url } from "inspector";




console.log(cloudinary.config().cloud_name)


const uploadOnCloudinary = async (localFilePath ) => {

    try {
        const result  = await cloudinary.uploader.upload(localFilePath,
            {resource_type:"auto",folder:"product"});
        console.log("response from cloudinary",result.url);
    
        if(result){
            console.log("file uploaded successfully");
        }
        fs.unlinkSync(localFilePath) 
        return result?.url;
    } catch (error) {
        console.log("error uploading file",error);
        fs.unlinkSync(localFilePath)
        return null;
        
    }
}

export {uploadOnCloudinary};