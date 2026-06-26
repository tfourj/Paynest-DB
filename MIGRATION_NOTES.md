# Database Migrations

Paynest alpha starts from a squashed initial PocketBase migration:

```text
pb_migrations/001_initial.js
```

That migration creates the complete schema required by the app:

- `subscriptions`
- `settings`
- `user_keys`
- `encrypted_subscriptions`
- `encrypted_settings`

## Rules After Alpha

- Do not edit `001_initial.js` after the alpha image has been published and used.
- Add a new ordered migration for every schema change.
- If a migration was applied but did not change the schema correctly, add a repair migration
  with the next filename instead of editing the broken migration.
- Keep fresh installs working by relying on the full ordered migration chain from
  `001_initial.js` onward.
- Make migrations idempotent when they may run against restored or manually changed databases.

## Field Checks

Do not assume PocketBase field helpers throw for every missing field. A helper can return an
empty value, so a check like this can incorrectly treat a missing field as present:

```js
const hasField = (collection, name) => {
  try {
    collection.fields.getByName(name);
    return true;
  } catch {
    return false;
  }
};
```

Use a stricter check that verifies the returned field actually exists and has the expected name:

```js
const getField = (collection, name) => {
  try {
    return collection.fields.getByName(name);
  } catch {
    return null;
  }
};

const hasField = (collection, name) => {
  const field = getField(collection, name);
  return Boolean(field && field.name === name);
};
```
