# Database Migrations

PocketBase records applied migration filenames in the `_migrations` table. After a migration
is marked applied, PocketBase will not run that same file again.

## Rules

- Do not edit old migrations after they may have been applied.
- Add a new migration for every schema change.
- If a migration was applied but did not change the schema correctly, add a repair migration
  with the next filename instead of editing the broken migration.
- Keep fresh installs working by relying on the full ordered migration chain.
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

## What Happened

`003_add_currency_settings.js` was marked applied, but the settings fields were still missing.
The field-existence guard treated missing fields as existing, so the migration skipped adding:

- `enabled_currencies`
- `convert_to_primary_currency`
- `show_original_currency`

Because `003` was already applied, the fix had to be a new migration:

```text
004_fix_currency_settings_fields.js
```

That repair migration uses the stricter field check and adds the missing fields.
