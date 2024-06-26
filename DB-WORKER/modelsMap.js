import { User } from "./models/consumer/user.models.js";
import { LoginAttempts } from "./models/consumer/loginAttempts.models.js";
import { Vendor } from "./models/consumer/vendor.models.js";
import { Product } from "./models/Product/product.models.js";
import { ProductCategory } from "./models/Product/category.models.js";
import { Order } from "./models/Order/order.models.js";
import { OrderItem } from "./models/Order/orderItem.models.js";
import { OrderItemReturn  } from "./models/Order/orderItemReturn.models.js";
import { OrderStatusCode } from "./models/Order/orderStatusCode.models.js";
import { Shipment } from "./models/shipment/shipment.models.js";
import { ShipmentItem } from "./models/shipment/shipmentItem.models.js";  
import { ShoppingCart } from "./models/shoppingCart/shoppingCart.models.js";
import { shoppingCartHistory } from "./models/shoppingCart/shoppingCartHistory.models.js";


export const modelsMap = {
    User,
    LoginAttempts,
    Vendor,
    Product,
    ProductCategory,
    Order,
    OrderItem,
    OrderItemReturn,
    OrderStatusCode,
    Shipment,
    ShipmentItem,
    ShoppingCart,
    shoppingCartHistory
    
} 