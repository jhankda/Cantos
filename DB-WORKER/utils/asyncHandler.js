const asyncHandler  = (asyncFunction) => {
    return  (data) => {
        return Promise.resolve(asyncFunction(data))
        .catch((error)=>{
            console.error('Error:',error)
            throw error;
        })
        
    }
}

export  {asyncHandler};