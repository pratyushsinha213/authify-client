import { MailtrapClient } from "mailtrap";
import { MAILTRAP_SENDER_EMAIL, MAILTRAP_TOKEN } from "../env.js";

export const mailtrapClient = new MailtrapClient({
    token: MAILTRAP_TOKEN,
});

export const sender = {
    email: MAILTRAP_SENDER_EMAIL,
    name: "Pratyush Sinha",
};

