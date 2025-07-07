import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="flex items-center space-x-3">
  
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            API Documentation Generator
          </span>
        </div>
        <div className="flex items-center space-x-6">
          <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
            Login
          </Link>
          <Link 
            to="/register" 
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
            Transform Your
            <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              API Documentation
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Upload your API definitions and instantly generate beautiful, 
            <span className="font-semibold text-gray-800"> human-readable documentation </span> 
            that your team will love.
          </p>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-700 font-medium">Swagger/OpenAPI</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700 font-medium">Postman Collections</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-gray-700 font-medium">YAML & JSON</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-gray-700 font-medium">Markdown</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/register"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105"
            >
              Start Creating Docs
            </Link>
            <Link 
              to="/login"
              className="bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg border-2 border-gray-200 hover:border-blue-300 hover:text-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Sign In
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-gray-500">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Instant Generation</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Multiple Formats</span>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white/50 backdrop-blur-sm py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything you need for perfect API docs
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From simple uploads to beautiful documentation in seconds
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Upload</h3>
              <p className="text-gray-600">
                Simply drag and drop your API definition files. We support Swagger, OpenAPI, Postman, YAML, JSON, and Markdown.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Instant Parsing</h3>
              <p className="text-gray-600">
                Our intelligent parser extracts endpoints, parameters, responses, and schemas automatically.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Beautiful Display</h3>
              <p className="text-gray-600">
                View your documentation in a clean, organized format with collapsible sections and interactive elements.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
