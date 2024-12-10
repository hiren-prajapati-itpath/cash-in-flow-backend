// function to transform Sequelize instances into plain JavaScript objects
const transformToPlain = (result) => {
  if (Array.isArray(result)) {
    return result.map((item) => item.toJSON());
  }
  if (result instanceof Object) {
    return result.toJSON();
  }
  return result;
};

export default transformToPlain;
