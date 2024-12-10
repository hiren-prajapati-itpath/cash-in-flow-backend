const welcomeEmailTemplate = (fullName) => {
  return `
      <html>
        <body>
          <h1>Welcome to Social Space, ${fullName}!</h1>
          <p>We're excited to have you as a member of our community. Get ready to connect with like-minded individuals!</p>
          <p>If you have any questions, feel free to reach out to us at any time.</p>
          <p>Best regards,<br/>The Social Space Team</p>
        </body>
      </html>
    `;
};

export default welcomeEmailTemplate;
