class DBerror extends Error{
    constructor(
        statusCode,
        message = "something went Wrong",
        errors = [],
        stack = ""
    ){
        super(message)
        this.data = null
        this.statusCode = statusCode
        this.errors = errors
        this.success = false
        // this.stack  = stack
        this.message = message


        if(stack){
            this.stack = stack
        }else{
            Error.captureStackTrace(this, this.constructor)
        }
    }

    
}

export  {DBerror};