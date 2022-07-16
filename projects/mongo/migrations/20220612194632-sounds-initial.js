module.exports = {
  async up(db) {
    await db.collection('sounds').createIndex({ name: 1 }, { unique: true });
  },
  async down(db) {
    await db.collection('sounds').dropIndex('name_1');
  },
};
