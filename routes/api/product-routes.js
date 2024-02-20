// import important parts of sequelize library
const { Model, DataTypes } = require('sequelize');
// import our database connection from config.js
const sequelize = require('../../config/connection');

// Initialize Product model (table) by extending off Sequelize's Model class
// class Product extends Model {}

// set up fields and rules for Product model //

const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../model');

// The `/api/products` endpoint

// get all products
// find all products
  // be sure to include its associated Category and Tag data

// get all products
router.get('/', async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  try {
    const productData = await Product.findAll();
    
    const productsArray = [];

    for (let i = 0; i < productData.length; i++) {

      const categoryData = await Category.findOne({ 
        where: { 
          id: productData[i].category_id
        } 
      });
      
      const prodCatTag = [productData[i], categoryData];
      productsArray.push(prodCatTag);
    }
    
    res.status(200).json(productsArray);
  } catch (err) {
    res.status(500).json(err);
  }

});

// get one product
router.get('/:id', (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
});

// create new product
router.post('/', (req, res) => {
/* req.body should look like this...
    {
    product_name: "Basketball",
    price: 200.00,
    stock: 3,
    tagIds: [1, 2, 3, 4]
    }
  */
Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
    if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
            product_id: product.id,
            tag_id,
        };
        });
        return ProductTag.bulkCreate(productTagIdArr);
    }
      // if no product tags, just respond
    res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
    console.log(err);
    res.status(400).json(err);
    });
});

// update product
router.put('/:id', (req, res) => {
  // update product data
Product.update(req.body, {
    where: {
    id: req.params.id,
    },
})
    .then((product) => {
    if (req.body.tagIds && req.body.tagIds.length) {
        
        ProductTag.findAll({
        where: { product_id: req.params.id }
        }).then((productTags) => {
          // create filtered list of new tag_ids
        const productTagIds = productTags.map(({ tag_id }) => tag_id);
        const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
            return {
            product_id: req.params.id,
            tag_id,
            };
        });

            // figure out which ones to remove
        const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);
                  // run both actions
        return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
        ]);
        });
    }

    return res.json(product);
    })
    .catch((err) => {
      // console.log(err);
    res.status(400).json(err);
    });
});

router.delete('/:id', (req, res) => {
  // delete one product by its `id` value
});

module.exports = router;
