class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    return await this.model.create(data);
  }

  async findById(id, populateFields = '') {
    return await this.model.findById(id).populate(populateFields);
  }

  async findOne(filter, selectFields = '') {
    return await this.model.findOne(filter).select(selectFields);
  }

  async find(filter = {}, options = {}) {
    const { sort = { createdAt: -1 }, limit = 20, skip = 0, populate = '' } = options;
    return await this.model
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate(populate);
  }

  async updateById(id, data) {
    return await this.model.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async deleteById(id) {
    return await this.model.findByIdAndDelete(id);
  }

  async count(filter = {}) {
    return await this.model.countDocuments(filter);
  }
}

module.exports = BaseRepository;
