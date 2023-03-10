'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReviewImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ReviewImage.belongsTo(
        models.Review,
        {foreignKey: "reviewId"}
      )
    }

    static async addImage ({reviewId, url}) {

      const image = await ReviewImage.create({
        reviewId,
        url
      })
      
      return await ReviewImage.findByPk(image.id, {
        attributes:['id', 'url']
      })

    }
  }
  ReviewImage.init({
    reviewId:{
      type:  DataTypes.INTEGER,
    },
    url: {
      type: DataTypes.STRING
    },
  }, {
    sequelize,
    modelName: 'ReviewImage',
  });
  return ReviewImage;
};