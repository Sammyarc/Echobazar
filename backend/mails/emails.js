import createTransporter from './email.config.js'; // Import the transporter
import {
  WELCOME_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
} from './emailTemplates.js'; // Import your email templates

// Send Verification Email
export const sendVerificationEmail = async (email, name, verificationToken) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Verify your email',
      html: VERIFICATION_EMAIL_TEMPLATE
        .replace('{name}', name)
        .replace('{verificationCode}', verificationToken),
    };

    const transporterInstance = await createTransporter();
    await transporterInstance.sendMail(mailOptions);

    console.log('Verification email sent successfully.');
  } catch (error) {
    console.error('Error sending verification email:', error);
  }
};

// Send Welcome Email
export const sendWelcomeEmail = async (email, name) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Welcome to Echobazar',
      html: WELCOME_EMAIL_TEMPLATE.replace('{name}', name),
    };

    const transporterInstance = await createTransporter();
    await transporterInstance.sendMail(mailOptions);

    console.log('Welcome email sent successfully.');
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
};

// Send Password Reset Email
export const sendPasswordResetEmail = async (email, name, resetURL) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Reset your password',
      html: PASSWORD_RESET_REQUEST_TEMPLATE
        .replace('{name}', name)
        .replace('{resetURL}', resetURL),
    };

    const transporterInstance = await createTransporter(); 
    await transporterInstance.sendMail(mailOptions);

    console.log('Password reset email sent successfully.');
  } catch (error) {
    console.error('Error sending password reset email:', error);
  }
};

// Send Password Reset Success Email
export const sendResetSuccessEmail = async (email, name) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Password Reset Successful',
      html: PASSWORD_RESET_SUCCESS_TEMPLATE.replace('{name}', name),
    };

    const transporterInstance = await createTransporter(); 
    await transporterInstance.sendMail(mailOptions);

    console.log('Password reset success email sent successfully.');
  } catch (error) {
    console.error('Error sending password reset success email:', error);
  }
};
