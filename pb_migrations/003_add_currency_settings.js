/// <reference path="../pb_data/types.d.ts" />

const findSettingsCollection = (app) => {
  try {
    return app.findCollectionByNameOrId("pbc_paynestset");
  } catch {
    return app.findCollectionByNameOrId("settings");
  }
};

const hasField = (collection, name) => {
  try {
    collection.fields.getByName(name);
    return true;
  } catch {
    return false;
  }
};

migrate((app) => {
  const collection = findSettingsCollection(app);

  if (!hasField(collection, "enabled_currencies")) {
    collection.fields.add(new TextField({
      autogeneratePattern: "",
      hidden: false,
      id: "text_settings_enabled_currencies",
      max: 0,
      min: 0,
      name: "enabled_currencies",
      pattern: "",
      presentable: false,
      primaryKey: false,
      required: false,
      system: false,
      type: "text",
    }));
  }

  if (!hasField(collection, "convert_to_primary_currency")) {
    collection.fields.add(new BoolField({
      hidden: false,
      id: "bool_settings_convert_primary",
      name: "convert_to_primary_currency",
      presentable: false,
      required: false,
      system: false,
      type: "bool",
    }));
  }

  if (!hasField(collection, "show_original_currency")) {
    collection.fields.add(new BoolField({
      hidden: false,
      id: "bool_settings_show_original",
      name: "show_original_currency",
      presentable: false,
      required: false,
      system: false,
      type: "bool",
    }));
  }

  app.save(collection);
}, (app) => {
  const collection = findSettingsCollection(app);

  if (hasField(collection, "enabled_currencies")) {
    collection.fields.removeById("text_settings_enabled_currencies");
  }

  if (hasField(collection, "convert_to_primary_currency")) {
    collection.fields.removeById("bool_settings_convert_primary");
  }

  if (hasField(collection, "show_original_currency")) {
    collection.fields.removeById("bool_settings_show_original");
  }

  app.save(collection);
});
