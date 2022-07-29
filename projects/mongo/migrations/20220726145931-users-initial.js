module.exports = {
  async up(db) {
    await db.collection('users').createIndex({ userId: 1 }, { unique: true });
  },
  async down(db) {
    await db.collection('users').dropIndex('userId_1');
  },
};
