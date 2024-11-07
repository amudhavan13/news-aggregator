// frontend/src/App.js

import React, { Component } from "react";
import "./App.css";
import Navbar from "./components/Navbar"; // Update to default export
import News from "./components/News"; // Update to default export
import NewsChecker from "./components/NewsChecker";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Interests from "./components/Interests"; // Import Interests component
import { Routes, Route, Navigate } from "react-router-dom";

export default class App extends Component {
  api_key = "585f3a3a24764a82a970c0f33e9b28ba"; // API key for news fetching

  state = {
    isLoggedIn: false, // Track login status
  };

  handleLogin = () => {
    this.setState({ isLoggedIn: true });
  };

  handleLogout = () => {
    this.setState({ isLoggedIn: false });
  };

  render() {
    return (
      <div>
        {/* Pass isLoggedIn state and handleLogout to Navbar */}
        <Navbar isLoggedIn={this.state.isLoggedIn} onLogout={this.handleLogout} />
        <Routes>
          <Route
            path="/"
            element={<News key="general" api_key={this.api_key} category="general" />}
          />
          <Route
            path="/business"
            element={<News key="business" api_key={this.api_key} category="business" />}
          />
          <Route
            path="/entertainment"
            element={<News key="entertainment" api_key={this.api_key} category="entertainment" />}
          />
          <Route
            path="/health"
            element={<News key="health" api_key={this.api_key} category="health" />}
          />
          <Route
            path="/science"
            element={<News key="science" api_key={this.api_key} category="science" />}
          />
          <Route
            path="/sports"
            element={<News key="sports" api_key={this.api_key} category="sports" />}
          />
          <Route
            path="/technology"
            element={<News key="technology" api_key={this.api_key} category="technology" />}
          />
          <Route path="/check-fake-news" element={<NewsChecker />} />

          {/* Routes for Login and Signup */}
          <Route
            path="/login"
            element={<Login onLogin={this.handleLogin} />} // Pass handleLogin function
          />
          <Route path="/signup" element={<Signup />} />

          {/* Route for Interests page, only accessible if logged in */}
          <Route
            path="/interests"
            element={
              this.state.isLoggedIn ? <Interests /> : <Navigate to="/login" />
            }
          />
        </Routes>
      </div>
    );
  }
}
