/// <reference path="../pb_data/types.d.ts" />

const findSettingsCollection = (app) => {
  try {
    return app.findCollectionByNameOrId("pbc_paynestset");
  } catch {
    return app.findCollectionByNameOrId("settings");
  }
};

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

migrate((app) => {
  const collection = findSettingsCollection(app);

  if (!hasField(collection, "uses_mobile")) {
    collection.fields.add(new BoolField({
      hidden: false,
      id: "bool_settings_uses_mobile",
      name: "uses_mobile",
      presentable: false,
      required: false,
      system: false,
      type: "bool",
    }));
  }

  app.save(collection);
}, (app) => {
  const collection = findSettingsCollection(app);
  const field = getField(collection, "uses_mobile");

  if (field) {
    collection.fields.removeById(field.id);
  }

  app.save(collection);
});
