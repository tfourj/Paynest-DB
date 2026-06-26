/// <reference path="../pb_data/types.d.ts" />

const collectionExists = (app, idOrName) => {
  try {
    app.findCollectionByNameOrId(idOrName);
    return true;
  } catch {
    return false;
  }
};

const deleteCollectionIfExists = (app, idOrName) => {
  try {
    const collection = app.findCollectionByNameOrId(idOrName);
    app.delete(collection);
  } catch {
    // Already absent.
  }
};

const textPrimaryKeyField = (id) => ({
  autogeneratePattern: "[a-z0-9]{15}",
  hidden: false,
  id,
  max: 15,
  min: 15,
  name: "id",
  pattern: "^[a-z0-9]+$",
  presentable: false,
  primaryKey: true,
  required: true,
  system: true,
  type: "text",
});

const createdField = (id) => ({
  hidden: false,
  id,
  name: "created",
  onCreate: true,
  onUpdate: false,
  presentable: false,
  system: true,
  type: "autodate",
});

const updatedField = (id) => ({
  hidden: false,
  id,
  name: "updated",
  onCreate: true,
  onUpdate: true,
  presentable: false,
  system: true,
  type: "autodate",
});

const userRelationField = (id) => ({
  cascadeDelete: true,
  collectionId: "_pb_users_auth_",
  hidden: false,
  id,
  maxSelect: 1,
  minSelect: 0,
  name: "user",
  presentable: false,
  required: true,
  system: false,
  type: "relation",
});

const textField = (id, name, required = false) => ({
  autogeneratePattern: "",
  hidden: false,
  id,
  max: 0,
  min: 0,
  name,
  pattern: "",
  presentable: false,
  primaryKey: false,
  required,
  system: false,
  type: "text",
});

const boolField = (id, name) => ({
  hidden: false,
  id,
  name,
  presentable: false,
  required: false,
  system: false,
  type: "bool",
});

const numberField = (id, name, { min = null, max = null, onlyInt = false, required = false } = {}) => ({
  hidden: false,
  id,
  max,
  min,
  name,
  onlyInt,
  presentable: false,
  required,
  system: false,
  type: "number",
});

const dateField = (id, name, required = false) => ({
  hidden: false,
  id,
  max: "",
  min: "",
  name,
  presentable: false,
  required,
  system: false,
  type: "date",
});

const urlField = (id, name) => ({
  exceptDomains: null,
  hidden: false,
  id,
  name,
  onlyDomains: null,
  presentable: false,
  required: false,
  system: false,
  type: "url",
});

const schemaVersionField = (id, required = false) => (
  numberField(id, "schema_version", { min: 1, onlyInt: true, required })
);

const appCollection = ({ id, name, fields, indexes = [] }) => new Collection({
  id,
  listRule: "user = @request.auth.id",
  viewRule: "user = @request.auth.id",
  createRule: "user = @request.auth.id",
  updateRule: "user = @request.auth.id",
  deleteRule: "user = @request.auth.id",
  name,
  type: "base",
  fields,
  indexes,
  system: false,
});

const saveCollectionIfMissing = (app, collection) => {
  if (!collectionExists(app, collection.id) && !collectionExists(app, collection.name)) {
    app.save(collection);
  }
};

migrate((app) => {
  saveCollectionIfMissing(app, appCollection({
    id: "pbc_paynestsub",
    name: "subscriptions",
    fields: [
      textPrimaryKeyField("text3208210256"),
      createdField("autodate2990389176"),
      updatedField("autodate3332085495"),
      userRelationField("relation_paynest_user"),
      textField("text_subscription_name", "name", true),
      textField("text_subscription_category", "category", true),
      numberField("number_subscription_price", "price", { min: 0, required: true }),
      textField("text_subscription_currency", "currency", true),
      {
        hidden: false,
        id: "select_subscription_period",
        maxSelect: 1,
        name: "billing_period",
        presentable: false,
        required: true,
        system: false,
        type: "select",
        values: ["Weekly", "Monthly", "3 months", "6 months", "Yearly"],
      },
      numberField("number_subscription_pay_day", "pay_day", { min: 1, max: 31 }),
      dateField("date_subscription_next_renewal", "next_renewal_date", true),
      boolField("bool_subscription_paused", "paused"),
      boolField("bool_subscription_reminder_enabled", "reminder_enabled"),
      numberField("number_subscription_reminder_days", "reminder_days", { min: 0 }),
      textField("text_subscription_reminder_time", "reminder_time"),
      textField("text_subscription_icon_name", "icon_name"),
      textField("text_subscription_icon_label", "icon_label"),
      textField("text_subscription_icon_color", "icon_color"),
      textField("text_subscription_background_color", "background_color"),
      textField("text_subscription_icon_bg_color", "icon_background_color"),
      textField("text_subscription_simple_icon_slug", "simple_icon_slug"),
      textField("text_subscription_icon_provider", "icon_provider"),
      urlField("url_subscription_icon_url", "icon_url"),
      textField("text_subscription_icon_source_title", "icon_source_title"),
      textField("text_subscription_local_id", "local_id", true),
      textField("text_subscription_created_at", "created_at", true),
      textField("text_subscription_updated_at", "updated_at", true),
    ],
    indexes: [
      "CREATE UNIQUE INDEX `idx_subscriptions_user_local_id` ON `subscriptions` (`user`, `local_id`)",
    ],
  }));

  saveCollectionIfMissing(app, appCollection({
    id: "pbc_paynestset",
    name: "settings",
    fields: [
      textPrimaryKeyField("text_settings_id"),
      createdField("autodate_settings_created"),
      updatedField("autodate_settings_updated"),
      userRelationField("relation_paynest_settings_user"),
      boolField("bool_settings_reminders_enabled", "reminders_enabled"),
      numberField("number_settings_reminder_days", "reminder_days", { min: 0 }),
      textField("text_settings_reminder_time", "reminder_time"),
      textField("text_settings_currency", "currency", true),
      textField("text_settings_enabled_currencies", "enabled_currencies"),
      boolField("bool_settings_convert_primary", "convert_to_primary_currency"),
      boolField("bool_settings_show_original", "show_original_currency"),
      boolField("bool_settings_payday_enabled", "payday_enabled"),
      numberField("number_settings_payday", "payday", { min: 1, max: 31 }),
      textField("text_settings_color_presets", "color_presets"),
      boolField("bool_settings_uses_mobile", "uses_mobile"),
      textField("text_settings_updated_at", "updated_at", true),
    ],
    indexes: [
      "CREATE UNIQUE INDEX `idx_settings_user` ON `settings` (`user`)",
    ],
  }));

  saveCollectionIfMissing(app, appCollection({
    id: "pbc_paynestukey",
    name: "user_keys",
    fields: [
      textPrimaryKeyField("text_user_keys_id"),
      createdField("autodate_user_keys_created"),
      updatedField("autodate_user_keys_updated"),
      userRelationField("relation_user_keys_user"),
      textField("text_user_keys_kdf", "kdf", true),
      numberField("number_user_keys_iterations", "iterations", {
        min: 100000,
        onlyInt: true,
        required: true,
      }),
      textField("text_user_keys_salt", "salt", true),
      textField("text_user_keys_encrypted_master_key", "encrypted_master_key", true),
      textField("text_user_keys_nonce", "nonce", true),
      schemaVersionField("number_user_keys_schema_version", true),
      textField("text_user_keys_updated_at", "updated_at", true),
    ],
    indexes: [
      "CREATE UNIQUE INDEX `idx_user_keys_user` ON `user_keys` (`user`)",
    ],
  }));

  saveCollectionIfMissing(app, appCollection({
    id: "pbc_paynestesub",
    name: "encrypted_subscriptions",
    fields: [
      textPrimaryKeyField("text_encrypted_subscription_id"),
      createdField("autodate_encrypted_subscription_created"),
      updatedField("autodate_encrypted_subscription_updated"),
      userRelationField("relation_encrypted_subscription_user"),
      textField("text_encrypted_subscription_local_id", "local_id", true),
      textField("text_encrypted_subscription_payload", "payload", true),
      schemaVersionField("number_encrypted_subscription_schema_version"),
      textField("text_encrypted_subscription_updated_at", "updated_at", true),
    ],
    indexes: [
      "CREATE UNIQUE INDEX `idx_encrypted_subscriptions_user_local_id` " +
        "ON `encrypted_subscriptions` (`user`, `local_id`)",
    ],
  }));

  saveCollectionIfMissing(app, appCollection({
    id: "pbc_paynesteset",
    name: "encrypted_settings",
    fields: [
      textPrimaryKeyField("text_encrypted_settings_id"),
      createdField("autodate_encrypted_settings_created"),
      updatedField("autodate_encrypted_settings_updated"),
      userRelationField("relation_encrypted_settings_user"),
      textField("text_encrypted_settings_payload", "payload", true),
      schemaVersionField("number_encrypted_settings_schema_version"),
      textField("text_encrypted_settings_updated_at", "updated_at", true),
    ],
    indexes: [
      "CREATE UNIQUE INDEX `idx_encrypted_settings_user` ON `encrypted_settings` (`user`)",
    ],
  }));
}, (app) => {
  deleteCollectionIfExists(app, "pbc_paynesteset");
  deleteCollectionIfExists(app, "encrypted_settings");
  deleteCollectionIfExists(app, "pbc_paynestesub");
  deleteCollectionIfExists(app, "encrypted_subscriptions");
  deleteCollectionIfExists(app, "pbc_paynestukey");
  deleteCollectionIfExists(app, "user_keys");
  deleteCollectionIfExists(app, "pbc_paynestset");
  deleteCollectionIfExists(app, "settings");
  deleteCollectionIfExists(app, "pbc_paynestsub");
  deleteCollectionIfExists(app, "subscriptions");
});
