const router = require('express').Router();
const { Category, Product } = require('../../model');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  try {
    const categoryData = await Category.findAll();

    const catProdArray = [];
    for (let i = 0; i < categoryData.length; i++) {
      const productsData = await Product.findAll({
        where: {
          category_id: categoryData[i].id
        }
      });
      const catWithProds = [categoryData[i], productsData]
      catProdArray.push(catWithProds);
    }

    
    res.status(200).json(catProdArray);
    // const productsData =  await Product.findByPk(req.params.category_id)
  } catch (err) {
    res.status(500).json(err);
  }
  // find all categories
  // be sure to include its associated Products
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const categoryData = await Category.findByPk(req.params.id);
    const productsData = await Product.findAll({
      where: {
        category_id: categoryData.id
      }
    });

    const catProdsData = [categoryData, productsData];

    if (!categoryData) {
      res.status(404).json({ message: 'No category found with this id !' });
      return;
    }


    res.status(200).json(catProdsData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// create new product
router.post('/', async (req, res) => {
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

router.put('/:id', (req, res) => {
  // update a category by its `id` value
});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
});

module.exports = router;
