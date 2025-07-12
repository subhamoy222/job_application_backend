import { sendMail } from "./utils/sendMail.js";

async function testEmail() {
  try {
    console.log("Testing email configuration...");
    await sendMail(
      "test@example.com",
      "Test Email",
      "This is a test email to verify the configuration.",
      "<h1>Test Email</h1><p>This is a test email to verify the configuration.</p>"
    );
    console.log("Email test successful!");
  } catch (error) {
    console.error("Email test failed:", error);
  }
}

testEmail(); 