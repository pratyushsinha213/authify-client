import { mailtrapClient, sender } from './mailtrap.config.js';
import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from './emailTemplates.js';
export const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = [{ email }];

    try {
        const emailResponse = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Verify your email address.",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verification"
        });

        console.log(`Email sent to ${email} successfully: ${emailResponse.message_ids}.`);
    } catch (error) {
        console.log(`Failed to send email to ${email}: ${error}.`);
        throw new Error("Failed to send verification email.");
    }
}

export const sendWelcomeEmail = async (email, name) => {
    const recipient = [{ email }];
    try {
        const emailResponse = await mailtrapClient.send({
            from: sender,
            to: recipient,
            template_uuid: "ad708bf7-64b7-41ea-8380-63fe45f840c5",
            template_variables: {
                "company_info_name": "Authify",
                "name": name
            }
        });
        console.log(`Welcome email sent to ${email} successfully: ${emailResponse.message_ids}.`);
    } catch (error) {
        console.log(`Failed to send welcome email to ${email}: ${error.message}.`);
        throw new Error("Failed to send welcome email.");
    }
}

export const sendPasswordResetEmail = async (email, resetPasswordURL) => {
    try {
        const recipient = [{ email }];

        const emailResponse = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Reset your password.",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetPasswordURL),
            category: "Password Reset"
        });
        console.log(`Password reset email sent to ${email} successfully: ${emailResponse.message_ids}.`);
    } catch (error) {
        console.log(`Failed to send password reset email to ${email}: ${error.message}.`);
        throw new Error("Failed to send password reset email.");
    }
}

export const sendPasswordResetConfirmEmail = async (email) => {
    const recipient = [{ email }];

    try {
        const emailResponse = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Password Reset Successful.",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password Reset Confirmation"
        });
        console.log(`Password reset confirmation email sent to ${email} successfully: ${emailResponse.message_ids}.`);
    } catch (error) {
        console.log(`Failed to send password reset confirmation email to ${email}: ${error.message}.`);
        throw new Error("Failed to send password reset confirmation email.");
    }
}