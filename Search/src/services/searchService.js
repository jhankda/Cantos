import mongoose from "mongoose";
import { Product } from "../../model/product.models.js";

const searchsuggestion  = async(req,res) => {
    const {queryField} = req.params
    console.log(queryField)

    const pipelines  = [
        {
          '$search': {
            'index': 'autocomplete', 
            'compound': {
              'should': [
                {
                  'autocomplete': {
                    'query': queryField,
                    'path': 'name'
                  }
                }, {
                  'autocomplete': {
                    'query': queryField,
                    'path': 'description'
                  }
                }
              ], 
              'minimumShouldMatch': 1
            }
          }
        }, {
          '$limit': 7
        }, {
          '$project': {
            '_id': 0, 
            'name': 1, 
            'description': 1
          }
        }
      ]
      const result  = await Product.aggregate(pipelines)
      console.log(result)

      res
      .status(200)
      .json(result)
}



const getProduct  = async(req,res) => {
  const {queryfield}  = req.params
  if(!queryfield){
    res
    .status(400)
    .json({message: 'Please provide a valid query field'})
  }
  console.log(queryfield)
  const product  = await Product.aggregate(
    [
      {
        '$match': {
          '_id': new mongoose.Types.ObjectId(queryfield)
        }
      }, {
        '$lookup': {
          'from': 'productcategories', 
          'localField': 'categoryId', 
          'foreignField': '_id', 
          'as': 'categoryId'
        }
      }, {
        '$lookup': {
          'from': 'vendors', 
          'localField': 'vendorId', 
          'foreignField': '_id', 
          'as': 'vendorId'
        }
      }, {
        '$unwind': '$vendorId'
      }, {
        '$unwind': '$categoryId'
      }, {
        '$addFields': {
          'vendor': {
            'vendorName': '$vendorId.name', 
            'vendorId': '$vendorId._id'
          }
        }
      }, {
        '$addFields': {
          'category': {
            'categoryName': '$categoryId.name', 
            'categoryId': '$categoryId._id', 
            'parentCategory': '$categoryId.parentCode'
          }
        }
      }, {
        '$project': {
          'categoryId': 0, 
          'vendorId': 0, 
          'createdAt': 0, 
          '__v': 0
        }
      }
    ]
  )
  if(!product){
    res
    .status(404)
    .json({message: 'Product not found'})
  }

  res
  .status(200)
  .json({message:"product fetched",product})
}



export {searchsuggestion , getProduct}