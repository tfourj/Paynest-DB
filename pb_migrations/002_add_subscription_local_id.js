/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_paynestsub");

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

  collection.indexes = [
    ...collection.indexes,
    "CREATE UNIQUE INDEX `idx_subscriptions_user_local_id` ON `subscriptions` (`user`, `local_id`)",
  ];

  app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_paynestsub");

  collection.indexes = collection.indexes.filter((index) => (
    !index.includes("idx_subscriptions_user_local_id")
  ));
  collection.fields.removeById("text_subscription_local_id");

  app.save(collection);
});
