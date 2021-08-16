const { default: SignJWT } = require('jose/jwt/sign');
const { jwtVerify } = require('jose/jwt/verify');
const { JWTExpired } = require('jose/util/errors');
const express = require('express');
const crypto = require('crypto');

// This is your "webhook-secret" as you have set from the High Fidelity REST API. Do not share this string.
const WEBHOOK_SECRET = "aaaaaaaa-1111-bbbb-2222-cccccccccccc";
const WEBHOOK_SECRET_KEY = crypto.createSecretKey(Buffer.from(WEBHOOK_SECRET, "utf8"));
// If set to a positive number, this server will accept expired webhook events this many seconds expired. This should be 0 on production servers. For testing purposes only, such as to replay webhook events, set to a large number (ex: 9999999999).
const EXPIRATION_TOLERANCE_SECONDS = 0;

const app = express();
const PORT = 8080;

app.set('view engine', 'ejs');
app.use(express.json());

const FAKE_SECRET_KEY = crypto.createSecretKey(Buffer.from("fake_secret_aaaabbbbaaaabbbbaaaabbbb", "utf8"));
const WEBHOOK_SIGNATURE_HEADER = "x-highfidelity-signature";
async function parseAndValidateWebhookEvent(headers, payload) {
    let hifiSignature = headers[WEBHOOK_SIGNATURE_HEADER];
    if (!hifiSignature) {
        console.error(`Webhook event signature is invalid. Missing HTTP header: ${WEBHOOK_SIGNATURE_HEADER}`);
        return undefined;
    }
    try {
        let fakeJWT = await new SignJWT(payload)
            .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
            .sign(FAKE_SECRET_KEY);

        let realWebhookEventJWT = hifiSignature.split(".")[0] + "." +
            fakeJWT.split(".")[1] + "." +
            hifiSignature.split(".")[2];
        await jwtVerify(realWebhookEventJWT, WEBHOOK_SECRET_KEY, {"clockTolerance": EXPIRATION_TOLERANCE_SECONDS});
    } catch (error) {
        console.error(`Webhook payload is invalid. Error:\n${error}`);
        return undefined;
    }
    return payload;
}

if (EXPIRATION_TOLERANCE_SECONDS > 0) {
    console.log("WARNING: Accepting expired webhook events");
}

// This is an example webhook endpoint that can receive and process webhook events from the root webpage
app.post('/', async (req, res) => {
    let validatedWebhookPayload = await parseAndValidateWebhookEvent(req.headers, req.body);
    if (validatedWebhookPayload !== undefined) {
        res.status(200).send({"status": "ok"});
        console.log(`Successfully parsed a webhook event from the endpoint:\n${JSON.stringify(validatedWebhookPayload)}`);
    } else {
        res.status(400).send({"status": "bad-request"});
    }
});

app.listen(PORT, () => {
    console.log(`The High Fidelity Sample App is ready and listening at http://localhost:${PORT}`)
});
