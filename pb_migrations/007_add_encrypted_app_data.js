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

migrate((app) => {
  if (collectionExists(app, "pbc_paynestenc") || collectionExists(app, "encrypted_app_data")) {
    return;
  }

  const encryptedAppData = new Collection({
    id: "pbc_paynestenc",
    listRule: "user = @request.auth.id",
    viewRule: "user = @request.auth.id",
    createRule: "user = @request.auth.id",
    updateRule: "user = @request.auth.id",
    deleteRule: "user = @request.auth.id",
    name: "encrypted_app_data",
    type: "base",
    fields: [
      {
        autogeneratePattern: "[a-z0-9]{15}",
        hidden: false,
        id: "text_encrypted_id",
        max: 15,
        min: 15,
        name: "id",
        pattern: "^[a-z0-9]+$",
        presentable: false,
        primaryKey: true,
        required: true,
        system: true,
        type: "text",
      },
      {
        hidden: false,
        id: "autodate_encrypted_created",
        name: "created",
        onCreate: true,
        onUpdate: false,
        presentable: false,
        system: true,
        type: "autodate",
      },
      {
        hidden: false,
        id: "autodate_encrypted_updated",
        name: "updated",
        onCreate: true,
        onUpdate: true,
        presentable: false,
        system: true,
        type: "autodate",
      },
      {
        cascadeDelete: true,
        collectionId: "_pb_users_auth_",
        hidden: false,
        id: "relation_encrypted_user",
        maxSelect: 1,
        minSelect: 0,
        name: "user",
        presentable: false,
        required: true,
        system: false,
        type: "relation",
      },
      {
        autogeneratePattern: "",
        hidden: false,
        id: "text_encrypted_payload",
        max: 0,
        min: 0,
        name: "payload",
        pattern: "",
        presentable: false,
        primaryKey: false,
        required: true,
        system: false,
        type: "text",
      },
      {
        hidden: false,
        id: "number_encrypted_schema_version",
        max: null,
        min: 1,
        name: "schema_version",
        onlyInt: true,
        presentable: false,
        required: false,
        system: false,
        type: "number",
      },
      {
        autogeneratePattern: "",
        hidden: false,
        id: "text_encrypted_updated_at",
        max: 0,
        min: 0,
        name: "updated_at",
        pattern: "",
        presentable: false,
        primaryKey: false,
        required: true,
        system: false,
        type: "text",
      },
    ],
    indexes: [
      "CREATE UNIQUE INDEX `idx_encrypted_app_data_user` ON `encrypted_app_data` (`user`)",
    ],
    system: false,
  });

  app.save(encryptedAppData);
}, (app) => {
  deleteCollectionIfExists(app, "pbc_paynestenc");
  deleteCollectionIfExists(app, "encrypted_app_data");
});
