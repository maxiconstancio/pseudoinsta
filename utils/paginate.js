const { baseUrl } = require('../config/config');

const paginate = (query, page = 1, pageSize = 10) => {
  const limit = parseInt(pageSize, 10) || 1;
  const offset = parseInt((page - 1) * limit, 10) || 0;
  return { ...query, offset, limit };
};

const pagination = async (model, query, page = 1, pageSize = 10) => {
  const currentPage = parseInt(page > 1 ? page : 1, 10);
  const limit = parseInt(pageSize, 10) || 1;
  const offset = (currentPage - 1) * limit;
  try {
    const data = await model.findAndCountAll({
      ...query,
      offset,
      limit,
    });
    const { count: totalItems, rows: results } = data;
    const totalPages = Math.ceil(totalItems / limit);
    return {
      prevPage: currentPage > 1 ? `${baseUrl}/${model.tableName.toLowerCase()}?page=${currentPage - 1}` : false,
      nextPage: currentPage < totalPages ? `${baseUrl}/${model.tableName.toLowerCase()}?page=${currentPage + 1}` : false,
      currentPage,
      totalPages,
      totalItems,
      results,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { paginate, pagination };
