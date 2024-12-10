const Paginate = (model) => {
  /**
   * Adds a paginate method to the Sequelize model.
   * @param {Object} filter - The Sequelize filter (where clause)
   * @param {Object} options - Query options
   * @param {string} [options.sortBy] - Sorting criteria (field:direction)
   * @param {string} [options.populate] - Populate related models
   * @param {number} [options.limit] - Maximum results per page
   * @param {number} [options.page] - Current page
   * @returns {Promise<Object>} Paginated results
   */
  const paginate = async function (filter = {}, options = {}) {
    const limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 10;
    const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
    const offset = (page - 1) * limit;

    let order = [['createdAt', 'ASC']]; // Default order

    if (options.sortBy) {
      const [field, direction] = options.sortBy.split(':');
      order = [[field, direction.toUpperCase() === 'DESC' ? 'DESC' : 'ASC']];
    }

    const include = options.populate
      ? options.populate.split(',').map((populateOption) => {
          const [modelName, association] = populateOption.split('.');
          return { model: modelName, as: association };
        })
      : [];

    const { count, rows } = await this.findAndCountAll({
      where: filter,
      limit,
      offset,
      order,
      include,
    });

    const totalPages = Math.ceil(count / limit);
    return {
      results: rows,
      page,
      limit,
      totalPages,
      totalResults: count,
    };
  };

  Object.defineProperty(model, 'paginate', {
    value: paginate,
    writable: false,
    enumerable: false,
    configurable: false,
  });
};

export default Paginate;
