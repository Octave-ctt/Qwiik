
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ChevronRight, Package } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { AuthContext } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type OrderItem = {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    image: string;
  };
};

type Order = {
  id: string;
  created_at: string;
  status: string;
  total: number;
  items: OrderItem[];
};

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (currentUser) {
      fetchOrders();
    }
  }, [currentUser]);

  const fetchOrders = async () => {
    if (!currentUser) return;

    try {
      setIsLoading(true);
      
      // Récupérer les commandes
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });
      
      if (ordersError) throw ordersError;
      
      if (!ordersData) {
        setOrders([]);
        setIsLoading(false);
        return;
      }
      
      // Pour chaque commande, récupérer les articles
      const ordersWithItems = await Promise.all(ordersData.map(async (order) => {
        const { data: itemsData, error: itemsError } = await supabase
          .from('order_items')
          .select('*, product:products(id, name, image)')
          .eq('order_id', order.id);
        
        if (itemsError) throw itemsError;
        
        return {
          ...order,
          items: itemsData || []
        } as Order;
      }));
      
      setOrders(ordersWithItems);
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Formater la date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Traduire le statut
  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'completed':
        return 'Terminée';
      case 'cancelled':
        return 'Annulée';
      default:
        return status;
    }
  };

  // Couleur du statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg"><ShoppingBag className="mr-2" size={20} />Mes commandes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 animate-pulse">
            {[1, 2].map(i => (
              <div key={i} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between mb-3">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
                <div className="h-12 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg"><ShoppingBag className="mr-2" size={20} />Mes commandes</CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="p-4 bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">Commande #{order.id.slice(-6)}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">
                      {order.total.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                    </p>
                    <p className="text-sm text-gray-500">{order.items.length} article(s)</p>
                  </div>
                </div>
                
                <div className="p-4 border-t border-gray-200">
                  <div className="space-y-3">
                    {order.items.slice(0, 2).map((item) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        {item.product?.image && (
                          <img src={item.product.image} alt={item.product.name} className="w-12 h-12 object-cover rounded" />
                        )}
                        <div className="flex-grow min-w-0">
                          <p className="font-medium truncate">{item.product?.name || 'Produit'}</p>
                          <p className="text-sm text-gray-500">Qté: {item.quantity} × {item.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</p>
                        </div>
                      </div>
                    ))}
                    
                    {order.items.length > 2 && (
                      <p className="text-sm text-gray-500">+ {order.items.length - 2} autre(s) article(s)</p>
                    )}
                  </div>
                  
                  {order.status === 'completed' && (
                    <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                      <div className="flex items-center text-green-600 text-sm">
                        <Package size={16} className="mr-1" />
                        <span>Livraison effectuée</span>
                      </div>
                      <Link to={`/account/orders/${order.id}`} className="text-sm font-medium text-qwiik-blue flex items-center">
                        Détails <ChevronRight size={16} />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="mx-auto w-12 h-12 mb-3 flex items-center justify-center bg-gray-100 rounded-full">
              <ShoppingBag size={20} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">Aucune commande</h3>
            <p className="text-gray-600 mb-4">Vous n'avez pas encore passé de commande.</p>
            <Link to="/">
              <Button>
                Découvrir nos produits
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrdersPage;
