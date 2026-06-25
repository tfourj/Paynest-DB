/// <reference path="../pb_data/types.d.ts" />

const localIdIndex = "CREATE UNIQUE INDEX `idx_subscriptions_user_local_id` ON `subscriptions` (`user`, `local_id`)";

const findSubscriptionsCollection = (app) => {
  try {
    return app.findCollectionByNameOrId("pbc_paynestsub");
  } catch {
    return app.findCollectionByNameOrId("subscriptions");
  }
};

const hasLocalIdIndex = (collection) => (
  collection.indexes.some((index) => index.includes("idx_subscriptions_user_local_id"))
);

migrate((app) => {
  const collection = findSubscriptionsCollection(app);

  collection.fields.add(new TextField({
    autogeneratePattern: "",
    hidden: false,
    id: "text_subscription_local_id",
    max: 0,
    min: 0,
    name: "local_id",
    pattern: "",
    presentable: false,
    primaryKey: false,
    required: true,
    system: false,
    type: "text",
  }));

  if (!hasLocalIdIndex(collection)) {
    collection.indexes = [
      ...collection.indexes,
      localIdIndex,
    ];
  }

  app.save(collection);
}, (app) => {
  const collection = findSubscriptionsCollection(app);

  collection.indexes = collection.indexes.filter((index) => (
    !index.includes("idx_subscriptions_user_local_id")
  ));
  collection.fields.removeById("text_subscription_local_id");

  app.save(collection);
});
