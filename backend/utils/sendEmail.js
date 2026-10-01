/**
 * HTTPS-based email sender helper for PizzaMaster.
 * Supports Resend and Brevo APIs via HTTPS (avoids SMTP port blocks on Render).
 */

const sendEmail = async (to, subject, html) => {
  const apiKey = process.env.EMAIL_API_KEY;
  const fromEmail = process.env.EMAIL_FROM;
  const providerEnv = (process.env.EMAIL_PROVIDER || '').toLowerCase();

  if (!apiKey) {
    const errorMsg = 'Email service error: EMAIL_API_KEY environment variable is not set.';
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  if (!fromEmail) {
    const errorMsg = 'Email service error: EMAIL_FROM environment variable is not set.';
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  // Detect provider: Brevo keys start with 'xkeysib-', Resend keys start with 're_'
  const isBrevo = providerEnv === 'brevo' || apiKey.startsWith('xkeysib-');

  const recipients = Array.isArray(to) ? to : [to];

  let url;
  let headers;
  let body;

  if (isBrevo) {
    url = 'https://api.brevo.com/v3/smtp/email';
    headers = {
      'api-key': apiKey,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    body = JSON.stringify({
      sender: { email: fromEmail, name: 'PizzaMaster' },
      to: recipients.map(item => (typeof item === 'string' ? { email: item } : item)),
      subject: subject,
      htmlContent: html
    });
  } else {
    // Default to Resend
    url = 'https://api.resend.com/emails';
    headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    };
    body = JSON.stringify({
      from: fromEmail,
      to: recipients.map(item => (typeof item === 'string' ? item : item.email)),
      subject: subject,
      html: html
    });
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body
    });

    if (!response.ok) {
      let errorDetails = '';
      try {
        const errorJson = await response.json();
        errorDetails = JSON.stringify(errorJson);
      } catch {
        errorDetails = await response.text();
      }

      const statusMsg = `Email API request failed with HTTP ${response.status} (${response.statusText}): ${errorDetails}`;
      console.error(statusMsg);
      throw new Error(statusMsg);
    }

    const data = await response.json().catch(() => ({}));
    return { success: true, data };
  } catch (error) {
    // Ensure we do not log any secret tokens, but log the real error message
    console.error(`sendEmail failed for recipient [${to}]: ${error.message}`);
    throw error;
  }
};

module.exports = { sendEmail };
