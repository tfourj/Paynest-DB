/// <reference path="../pb_data/types.d.ts" />

const deleteCollectionIfExists = (app, idOrName) => {
  try {
    const collection = app.findCollectionByNameOrId(idOrName);
    app.delete(collection);
  } catch {
    // Already absent.
  }
};

migrate((app) => {
  deleteCollectionIfExists(app, "pbc_paynestenc");
  deleteCollectionIfExists(app, "encrypted_app_data");
}, () => {
  // Alpha cleanup only. The app no longer uses this collection.
});
