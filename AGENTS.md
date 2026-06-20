# Repository workflow

Before pushing any change:

1. Run `npm run verify`.
2. Fix every error, warning, failed check, and failed test.
3. Push only after the verification command exits successfully.

Do not bypass the pre-push hook with `--no-verify`.
