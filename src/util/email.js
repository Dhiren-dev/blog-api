import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'caleigh.emard19@ethereal.email',
        pass: '9Kx49SEr1AKATvZuTt'
    }
});

const endResetPasswordEmail = async (email ,resetToken, req) => {
    try {
        const mailOptions = {
            from: "ressie.oberbrunner67@ethereal.email",
            to: email,
            subject: "Password Reset",
            html: `<p>You are receiving this email because you (or someone else) have requested to reset the password for your account.</p>
                  <p>Please click on the following link, or paste it into your browser to complete the process:</p>
                  <p><a href="${req.protocol}://${req.get('host')}/auth/reset-password/${resetToken}">Reset Password Link</a></p>
                  <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`
        };

        const info = await transporter.sendMail(mailOptions);

        return { success: true, messageId: info.messageId, previewUrl: nodemailer.getTestMessageUrl(info) };
    } catch (err) {
        return { success: false, error: "Failed to send email. Please try again later." };
    }
};

export default endResetPasswordEmail;