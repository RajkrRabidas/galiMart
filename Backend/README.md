# Backend

## Google Play review login

For Play Console app access or local testing, use a dedicated account with
sample data. To let the account sign in without receiving an SMS, configure
these variables on the backend deployment:

```env
PLAY_REVIEW_MODE=true
PLAY_REVIEW_PHONE=<dedicated customer phone number>
PLAY_REVIEW_OTP=<six-digit reviewer code>
```

Give the same phone number and code to the reviewer in Play Console under **App
access**. Do not put the code in frontend code, source control, or public
documentation.

The configured code is accepted only for login to the exact configured phone
number, for any account role. It is not available for registration or other
phone numbers. Normal users continue to receive SMS OTPs. Keep the configured
account limited to testing/review data and disable `PLAY_REVIEW_MODE` when this
login is no longer needed. When disabled, the three variables are ignored.

The backend rejects an enabled configuration unless the phone normalizes to a
10-digit number and the code contains exactly six digits.

If normal login returns `SMS_PROVIDER_PAYMENT_REQUIRED`, the SMS provider has
rejected delivery for billing or balance reasons. Resolve that in the SMS
provider account; retrying the login or changing app code cannot restore SMS
credits. The failed OTP is discarded, and the normal OTP cooldown remains in
effect. Do not log or share full Axios errors because they may include the SMS
API key, phone number, and OTP.
