"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/Navbar";
import { CATEGORIES } from "@/lib/mock-data";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud,
  CheckCircle,
  Package,
  Camera,
  Activity,
  Zap,
  Leaf,
  ChevronRight,
  ChevronLeft,
  X,
  FileImage,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

export default function SellPage() {
  const { user, login } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  // Step 1 State
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [category, setCategory] = useState("");
  const [materialType, setMaterialType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("pieces");
  const [city, setCity] = useState("");
  const [state, setStateLoc] = useState("");

  // Step 2 State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStatus, setAnalysisStatus] = useState("");

  // Step 3 State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [grade, setGrade] = useState("A");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [dimUnit, setDimUnit] = useState("mm");
  const [weight, setWeight] = useState("");
  const [moq, setMoq] = useState("");
  const [truckload, setTruckload] = useState("");
  const [container, setContainer] = useState("");
  const [humidity, setHumidity] = useState("");
  const [wholesalePrice, setWholesalePrice] = useState("");
  const [retailPrice, setRetailPrice] = useState("");
  const [stock, setStock] = useState("");

  // Populate location if user exists
  useEffect(() => {
    if (user && user.companyName) {
      // Mock pre-fill based on user profile if any, though we don't have detailed address in mock user
      setCity("Mumbai");
      setStateLoc("Maharashtra");
    }
  }, [user]);

  // Handle file drop/selection
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );
    handleNewFiles(droppedFiles);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).filter((file) =>
        file.type.startsWith("image/")
      );
      handleNewFiles(selectedFiles);
    }
  };

  const handleNewFiles = (newFiles: File[]) => {
    const updatedFiles = [...files, ...newFiles].slice(0, 5);
    setFiles(updatedFiles);
    
    // Generate previews
    const newPreviews = updatedFiles.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const removeFile = (index: number) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);

    const updatedPreviews = [...previews];
    URL.revokeObjectURL(updatedPreviews[index]);
    updatedPreviews.splice(index, 1);
    setPreviews(updatedPreviews);
  };

  const startAnalysis = () => {
    setCurrentStep(2);
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setAnalysisStatus("AI is analyzing your materials...");

    const duration = 3000;
    const intervalTime = 50;
    const steps = duration / intervalTime;
    let currentStepProgress = 0;

    const timer = setInterval(() => {
      currentStepProgress++;
      const newProgress = (currentStepProgress / steps) * 100;
      setAnalysisProgress(newProgress);

      if (newProgress > 30 && newProgress <= 60) {
        setAnalysisStatus("Detecting condition...");
      } else if (newProgress > 60) {
        setAnalysisStatus("Generating pricing...");
      }

      if (currentStepProgress >= steps) {
        clearInterval(timer);
        setIsAnalyzing(false);
        // Pre-fill Step 3 with mock AI data
        setTitle("Grade-A Heat-Treated Industrial Wooden Skids");
        setDescription(
          "High-quality, heat-treated wooden skids previously used for single-trip electronics transport. Excellent structural integrity with minimal cosmetic wear. Ideal for heavy-load warehousing or export shipping."
        );
        setGrade("A");
        setLength("1200");
        setWidth("1000");
        setHeight("150");
        setDimUnit("mm");
        setWeight("22");
        setMoq("50");
        setTruckload("450");
        setContainer("900");
        setHumidity("12");
        setWholesalePrice("2400");
        setRetailPrice("2800");
        setStock(quantity || "500");
      }
    }, intervalTime);
  };

  const publishListing = () => {
    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      setIsPublished(true);
    }, 1500);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              Sign In to Sell
            </h2>
            <p className="text-slate-600 mb-8">
              Join ReLoop 3D to turn your surplus packaging into revenue and
              reduce environmental impact.
            </p>
            <button
              onClick={() => login("seller@reloop.local", "demo-password")}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors"
            >
              Sign In / Register
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header & Step Indicator */}
          {!isPublished && (
            <div className="mb-10">
              <h1 className="text-3xl font-bold text-slate-900 mb-8 text-center">
                AI Seller Studio
              </h1>
              
              <div className="relative flex justify-between items-center max-w-2xl mx-auto">
                {/* Connecting lines */}
                <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 bg-slate-200 z-0 rounded-full">
                  <div 
                    className="absolute left-0 top-0 bottom-0 bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%' }}
                  ></div>
                </div>

                {[
                  { num: 1, label: "Upload & Categorize" },
                  { num: 2, label: "AI Analysis" },
                  { num: 3, label: "Review & Publish" },
                ].map((step) => (
                  <div key={step.num} className="relative z-10 flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors duration-300 ${
                        currentStep === step.num
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : currentStep > step.num
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : "bg-white border-slate-300 text-slate-400"
                      }`}
                    >
                      {currentStep > step.num ? <CheckCircle className="w-5 h-5" /> : step.num}
                    </div>
                    <span className={`absolute top-12 text-xs font-medium whitespace-nowrap ${
                      currentStep >= step.num ? "text-slate-800" : "text-slate-500"
                    }`}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden mt-8">
            {isPublished ? (
              <div className="p-12 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle className="w-12 h-12" />
                </motion.div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">
                  Your listing is live! 🎉
                </h2>
                <p className="text-lg text-slate-600 mb-8">
                  <span className="font-semibold">{title}</span> has been published to the marketplace.
                </p>
                <div className="flex justify-center gap-4">
                  <Link
                    href="/dashboard"
                    className="px-6 py-3 border-2 border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl font-medium transition-colors"
                  >
                    View Listing
                  </Link>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-emerald-500/20"
                  >
                    List Another Item
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative min-h-[500px]">
                <AnimatePresence mode="wait">
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="p-8"
                    >
                      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Camera className="w-6 h-6 text-emerald-500" />
                        Upload Photos of Your Material
                      </h2>

                      {/* Drag & Drop Zone */}
                      <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        className="border-3 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-10 flex flex-col items-center justify-center bg-slate-50 transition-colors cursor-pointer mb-8 relative"
                      >
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <UploadCloud className="w-12 h-12 text-slate-400 mb-4" />
                        <p className="text-lg font-medium text-slate-700 mb-2">
                          Drag & drop photos here or click to browse
                        </p>
                        <p className="text-sm text-slate-500">
                          Upload up to 5 photos. JPG, PNG, WebP accepted.
                        </p>
                      </div>

                      {/* Image Previews */}
                      {previews.length > 0 && (
                        <div className="flex gap-4 mb-8 overflow-x-auto pb-4">
                          {previews.map((src, index) => (
                            <div key={index} className="relative flex-shrink-0">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={src}
                                alt={`Preview ${index}`}
                                className="w-24 h-24 object-cover rounded-xl border border-slate-200"
                              />
                              <button
                                onClick={() => removeFile(index)}
                                className="absolute -top-2 -right-2 bg-white text-rose-500 rounded-full p-1 shadow-md hover:bg-rose-50"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                          <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          >
                            <option value="">Select a category</option>
                            {CATEGORIES.map((c) => (
                              <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Material Type</label>
                          <input
                            type="text"
                            placeholder="e.g. Pine Wood, HDPE Plastic..."
                            value={materialType}
                            onChange={(e) => setMaterialType(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Approximate Quantity</label>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              placeholder="0"
                              value={quantity}
                              onChange={(e) => setQuantity(e.target.value)}
                              className="flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            />
                            <select
                              value={unit}
                              onChange={(e) => setUnit(e.target.value)}
                              className="w-32 px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50"
                            >
                              <option value="pieces">Pieces</option>
                              <option value="kg">Kg</option>
                              <option value="tons">Tons</option>
                              <option value="bundles">Bundles</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="City"
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                              className="flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            />
                            <input
                              type="text"
                              placeholder="State"
                              value={state}
                              onChange={(e) => setStateLoc(e.target.value)}
                              className="w-32 px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={startAnalysis}
                          disabled={files.length === 0 || !category}
                          className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
                        >
                          <Zap className="w-5 h-5 fill-current" />
                          Analyze with AI
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="p-8 h-full flex flex-col justify-center min-h-[500px]"
                    >
                      {isAnalyzing ? (
                        <div className="flex flex-col items-center justify-center flex-1">
                          <div className="relative w-32 h-32 mb-8">
                            <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
                            <div 
                              className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"
                              style={{ animationDuration: '1.5s' }}
                            ></div>
                            <div className="absolute inset-0 flex items-center justify-center text-emerald-500">
                              <Zap className="w-10 h-10 animate-pulse" />
                            </div>
                          </div>
                          <h3 className="text-xl font-bold text-slate-800 mb-4">{analysisStatus}</h3>
                          <div className="w-64 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-emerald-500 transition-all duration-100 ease-linear"
                              style={{ width: `${analysisProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      ) : (
                        <div className="animate-fade-in-up">
                          <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center p-3 bg-emerald-100 text-emerald-600 rounded-full mb-4">
                              <CheckCircle className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800">Analysis Complete</h2>
                            <p className="text-slate-600">AI has processed your materials and generated a listing draft.</p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {/* AI Results Card */}
                            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                              <div className="flex justify-between items-start mb-6">
                                <div>
                                  <p className="text-sm font-medium text-slate-500 mb-1">Condition Grade</p>
                                  <div className="flex items-end gap-2">
                                    <span className="text-3xl font-bold text-emerald-600">Grade A</span>
                                    <span className="text-sm text-slate-500 mb-1 flex items-center"><CheckCircle className="w-4 h-4 mr-1 text-emerald-500"/> 94% confidence</span>
                                  </div>
                                </div>
                              </div>

                              <div className="mb-6">
                                <p className="text-sm font-medium text-slate-500 mb-2">Detected Characteristics</p>
                                <ul className="space-y-2">
                                  <li className="flex items-start gap-2 text-sm text-slate-700">
                                    <div className="w-2 h-2 mt-1.5 rounded-full bg-emerald-500"></div>
                                    Minor surface scuff - Left panel
                                  </li>
                                  <li className="flex items-start gap-2 text-sm text-slate-700">
                                    <div className="w-2 h-2 mt-1.5 rounded-full bg-emerald-500"></div>
                                    Small indentation - Top edge
                                  </li>
                                  <li className="flex items-start gap-2 text-sm text-slate-700">
                                    <div className="w-2 h-2 mt-1.5 rounded-full bg-emerald-500"></div>
                                    Structurally sound, heat-treated mark visible
                                  </li>
                                </ul>
                              </div>

                              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-3">
                                <Leaf className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-sm font-semibold text-emerald-800">CO₂ Impact Estimation</p>
                                  <p className="text-xs text-emerald-600 mt-1">Reusing this material saves approximately 420 kg CO₂e vs. virgin production.</p>
                                </div>
                              </div>
                            </div>

                            {/* Draft Card */}
                            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
                              <p className="text-sm font-medium text-slate-500 mb-1">Suggested Title</p>
                              <h3 className="font-bold text-slate-800 mb-4">Grade-A Heat-Treated Industrial Wooden Skids</h3>
                              
                              <p className="text-sm font-medium text-slate-500 mb-1">Suggested Description excerpt</p>
                              <p className="text-sm text-slate-600 mb-6 italic border-l-2 border-slate-300 pl-3">
                                &quot;High-quality, heat-treated wooden skids previously used for single-trip electronics transport. Excellent structural integrity...&quot;
                              </p>

                              <p className="text-sm font-medium text-slate-500 mb-2">Pricing Recommendations</p>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                  <p className="text-xs text-slate-500 mb-1">Wholesale</p>
                                  <p className="font-bold text-slate-800">₹2,400 <span className="text-xs font-normal text-slate-500">/unit</span></p>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                  <p className="text-xs text-slate-500 mb-1">Retail</p>
                                  <p className="font-bold text-slate-800">₹2,800 <span className="text-xs font-normal text-slate-500">/unit</span></p>
                                </div>
                              </div>
                              <p className="text-xs text-center text-slate-500 mt-3 flex items-center justify-center gap-1">
                                <Activity className="w-3 h-3" /> Prices match current market demand.
                              </p>
                            </div>
                          </div>

                          <div className="flex justify-end gap-4">
                            <button
                              onClick={() => setCurrentStep(1)}
                              className="px-6 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-medium transition-colors"
                            >
                              Back
                            </button>
                            <button
                              onClick={() => setCurrentStep(3)}
                              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                            >
                              Continue to Review <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="p-8"
                    >
                      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <FileImage className="w-6 h-6 text-emerald-500" />
                        Review & Publish
                      </h2>

                      <div className="space-y-8">
                        {/* Basic Info */}
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                          <h3 className="text-lg font-bold text-slate-800 mb-4">Basic Details</h3>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">Listing Title</label>
                              <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                              <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                                <select disabled value={category} className="w-full px-4 py-2 rounded-xl border border-slate-300 bg-slate-100 text-slate-500 cursor-not-allowed">
                                  {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Condition Grade</label>
                                <select value={grade} onChange={(e) => setGrade(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500">
                                  <option value="A">Grade A (Like New)</option>
                                  <option value="B">Grade B (Good)</option>
                                  <option value="C">Grade C (Fair)</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Specifications */}
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                          <h3 className="text-lg font-bold text-slate-800 mb-4">Specifications & Logistics</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">Dimensions (L x W x H)</label>
                              <div className="flex gap-2">
                                <input type="number" value={length} onChange={(e)=>setLength(e.target.value)} placeholder="L" className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-emerald-500" />
                                <input type="number" value={width} onChange={(e)=>setWidth(e.target.value)} placeholder="W" className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-emerald-500" />
                                <input type="number" value={height} onChange={(e)=>setHeight(e.target.value)} placeholder="H" className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-emerald-500" />
                                <select value={dimUnit} onChange={(e)=>setDimUnit(e.target.value)} className="w-24 px-2 py-2 rounded-xl border border-slate-300 bg-white">
                                  <option value="mm">mm</option>
                                  <option value="cm">cm</option>
                                  <option value="in">in</option>
                                </select>
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">Weight per unit (kg)</label>
                              <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">Minimum Order Quantity (MOQ)</label>
                              <input type="number" value={moq} onChange={(e) => setMoq(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">Units per Truckload</label>
                              <input type="number" value={truckload} onChange={(e) => setTruckload(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">Units per 45ft Container</label>
                              <input type="number" value={container} onChange={(e) => setContainer(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">Humidity Content (%)</label>
                              <input type="number" value={humidity} onChange={(e) => setHumidity(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500" />
                            </div>
                          </div>
                        </div>

                        {/* Pricing & Inventory */}
                        <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                          <h3 className="text-lg font-bold text-emerald-900 mb-4">Pricing & Inventory</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-emerald-800 mb-1">Wholesale Price (₹)</label>
                              <input type="number" value={wholesalePrice} onChange={(e) => setWholesalePrice(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-500" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-emerald-800 mb-1">Retail Price (₹)</label>
                              <input type="number" value={retailPrice} onChange={(e) => setRetailPrice(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-500" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-emerald-800 mb-1">Available Stock</label>
                              <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-500" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200">
                        <button
                          onClick={() => setCurrentStep(2)}
                          className="px-6 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-medium transition-colors flex items-center gap-2"
                        >
                          <ChevronLeft className="w-4 h-4" /> Back
                        </button>
                        <div className="flex gap-4">
                          <button className="px-6 py-3 border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 rounded-xl font-medium transition-colors">
                            Preview Listing
                          </button>
                          <button
                            onClick={publishListing}
                            disabled={isPublishing}
                            className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-emerald-500/20 flex items-center gap-2 disabled:opacity-70"
                          >
                            {isPublishing ? (
                              <RefreshCw className="w-5 h-5 animate-spin" />
                            ) : (
                              "Publish Listing"
                            )}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
