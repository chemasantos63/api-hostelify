import { Product } from 'src/modules/product/entities/product.entity';
import { Permanence } from './../../permanence/entities/permanence.entity';
export class CreateTotalDto {
  permanences?: Array<Permanence>;
  products?: Array<Product>;
}
