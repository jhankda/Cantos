const TokenSheet = (username,token)=>{
    return(
        
     
     
      
        `<body style="font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0;">
        
        <div style="max-width: 600px; margin: 20px auto; background-color: #000000; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #339f43;">OTP Verification</h2>
            <p style="color: #666666;">${username} !Your One-Time Password (OTP) for verification is:</p>
            <p style="font-size: 24px; font-weight: bold; color: #007bff;">${token}</p>
            <p style="color: #666666;">Please use this OTP to verify your email address.</p>
            <a href="http://localhost:5555/api/v1/User/registerUser/${token}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 4px; margin-top: 20px;">Verify Email</a>
        </div>
        
        </body>`
       
        )
}

const newLoginSheet = (firstName, os,platform,browser ) => {
   
    return (`<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
        <div style="background-color: #ffffff; margin: 20px auto; padding: 20px; border-radius: 10px; max-width: 600px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; border-bottom: 1px solid #e4e4e4; padding-bottom: 10px; margin-bottom: 20px;">
                <img src="your-logo-url.png" alt="Company Logo" style="max-width: 150px;">
            </div>
            <div style="text-align: left; line-height: 1.6;">
                <h1 style="font-size: 24px; margin-bottom: 10px;">New Login Alert</h1>
                <p>Hello ${firstName.toUpperCase()},</p>
                <p>Hey ${firstName} We noticed a new login to your account. Here are the details:</p>
                <div style="background-color: #f9f9f9; padding: 10px; border: 1px solid #e4e4e4; border-radius: 5px; margin-bottom: 20px;">
                    <p style="margin: 5px 0;"><strong>Browser:</strong> ${browser}</p>
                    <p style="margin: 5px 0;"><strong>Operating System:</strong> ${os}</p>
                    <p style="margin: 5px 0;"><strong>Platform:</strong> ${platform}</p>
                    
                    <p style="margin: 5px 0;"><strong>Login Time:</strong> ${new Date().toLocaleString()}</p>
                </div>
                <p>If this was you, no further action is required. If you suspect any suspicious activity, please <a href="your-support-url" style="color: #1a73e8;">contact support</a> immediately.</p>
                <p>Thank you for using our service!</p>
                <p>Best regards,<br>The [Company Name] Team</p>
            </div>
            <div style="text-align: center; color: #888888; font-size: 12px; margin-top: 20px;">
                <p>&copy; 2024 Cantos. All rights reserved.</p>
            </div>
        </div>
    </body>`)
    
    
    }


export {TokenSheet, newLoginSheet}