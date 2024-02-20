const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../model');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const tagData = await Tag.findAll();
    res.status(200).json(tagData);
    // const productsData =  await Product.findByPk(req.params.category_id)
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const tagData = await Tag.findByPk(req.params.id);

    const productTagData = await ProductTag.findAll({
      where: {
        tag_id: tagData.id
      }
    })

  const productArray = [];

    for ( let i = 0; productTagData.length < i; i++){

      const productData = await Product.findAll({
        where: {
          id: productTagData[i].product_id
        }
      })
      productArray.push(productData);

    }


    const tagProducts = [tagData, productTagData, productArray]

    if (!tagData) {
      res.status(404).json({ message: 'No category found with this id !' });
      return;
    }

    res.status(200).json(tagProducts);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', (req, res) => {
  // create a new tag
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
});

router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
});

module.exports = router;
