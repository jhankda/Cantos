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



export {searchsuggestion}