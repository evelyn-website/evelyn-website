This post explains the end to end encryption strategy used by my group messaging app. The app is still in development, so I want to write down my thoughts both to help with my own understanding and to hopefully get feedback on what I'm doing wrong. All of the actual crypto stuff is handled by react-native-libsodium ([https://github.com/serenity-kit/react-native-libsodium](https://github.com/serenity-kit/react-native-libsodium)).

## Key Material

To start, each device needs a Curve25519 keypair. These are long-term keys used to encrypt and decrypt per-message message keys inside envelopes. It also needs a second Ed25519 keypair used to sign messages to prove to recipients that messages originated with this particular sender device.

## Outgoing Text Message Flow

When a message is sent to a group, the actual ciphertext is encrypted once using a random message key. We also generate a message nonce (msgNonce) alongside this. This message key is new for each message. That message key is individually sealed for each recipient device in what's called an 'envelope'. We create another ephemeral keypair to seal the envelopes. To seal each individual envelope, we use the recipient device's long term public key, the ephemeral keypair's private key, and a new envelope nonce (keyNonce) for each individual envelope.

So ultimately each envelope involves a recipient device ID, the ephemeral pair's public key, an envelope nonce (keyNonce) for the sealed key, and the actual sealed key that will be used to decrypt the ciphertext.

In the cleartext for each message, we include the message ID, the group ID, the sender ID, the sender device ID, the message type (control, text, image), the envelopes metadata, msgNonce, and the signature. What's actually encrypted are the ciphertext and the sealed key contents inside each envelope.

The sender then signs the message with their Ed25519 private key, so each recipient can verify that the message comes from the correct sender.

## Trust Model and Tradeoffs

A weak point here is that the key exchange happens through the server. I'm not sure what the best way to handle this is. I don't think it's realistic for my users to keep track of a published log of key updates or anything like that.

The main advantage to this approach is that you can encrypt a message once and deliver it to many recipients. The only thing that scales with the number of recipients is the number of envelopes, which are much smaller than re-encrypting an image or something for many recipients. Each device has its own access control, so if you switch devices entirely, you'll lose your access, but the groups and messages in this app are inherently ephemeral, so I think that's fine.

## Incoming Text Message Flow

When a recipient receives a message, they find the envelope addressed to their device ID, and if one exists, they verify the signature using the sender's public key. If the verification succeeds, they store the message in their client-side sqlite store. When the message ultimately needs to be displayed, they open the sealed message key using the device's long-term private key, the sender's ephemeral public key, and the envelope nonce (keyNonce). Then, they decrypt the ciphertext using that now-unsealed message key and the message nonce (msgNonce).

## Image Message Flow

For images, this process is mostly similar, but the image itself doesn't actually go over the wire. When a sender wants to send an image, they read the image file as raw bytes and generate a new image key to encrypt the image bytes. Then, they upload the encrypted image straight to S3 with a pre-signed URL.

In the actual message that goes over the wire, we construct a JSON payload to encrypt and send the same as we would a text message. That JSON payload includes the S3 object key, the mimetype for the file, the height and width, a blurhash, and the image nonce and image key that are used to decrypt the image. So to send an image, we create an image key for the image bytes, then a separate message key for the message ciphertext, then put that message key into envelopes which we seal with an ephemeral keypair.

The recipient decrypts the message text the same as above to get the JSON payload, fetches the encrypted image from S3, decrypts the image bytes using the recovered key and image nonce, then saves the bytes to a local cache.

## Pros

- Recipient isolation: Each device receives its own sealed copy of the message key. A compromised device cannot be used to decrypt messages for other devices.
- Sender authentication: Every message is signed with the sender's long-term Ed25519 private key. Recipients verify the signature during incoming message processing; a missing or invalid signature causes the message to be rejected. The signed payload covers id, group_id, sender_id, sender_device_id, messageType, msgNonce, ciphertext, and a deterministic canonical form of envelopes, binding sender identity to both message contents and per-recipient key envelopes.
- Envelope integrity: The signature includes a deterministic canonical representation of the full envelopes array (sorted by deviceId and serialized with fixed fields), so envelope tampering is detected during signature verification.

## Cons

- No true forward secrecy against later recipient key compromise: Each message uses a fresh message key and ephemeral sender keypair, which improves key separation and limits blast radius across messages. However, recipients decrypt envelope keys with their long-term device private keys, so if a recipient long-term private key is later compromised and historical traffic is available, past messages for that recipient can be decrypted.
- Key-distribution trust model: Keys are currently distributed via the backend device-key API. There is no out-of-band identity verification or key transparency log yet.

## Conclusion

If you have experience designing secure messaging systems, I'd really appreciate feedback on this approach. In particular, I'm most interested in critiques of the key-distribution model, whether these tradeoffs make sense for ephemeral group chat, and any obvious security improvements I should prioritize next. Please reach out to me on [Bluesky](https://bsky.app/profile/evelynwebsite.com) or [Github](https://github.com/evelyn-website)!
