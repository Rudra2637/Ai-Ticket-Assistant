import { inngest } from "../client.js";
import { NonRetriableError } from "inngest";
import { sendMail } from "../../utils/mailer.js";
import { User } from "../../models/user.js";


const onUserSignUp = inngest.createFunction(
    {id:"on-user-signup"},
    {event:"user/signUp"},
    async({event,step}) => {
        try {
            const {email} = event.data

            const userCheck = await step.run("check-user-email",async() => {
                const validUser = await User.findOne({email})
                if(!validUser)throw new NonRetriableError("User no longer exists in our database")
                else return validUser
            })

            await step.run("send-welcome-email",async () => {
                const subject = 'Welcome to the app'
                const text = `Hi
                \n\n
                Thanks for signing up on our app.We are glad to have you onboard!
                `
                await sendMail(userCheck.email,subject,text)
            })
            return {success:true}
        } catch (error) {
            console.error("Error in inngest createFunction ",error.message)
            return {success:false}
        }
    }
)