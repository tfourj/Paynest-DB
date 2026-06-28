/// <reference path="../pb_data/types.d.ts" />

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

const findCollection = (app, name) => {
  try {
    return app.findCollectionByNameOrId(name);
  } catch {
    return null;
  }
};

const addTextFieldIfMissing = (app, collectionName, fieldId, fieldName) => {
  const collection = findCollection(app, collectionName);
  if (!collection || hasField(collection, fieldName)) return;

  collection.fields.add(new TextField({
    id: fieldId,
    name: fieldName,
    max: 0,
    min: 0,
    pattern: "",
    required: false,
    system: false,
  }));
  app.save(collection);
};

const removeFieldIfPresent = (app, collectionName, fieldName) => {
  const collection = findCollection(app, collectionName);
  if (!collection || !hasField(collection, fieldName)) return;

  collection.fields.removeByName(fieldName);
  app.save(collection);
};

migrate((app) => {
  addTextFieldIfMissing(app, "subscriptions", "text_subscription_payment_method", "payment_method");
  addTextFieldIfMissing(app, "settings", "text_settings_categories", "categories");
  addTextFieldIfMissing(app, "settings", "text_settings_payment_methods", "payment_methods");
}, (app) => {
  removeFieldIfPresent(app, "settings", "payment_methods");
  removeFieldIfPresent(app, "settings", "categories");
  removeFieldIfPresent(app, "subscriptions", "payment_method");
});
