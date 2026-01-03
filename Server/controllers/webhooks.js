import { Webhook } from "svix";
import { User } from "../models/User.js";


// Api Controller Function to manage Webhook Clerk User with database
export const clerkWebhooks = async (req, res) => {
    try {
        // Create a Svix instance with clerk webhook secret
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        if (!whook) {
            return res.status(500).json({ message: "Missing webhook secret" });
        }

        //verfiying Headers 
        const payload = await whook.verify(req.body, {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        });

        // Getting Data Form reqest body
        const { data, type } = payload;

        //Switch Cases for different Event  
        switch (type) {
            case "user.created": {
                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    image: data.image_url,
                    resume: ''
                }
                await User.create(userData)
                res.json({})
                break;
            }

            case "user.updated": {
                const userData = {
                    email: data.email_addresses[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    image: data.image.url,
                }
                await User.findByIdAndUpdate(data.id,userData);
                res.json({})
                break;
            }

            case "user.deleted": {
                await User.findByIdAndDelete(data.id)
                res.json({})
                break;
            }
            default:
                break;
        }
    } catch (error) {
        console.log(error.message);
        res.json({success:false,message: 'Webhooks Error'})
    }
}