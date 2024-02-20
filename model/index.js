// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

// // Products belongsTo Category
// Product.belongsTo(Category, {
//   through: {
//     model: Product,
//     unique: false
//   }
// });

// // Categories have many Products

// Category.belongsToMany(Product, {
//   through: {
//     model: Product,
//     unique: false
//   }
// });

// Products belongToMany Tags (through ProductTag)

Product.belongsToMany(Tag, {
  through: {
    model: ProductTag,
    unique: false
  },
  as: 'products_with_tags'
});

// Tags belongToMany Products (through ProductTag)

Tag.belongsToMany(Product, {
  through: {
    model: ProductTag,
    unique: false
  },
  as: 'tags_with_products'
});

module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};
