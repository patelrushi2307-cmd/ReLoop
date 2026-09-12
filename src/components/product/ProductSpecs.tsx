'use client';
import { useState } from 'react';
import { CheckCircle, Bot, Leaf, Minus, Plus, Heart } from 'lucide-react';
import { Product } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { calculateFitScore } from '@/lib/ai-scoring';
import { formatCO2 } from '@/lib/carbon-calculator';
import { MOCK_USER } from '@/lib/mock-data';

export default function ProductSpecs({ product }: { product: Product }) {
  const { isAuthenticated } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(product.moq || 1);

  const isWishlisted = isInWishlist(product.id);
  const fitScore = isAuthenticated ? calculateFitScore(product, MOCK_USER) : null;
  const estimatedFreight = product.weight ? (product.weight.value * quantity * 0.15).toFixed(2) : '0.00';

  const handleQtyChange = (delta: number) => {
    const newQty = quantity + delta;
    if (newQty >= (product.moq || 1) && newQty <= product.quantity) {
      setQuantity(newQty);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
        
        {/* Header */}
        <div>
          <div className="flex items-center text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
            <span>{product.seller?.name || 'Verified Seller'}</span>
            {product.seller?.verified && (
              <CheckCircle className="w-4 h-4 ml-1 text-blue-500" />
            )}
          </div>
          <h2 className="text-2xl font-bold font-display text-slate-900">{product.title}</h2>
          <p className="mt-2 text-sm text-slate-600 line-clamp-3">{product.description}</p>
        </div>

        {/* AI Suitability Banner */}
        {isAuthenticated && fitScore && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex gap-4">
            <div className="mt-1 bg-emerald-100 p-2 rounded-full shrink-0">
              <Bot className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h4 className="font-bold text-emerald-900">AI Fit Score: {fitScore.score}% Match</h4>
              <p className="text-sm text-emerald-700 mt-1">{fitScore.reason}</p>
            </div>
          </div>
        )}

        {/* CO2 Callout */}
        {product.co2Savings && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex gap-4">
            <div className="mt-1 bg-emerald-100 p-2 rounded-full shrink-0">
              <Leaf className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h4 className="font-bold text-emerald-900">
                ♻️ Buying this saves ~{formatCO2(product.co2Savings * quantity)} vs. virgin {product.material || 'material'}
              </h4>
              {product.co2Details && (
                <p className="text-sm text-emerald-700 mt-1">{product.co2Details}</p>
              )}
            </div>
          </div>
        )}

        {/* Specs Table */}
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-4">Specifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.specs && Object.entries(product.specs).map(([key, value]) => (
              <div key={key} className="flex flex-col border-b border-slate-100 pb-2">
                <span className="text-xs text-slate-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                <span className="text-sm font-medium text-slate-900">{String(value)}</span>
              </div>
            ))}
            {product.grade && (
              <div className="flex flex-col border-b border-slate-100 pb-2">
                <span className="text-xs text-slate-500">Quality Grade</span>
                <span className="text-sm font-medium text-slate-900">{product.grade}</span>
              </div>
            )}
            {product.weight && (
              <div className="flex flex-col border-b border-slate-100 pb-2">
                <span className="text-xs text-slate-500">Unit Weight</span>
                <span className="text-sm font-medium text-slate-900">{product.weight.value} {product.weight.unit}</span>
              </div>
            )}
            {product.dimensions && (
              <div className="flex flex-col border-b border-slate-100 pb-2">
                <span className="text-xs text-slate-500">Dimensions</span>
                <span className="text-sm font-medium text-slate-900">
                  {product.dimensions.length} x {product.dimensions.width} x {product.dimensions.height} {product.dimensions.unit}
                </span>
              </div>
            )}
            {product.moq && (
              <div className="flex flex-col border-b border-slate-100 pb-2">
                <span className="text-xs text-slate-500">Minimum Order (MOQ)</span>
                <span className="text-sm font-medium text-slate-900">{product.moq} units</span>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Bottom Action Bar */}
      <div className="sticky bottom-0 bg-white border-t border-slate-200 p-4 md:p-6 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="flex items-center justify-between md:justify-start gap-6">
            <div>
              <div className="text-2xl font-bold text-slate-900">₹{product.pricePerUnit.toLocaleString()}/unit</div>
              {product.wholesalePrice && (
                <div className="text-xs text-slate-500">Wholesale: ₹{product.wholesalePrice}/unit</div>
              )}
            </div>
            
            <div className="flex items-center border border-slate-200 rounded-lg h-10">
              <button 
                onClick={() => handleQtyChange(-1)}
                disabled={quantity <= (product.moq || 1)}
                className="px-3 text-slate-500 hover:text-slate-700 disabled:opacity-50"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input 
                type="number" 
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val) && val >= (product.moq || 1)) setQuantity(val);
                }}
                className="w-16 text-center text-sm font-medium border-x border-slate-200 h-full focus:outline-none"
              />
              <button 
                onClick={() => handleQtyChange(1)}
                disabled={quantity >= product.quantity}
                className="px-3 text-slate-500 hover:text-slate-700 disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => toggleWishlist(product.id)}
              className={`p-3 rounded-xl border transition-colors ${
                isWishlisted ? 'border-red-200 bg-red-50 text-red-500' : 'border-slate-200 hover:border-slate-300 text-slate-400 hover:text-slate-600'
              }`}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
            <button className="px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
              Custom Order
            </button>
            <button className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20">
              {isAuthenticated ? 'Order Now' : 'Sign in to Order'}
            </button>
          </div>
        </div>
        
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
          <span>Est. Freight: ~₹{estimatedFreight}</span>
          <span>Delivery: 3-5 business days</span>
        </div>
      </div>
    </div>
  );
}
