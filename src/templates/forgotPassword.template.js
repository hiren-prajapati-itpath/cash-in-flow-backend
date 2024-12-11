const getForgotPasswordEmail = (redirectUrl, resetPasswordToken) => {
  return `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Reset Password</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
                color: #333;
            }
            .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                background: #fff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                padding-bottom: 20px;
                border-bottom: 1px solid #ddd;
            }
            .btn {
                display: inline-block;
                background-color: #007BFF;
                color: #fff;
                padding: 10px 20px;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                margin-top: 20px;
                text-align: center;
            }
            .footer {
                text-align: center;
                font-size: 12px;
                color: #777;
                margin-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>Reset Your Password</h2>
            </div>
            <p>Hi,</p>
            <p>We received a request to reset your password. Please click the button below to reset your password:</p>
            <a href="${redirectUrl}?token=${resetPasswordToken}" class="btn">Reset Password</a>
            <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
            <div class="footer">
                &copy; ${new Date().getFullYear()} Cash In Flow. All rights reserved.
            </div>
        </div>
    </body>
    </html>`;
};

export default getForgotPasswordEmail;
