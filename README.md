# PT Frames 🖼️

Farcaster frames for the PoolTogether protocol.

## Frames

- `PrizeVault` - A frame for checking balance, depositing and withdrawing from a PoolTogether prize vault.

## Local Development

- `pnpm i` to install dependencies
- `pnpm dev` to start the frames locally
- `pnpm debugger` to start the debugger locally

Use the path to any frame to test it on the debugger.

Example: `http://localhost:3000/prizeVault`

## Deployment Notes

- The env var `NEXT_PUBLIC_HOST` must be set to the URL where the app is being hosted.
- Optionally, add env vars for any RPC URLs you want to use - see keys on `app/constants.ts`.
