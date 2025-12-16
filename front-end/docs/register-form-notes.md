# Register form notes

Quick guide for keeping the register form tidy and safe.

## Validation rules

- Username: trimmed, minimum 8 characters.
- Email: simple pattern `name@domain.tld`; avoid whitespace.
- Password: minimum 8 chars, must include upper + lower, a digit, and a special character; repeat password must match exactly.
- All validation is run on the latest values before submit; avoid relying on stale React state.

## Component tips

- Use the shared `Input` component; it already sets `required`, `aria-invalid`, ids, and renders all error messages.
- Prefer trimming incoming values before submitting to the API to prevent accidental spaces.
- Keep validation rules together in arrays so new rules can be added without touching the submit handler.

## Submit flow

1. Prevent default form submit.
2. Run validation with fresh values; bail out early if anything fails.
3. Only then call `axios.post("/auth/signup", {...})`.
4. Surface failures to the user with a friendly message instead of silencing them.

## Gotchas to avoid

- Do not check `errors` derived from React state inside the same submit call—state updates are async; use locally computed arrays instead.
- Reset repeat-password errors when the values match so users can recover from a typo.
- Use `noValidate` on the form when you want custom rules to control the UX.

## Nice-to-haves for later

- Add a loading state to disable the submit button during the request.
- Wire form errors into a top-level alert/inline notice for better accessibility.
- Add unit tests for the rule helpers to prevent regressions.
