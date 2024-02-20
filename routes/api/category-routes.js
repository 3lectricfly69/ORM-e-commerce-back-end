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

router.get('/:id', (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
});

router.post('/', (req, res) => {
  // create a new category
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
});

module.exports = router;
