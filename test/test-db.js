const mongooseOpts = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
};

module.exports = mongoose => {
  async function connect() {
    await mongoose.connect(__MONGO_URI__, mongooseOpts);

    mongoose.connection.on('error', error => {
      console.error('TEST-DB ERROR', error);
      mongoose.connect(__MONGO_URI__, mongooseOpts);
    });
  }

  async function disconnect() {
    await mongoose.connection.close();
  }

  async function clean() {
    const { collections } = mongoose.connection;

    await Object.keys(collections).map(async key => {
      const collection = collections[key];
      await collection.deleteMany();
    });
  }

  return {
    clean,
    connect,
    disconnect,
  };
};
