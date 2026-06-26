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

const textField = (id, name) => ({
  autogeneratePattern: "",
  hidden: false,
  id,
  max: 0,
  min: 0,
  name,
  pattern: "",
  presentable: false,
  primaryKey: false,
  required: true,
  system: false,
  type: "text",
});

const numberField = (id, name, min = null) => ({
  hidden: false,
  id,
  max: null,
  min,
  name,
  onlyInt: true,
  presentable: false,
  required: true,
  system: false,
  type: "number",
});

migrate((app) => {
  if (collectionExists(app, "pbc_paynestukey") || collectionExists(app, "user_keys")) {
    return;
  }

  app.save(new Collection({
    id: "pbc_paynestukey",
    listRule: "user = @request.auth.id",
    viewRule: "user = @request.auth.id",
    createRule: "user = @request.auth.id",
    updateRule: "user = @request.auth.id",
    deleteRule: "user = @request.auth.id",
    name: "user_keys",
    type: "base",
    fields: [
      textPrimaryKeyField("text_user_keys_id"),
      createdField("autodate_user_keys_created"),
      updatedField("autodate_user_keys_updated"),
      userRelationField("relation_user_keys_user"),
      textField("text_user_keys_kdf", "kdf"),
      numberField("number_user_keys_iterations", "iterations", 100000),
      textField("text_user_keys_salt", "salt"),
      textField("text_user_keys_encrypted_master_key", "encrypted_master_key"),
      textField("text_user_keys_nonce", "nonce"),
      numberField("number_user_keys_schema_version", "schema_version", 1),
      textField("text_user_keys_updated_at", "updated_at"),
    ],
    indexes: [
      "CREATE UNIQUE INDEX `idx_user_keys_user` ON `user_keys` (`user`)",
    ],
    system: false,
  }));
}, (app) => {
  deleteCollectionIfExists(app, "pbc_paynestukey");
  deleteCollectionIfExists(app, "user_keys");
});
