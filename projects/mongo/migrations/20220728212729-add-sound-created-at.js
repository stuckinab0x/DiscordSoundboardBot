module.exports = {
  async up(db) {
    await db.collection('sounds').updateMany({ createdAt: { $exists: 0 } }, [{ $set: { createdAt: { $toDate: '$_id' } } }]);
  },
  async down(db) {
    await db.collection('sounds').updateMany({}, { $unset: { createdAt: '' } });
  },
};
