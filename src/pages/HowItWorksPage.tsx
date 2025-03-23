
import React from 'react';
import { ArrowRight, Check, Package, ShoppingCart, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    title: "Trouvez vos produits préférés",
    description: "Parcourez notre catalogue ou utilisez la recherche pour trouver rapidement ce que vous cherchez.",
    icon: ShoppingCart,
  },
  {
    title: "Commandez en quelques clics",
    description: "Ajoutez les produits à votre panier et passez commande en quelques secondes.",
    icon: Package,
  },
  {
    title: "Livraison ultra-rapide",
    description: "Recevez votre commande en seulement 30 minutes, où que vous soyez.",
    icon: Truck,
  },
];

const benefits = [
  "Livraison en 30 minutes",
  "Suivi en temps réel de votre commande",
  "Paiement sécurisé",
  "Service client 7j/7",
  "Retours simplifiés",
  "Des milliers de produits disponibles"
];

const HowItWorksPage = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="py-16 gradient-section-3">
        <div className="page-container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Comment fonctionne <span className="text-qwiik-blue">Qwiik</span> ?
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              Qwiik vous permet de commander vos produits préférés et de les recevoir en seulement 30 minutes. Découvrez comment nous transformons votre expérience d'achat en ligne.
            </p>
          </div>
        </div>
      </section>
      
      {/* Steps Section */}
      <section className="py-16 bg-white/90 backdrop-blur-sm">
        <div className="page-container">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-subtle p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-qwiik-blue/10 rounded-full flex items-center justify-center">
                  <feature.icon className="h-8 w-8 text-qwiik-blue" />
                </div>
                <h2 className="text-xl font-bold mb-3">{feature.title}</h2>
                <p className="text-gray-600">{feature.description}</p>
                <div className="mt-4 text-4xl font-bold text-qwiik-blue/20">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Details Section */}
      <section className="py-16 gradient-section-3">
        <div className="page-container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Une expérience de livraison révolutionnaire
              </h2>
              <p className="text-gray-700 mb-6">
                Avec Qwiik, nous avons repensé la façon dont vous magasinez en ligne. Notre réseau de coursiers et de magasins partenaires nous permet de vous livrer vos produits en un temps record.
              </p>
              <p className="text-gray-700 mb-8">
                Que vous ayez besoin d'un accessoire tech pour une réunion importante, d'un cadeau de dernière minute ou simplement envie de vous faire plaisir sans attendre, Qwiik est là pour vous.
              </p>
              
              <ul className="space-y-3 mb-8">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-qwiik-blue mr-2 flex-shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              
              <Link to="/" className="btn-primary inline-flex items-center">
                <span>Découvrir nos produits</span>
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-elevated">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4">Comment se déroule votre commande</h3>
                
                <ol className="space-y-6 relative before:absolute before:left-4 before:top-5 before:h-[calc(100%-24px)] before:w-[2px] before:bg-qwiik-blue/20">
                  <li className="pl-12 relative">
                    <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-qwiik-blue text-white flex items-center justify-center">
                      1
                    </div>
                    <h4 className="font-bold mb-1">Commandez en ligne</h4>
                    <p className="text-sm text-gray-600">Ajoutez les produits qui vous intéressent à votre panier et validez votre commande.</p>
                  </li>
                  
                  <li className="pl-12 relative">
                    <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-qwiik-blue text-white flex items-center justify-center">
                      2
                    </div>
                    <h4 className="font-bold mb-1">Confirmation instantanée</h4>
                    <p className="text-sm text-gray-600">Vous recevez une confirmation immédiate et pouvez suivre votre commande en temps réel.</p>
                  </li>
                  
                  <li className="pl-12 relative">
                    <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-qwiik-blue text-white flex items-center justify-center">
                      3
                    </div>
                    <h4 className="font-bold mb-1">Préparation express</h4>
                    <p className="text-sm text-gray-600">Nos partenaires préparent votre commande en un temps record.</p>
                  </li>
                  
                  <li className="pl-12 relative">
                    <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-qwiik-blue text-white flex items-center justify-center">
                      4
                    </div>
                    <h4 className="font-bold mb-1">Livraison en 30 minutes</h4>
                    <p className="text-sm text-gray-600">Un coursier vous livre directement à l'adresse de votre choix.</p>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 bg-white/90 backdrop-blur-sm">
        <div className="page-container">
          <h2 className="text-3xl font-bold mb-8 text-center">Questions fréquentes</h2>
          
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold mb-2">Comment fonctionne la livraison en 30 minutes ?</h3>
              <p className="text-gray-600">Nous avons des partenariats avec de nombreux magasins et un réseau de coursiers prêts à livrer vos produits. Dès que vous passez commande, le magasin le plus proche prépare vos articles et un coursier les récupère pour vous les livrer.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold mb-2">Quels types de produits puis-je commander ?</h3>
              <p className="text-gray-600">Nous proposons une large gamme de produits : tech, beauté, maison, mode, livres et plus encore. Tous les produits affichés sur notre plateforme sont disponibles pour une livraison en 30 minutes.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold mb-2">Comment puis-je suivre ma commande ?</h3>
              <p className="text-gray-600">Une fois votre commande confirmée, vous recevez un lien de suivi par email et SMS. Vous pouvez également suivre votre commande en temps réel dans la section "Mes commandes" de votre compte.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold mb-2">Quels sont les frais de livraison ?</h3>
              <p className="text-gray-600">Les frais de livraison sont de 4,99€. La livraison est offerte pour toute commande supérieure à 35€.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-12 gradient-section-3">
        <div className="page-container">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Prêt à essayer Qwiik ?</h2>
            <p className="text-gray-700 mb-8">
              Rejoignez des milliers de clients satisfaits qui ont adopté la livraison ultra-rapide.
            </p>
            <Link to="/" className="btn-primary text-lg px-8 py-3">
              Explorer les produits
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorksPage;
