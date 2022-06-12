module.exports = {
  async up(db) {
    db.collection('sounds').createIndex({ name: 1 }, { unique: true });
  },
  async down(db) {
    db.collection('sounds').dropIndex('name_1');
  },
};
