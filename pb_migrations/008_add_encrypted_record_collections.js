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

const payloadField = (id) => ({
  autogeneratePattern: "",
  hidden: false,
  id,
  max: 0,
  min: 0,
  name: "payload",
  pattern: "",
  presentable: false,
  primaryKey: false,
  required: true,
  system: false,
  type: "text",
});

const updatedAtField = (id) => ({
  autogeneratePattern: "",
  hidden: false,
  id,
  max: 0,
  min: 0,
  name: "updated_at",
  pattern: "",
  presentable: false,
  primaryKey: false,
  required: true,
  system: false,
  type: "text",
});

const schemaVersionField = (id) => ({
  hidden: false,
  id,
  max: null,
  min: 1,
  name: "schema_version",
  onlyInt: true,
  presentable: false,
  required: false,
  system: false,
  type: "number",
});

migrate((app) => {
  if (!collectionExists(app, "pbc_paynestesub") && !collectionExists(app, "encrypted_subscriptions")) {
    app.save(new Collection({
      id: "pbc_paynestesub",
      listRule: "user = @request.auth.id",
      viewRule: "user = @request.auth.id",
      createRule: "user = @request.auth.id",
      updateRule: "user = @request.auth.id",
      deleteRule: "user = @request.auth.id",
      name: "encrypted_subscriptions",
      type: "base",
      fields: [
        textPrimaryKeyField("text_encrypted_subscription_id"),
        createdField("autodate_encrypted_subscription_created"),
        updatedField("autodate_encrypted_subscription_updated"),
        userRelationField("relation_encrypted_subscription_user"),
        {
          autogeneratePattern: "",
          hidden: false,
          id: "text_encrypted_subscription_local_id",
          max: 0,
          min: 0,
          name: "local_id",
          pattern: "",
          presentable: false,
          primaryKey: false,
          required: true,
          system: false,
          type: "text",
        },
        payloadField("text_encrypted_subscription_payload"),
        schemaVersionField("number_encrypted_subscription_schema_version"),
        updatedAtField("text_encrypted_subscription_updated_at"),
      ],
      indexes: [
        "CREATE UNIQUE INDEX `idx_encrypted_subscriptions_user_local_id` " +
          "ON `encrypted_subscriptions` (`user`, `local_id`)",
      ],
      system: false,
    }));
  }

  if (!collectionExists(app, "pbc_paynesteset") && !collectionExists(app, "encrypted_settings")) {
    app.save(new Collection({
      id: "pbc_paynesteset",
      listRule: "user = @request.auth.id",
      viewRule: "user = @request.auth.id",
      createRule: "user = @request.auth.id",
      updateRule: "user = @request.auth.id",
      deleteRule: "user = @request.auth.id",
      name: "encrypted_settings",
      type: "base",
      fields: [
        textPrimaryKeyField("text_encrypted_settings_id"),
        createdField("autodate_encrypted_settings_created"),
        updatedField("autodate_encrypted_settings_updated"),
        userRelationField("relation_encrypted_settings_user"),
        payloadField("text_encrypted_settings_payload"),
        schemaVersionField("number_encrypted_settings_schema_version"),
        updatedAtField("text_encrypted_settings_updated_at"),
      ],
      indexes: [
        "CREATE UNIQUE INDEX `idx_encrypted_settings_user` ON `encrypted_settings` (`user`)",
      ],
      system: false,
    }));
  }
}, (app) => {
  deleteCollectionIfExists(app, "pbc_paynesteset");
  deleteCollectionIfExists(app, "encrypted_settings");
  deleteCollectionIfExists(app, "pbc_paynestesub");
  deleteCollectionIfExists(app, "encrypted_subscriptions");
});
