import { Request, Response } from 'express'
import knex from '../database/connection'

interface ItemsProps {
  id: number;
  title: string;
  image: string;
}

class ItemsController {

  async index (request: Request, response: Response) {
    const items = await knex('items').select<ItemsProps[]>('*'); // SELECT * FROM items 
  
    const serializedItems = items.map(item => {
      return {
        id: item.id,
        title: item.title,
        image_url: `${process.env.BASE_URL}/uploads/${item.image}`,
      }
    })
  
    return response.json(serializedItems)
  }

}

export default ItemsController