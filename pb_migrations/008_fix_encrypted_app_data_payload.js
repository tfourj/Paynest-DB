/// <reference path="../pb_data/types.d.ts" />

const findEncryptedAppDataCollection = (app) => {
  try {
    return app.findCollectionByNameOrId("pbc_paynestenc");
  } catch {
    return app.findCollectionByNameOrId("encrypted_app_data");
  }
};

const getField = (collection, name) => {
  try {
    return collection.fields.getByName(name);
  } catch {
    return null;
  }
};

const removeField = (collection, name) => {
  const field = getField(collection, name);
  if (field) collection.fields.removeById(field.id);
};

const encryptedUserIndex = (
  "CREATE UNIQUE INDEX `idx_encrypted_app_data_user` ON `encrypted_app_data` (`user`)"
);

const hasEncryptedUserIndex = (collection) => (
  collection.indexes.some((index) => index.includes("idx_encrypted_app_data_user"))
);

migrate((app) => {
  const collection = findEncryptedAppDataCollection(app);

  const payload = getField(collection, "payload");
  if (!payload || payload.type !== "json") {
    removeField(collection, "payload");
    collection.fields.add(new JsonField({
      hidden: false,
      id: "json_encrypted_payload",
      maxSize: 0,
      name: "payload",
      presentable: false,
      required: true,
      system: false,
      type: "json",
    }));
  }

  collection.listRule = "user = @request.auth.id";
  collection.viewRule = "user = @request.auth.id";
  collection.createRule = "user = @request.auth.id";
  collection.updateRule = "user = @request.auth.id";
  collection.deleteRule = "user = @request.auth.id";

  if (!hasEncryptedUserIndex(collection)) {
    collection.indexes = [
      ...collection.indexes,
      encryptedUserIndex,
    ];
  }

  app.save(collection);
}, (app) => {
  const collection = findEncryptedAppDataCollection(app);

  const payload = getField(collection, "payload");
  if (!payload || payload.type !== "text") {
    removeField(collection, "payload");
    collection.fields.add(new TextField({
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
    }));
  }

  app.save(collection);
});
