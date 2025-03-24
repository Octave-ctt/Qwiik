import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CartContext } from "../contexts/CartContext";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, Star, Truck } from "lucide-react";
import FeaturedProducts from "../components/FeaturedProducts";
import FavoriteButton from "../components/FavoriteButton";
import { formatPrice } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const getProductById = async (id: string) => {
  return {
    id,
    name: "Product Example",
    price: 99.99,
    image: "/placeholder.svg",
    category: "Category Example",
    description: "This is a product description example.",
    rating: 4.5,
    reviewCount: 123,
    deliveryTime: "2-3 jours"
  };
};

const getRelatedProducts = async (category: string) => {
  return [
    {
      id: "related1",
      name: "Related Product 1",
      price: 89.99,
      image: "/placeholder.svg",
      category
    },
    {
      id: "related2",
      name: "Related Product 2",
      price: 79.99,
      image: "/placeholder.svg",
      category
    }
  ];
};

const ProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        if (productId) {
          const productData = await getProductById(productId);
          if (!productData) {
            navigate("/not-found");
            return;
          }
          setProduct(productData);

          const related = await getRelatedProducts(productData.category);
          setRelatedProducts(related.filter((p: any) => p.id !== productId));
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        navigate("/not-found");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [productId, navigate]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg h-96"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-12 bg-gray-200 rounded w-full mt-8"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative">
          <div className="sticky top-24">
            <div className="relative aspect-w-1 aspect-h-1 rounded-lg overflow-hidden mb-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-auto object-cover rounded-lg"
              />
              <div className="absolute top-4 right-4 z-10">
                <FavoriteButton productId={product.id} />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <Badge
              variant="secondary"
              className="mb-2 uppercase tracking-wider text-xs font-medium"
            >
              {product.category}
            </Badge>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center mt-2 space-x-2">
              <div className="flex items-center">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-4 h-4",
                        i < Math.floor(product.rating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      )}
                    />
                  ))}
              </div>
              <span className="text-sm text-gray-500">
                ({product.reviewCount} avis)
              </span>
            </div>
          </div>

          <div className="text-2xl font-bold">{formatPrice(product.price)}</div>

          <div className="flex items-center text-sm text-gray-600">
            <Truck className="mr-2 h-4 w-4" />
            <span>
              Livraison en{" "}
              <span className="font-medium">{product.deliveryTime}</span>
            </span>
          </div>

          <Card className="p-4 mt-4">
            <div className="flex items-center">
              <Button
                variant="outline"
                size="icon"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="mx-4 font-medium text-lg w-6 text-center">
                {quantity}
              </span>
              <Button variant="outline" size="icon" onClick={increaseQuantity}>
                <Plus className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleAddToCart}
                className="ml-4 flex-1 py-6"
              >
                Ajouter au panier
              </Button>
            </div>
          </Card>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p className="text-gray-600">
              {product.description ||
                "Le produit parfait pour votre quotidien. Qualité premium et performances exceptionnelles garanties."}
            </p>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Caractéristiques</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Haute qualité</li>
              <li>Facile à utiliser</li>
              <li>Durable et fiable</li>
              <li>Design moderne</li>
            </ul>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Produits similaires</h2>
          <FeaturedProducts 
            products={relatedProducts} 
            title="Produits similaires" 
          />
        </div>
      )}
    </div>
  );
};

export default ProductPage;
