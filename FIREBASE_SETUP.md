
# Firebase Setup Guide for SonicPulse

... (rest of the file) ...

### Part 6: Custom Password Reset Branding

To make the "Reset Password" link open your styled page instead of the default Firebase one:

1.  In Firebase Console, go to **Authentication** > **Templates**.
2.  Click on **Password reset**.
3.  Click the **edit icon** next to the email subject.
4.  Click **"customize action URL"**.
5.  Set the URL to: `https://dilshan-music.vercel.app/reset-password`
6.  Click **Save**.

Now, when users click the link in their email, they will see your professional **SonicPulse Security** page.

### Part 7: Fix Spam Issue
1. Go to **Authentication** > **Settings** > **Domains**.
2. Click **Add Domain** and enter your custom domain (if you have one).
3. If you don't have a custom domain, tell users to check their spam and click **"Report not spam"**. This is the only way for the default `.firebaseapp.com` domain.
