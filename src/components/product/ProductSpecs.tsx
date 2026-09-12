'use client';
import { useState } from 'react';
import { CheckCircle, Bot, Leaf, Minus, Plus, Heart, X, MapPin, Truck } from 'lucide-react';
import { Product } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { calculateFitScore } from '@/lib/ai-scoring';
import { calculateDistanceKm, calculateOrderImpact, formatCO2, formatCO2Tons, getSustainableQuantity } from '@/lib/carbon-calculator';

export default function ProductSpecs({ product }: { product: Product }) {
  const { user, isAuthenticated, requireAuth } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(product.moq || 1);
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [orderNumber, setOrderNumber] = useState('');

  const isWishlisted = isInWishlist(product.id);
  const distanceKm = user ? calculateDistanceKm(user.location, product.location) : (product.distanceKm ?? 0);
  const fitScore = user ? calculateFitScore(product, user) : null;
  const estimatedFreight = product.weight ? (product.weight.value * quantity * 0.15).toFixed(2) : '0.00';
  const orderImpact = calculateOrderImpact(product, quantity, distanceKm);
  const sustainableQuantity = getSustainableQuantity(product, distanceKm);
  const isClimatePositive = orderImpact.netEmissions > 0;

  const openOrder = () => {
    requireAuth('sign in to place an order.', () => {
      setOrderError('');
      setIsOrderOpen(true);
    });
  };

  const submitOrder = async () => {
    setIsOrdering(true);
    setOrderError('');
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, quantity }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Unable to place order');
      setOrderNumber(result.data.trackingNumber);
    } catch (error) {
      setOrderError(error instanceof Error ? error.message : 'Unable to place order');
    } finally {
      setIsOrdering(false);
    }
  };

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
          <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-slate-400" />
              {product.location.city}, {product.location.state}
            </span>
            <span className="inline-flex items-center gap-1">
              <Truck className="h-3.5 w-3.5 text-slate-400" />
              {distanceKm} km from your facility
            </span>
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
            <button onClick={openOrder} className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20">
              {isAuthenticated ? 'Order Now' : 'Sign in to Order'}
            </button>
          </div>
        </div>
        
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
          <span>Est. Freight: ~₹{estimatedFreight}</span>
          <span>Delivery: 3-5 business days</span>
        </div>
      </div>

      {isOrderOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">Order confirmation</p>
                <h3 className="mt-1 text-xl font-bold text-slate-900">{orderNumber ? 'Order placed' : 'Review your order'}</h3>
              </div>
              <button onClick={() => setIsOrderOpen(false)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Close order confirmation">
                <X className="h-5 w-5" />
              </button>
            </div>
            {orderNumber ? (
              <div className="mt-6 rounded-xl bg-emerald-50 p-5 text-center">
                <CheckCircle className="mx-auto h-10 w-10 text-emerald-600" />
                <p className="mt-3 font-semibold text-emerald-900">Your order is confirmed.</p>
                <p className="mt-1 text-sm text-emerald-700">Tracking number: {orderNumber}</p>
                <div className="mt-4 grid grid-cols-3 gap-2 border-t border-emerald-200 pt-4 text-xs">
                  <div><p className="text-emerald-700">Avoided</p><p className="mt-1 font-bold text-emerald-900">{formatCO2(orderImpact.avoidedEmissions)}</p></div>
                  <div><p className="text-emerald-700">Transport</p><p className="mt-1 font-bold text-emerald-900">{formatCO2(orderImpact.transportEmissions)}</p></div>
                  <div><p className="text-emerald-700">Net saved</p><p className="mt-1 font-bold text-emerald-900">{formatCO2(orderImpact.netEmissions)}</p></div>
                </div>
                <button onClick={() => setIsOrderOpen(false)} className="mt-5 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">Done</button>
              </div>
            ) : (
              <>
                <div className="mt-6 space-y-3 rounded-xl bg-slate-50 p-4 text-sm">
                  <div className="flex justify-between gap-4"><span className="text-slate-500">Material</span><span className="text-right font-medium text-slate-900">{product.title}</span></div>
                  <div className="flex justify-between gap-4"><span className="text-slate-500">Seller location</span><span className="text-right font-medium text-slate-900">{product.location.city}, {product.location.state}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Transport distance</span><span className="font-medium text-slate-900">{distanceKm} km</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Quantity</span><span className="font-medium text-slate-900">{quantity} units</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Estimated total</span><span className="font-bold text-slate-900">₹{(product.pricePerUnit * quantity).toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">CO₂ avoided</span><span className="font-medium text-emerald-700">{formatCO2(orderImpact.avoidedEmissions)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Transport emissions</span><span className="font-medium text-slate-700">{formatCO2Tons(orderImpact.transportEmissions)}</span></div>
                  <div className="flex justify-between border-t border-slate-200 pt-3"><span className="font-semibold text-slate-700">Net impact</span><span className={`font-bold ${isClimatePositive ? 'text-emerald-700' : 'text-amber-700'}`}>{isClimatePositive ? 'Save' : 'Loss of'} {formatCO2(Math.abs(orderImpact.netEmissions))}</span></div>
                </div>
                {!isClimatePositive && sustainableQuantity && sustainableQuantity <= product.quantity && (
                  <div className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
                    <p>This {distanceKm} km shipment would create more transport emissions than it avoids. Increase the quantity to spread the route footprint across more pieces.</p>
                    <button onClick={() => setQuantity(sustainableQuantity)} className="mt-3 rounded-lg bg-amber-700 px-3 py-2 text-xs font-semibold text-white hover:bg-amber-800">
                      Increase to {sustainableQuantity} units
                    </button>
                  </div>
                )}
                {!isClimatePositive && (!sustainableQuantity || sustainableQuantity > product.quantity) && (
                  <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm font-semibold text-amber-900">This listing does not have enough stock to offset transport emissions.</p>
                )}
                {orderError && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{orderError}</p>}
                <button onClick={submitOrder} disabled={isOrdering || !isClimatePositive} className="mt-6 w-full rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">
                  {isOrdering ? 'Placing order...' : isClimatePositive ? 'Confirm order' : 'Increase quantity to continue'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
