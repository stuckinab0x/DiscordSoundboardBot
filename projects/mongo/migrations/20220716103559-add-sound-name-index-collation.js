module.exports = {
  async up(db) {
    await db.collection('sounds').dropIndex('name_1');
    await db.collection('sounds').createIndex({ name: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });
  },

  async down(db) {
    await db.collection('sounds').dropIndex('name_1');
    await db.collection('sounds').createIndex({ name: 1 }, { unique: true });
  }
};
