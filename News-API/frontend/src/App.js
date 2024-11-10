import React, { Component } from "react";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar"; // Assuming Navbar uses default export
import News from "./components/News"; // Assuming News uses default export
import NewsChecker from "./components/NewsChecker";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Interests from "./components/Interests";

export default class App extends Component {
  api_key = "585f3a3a24764a82a970c0f33e9b28ba"; // API key for news fetching

  constructor(props) {
    super(props);
    // Initialize the state based on localStorage values
    this.state = {
      isLoggedIn: localStorage.getItem("isLoggedIn") === "true" || false,
      email: localStorage.getItem("email") || null,
    };
  }

  handleLogin = (userEmail) => {
    // Update login status, store email in state and localStorage
    this.setState({ isLoggedIn: true, email: userEmail });
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("email", userEmail);
  };

  handleLogout = () => {
    // Clear login status and email from state and localStorage on logout
    this.setState({ isLoggedIn: false, email: null });
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("email");
  };

  render() {
    return (
      <div>
        {/* Pass isLoggedIn state, email, and handleLogout to Navbar */}
        <Navbar
          isLoggedIn={this.state.isLoggedIn}
          email={this.state.email}
          onLogout={this.handleLogout}
        />
        <Routes>
          {/* Routes for different news categories */}
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

          {/* Login and Signup routes */}
          <Route
            path="/login"
            element={<Login onLogin={this.handleLogin} />}
          />
          <Route path="/signup" element={<Signup />} />

          {/* Interests page, accessible only if logged in */}
          <Route
            path="/interests"
            element={
              this.state.isLoggedIn
                ? <Interests email={this.state.email} /> // Pass email to Interests
                : <Navigate to="/login" />
            }
          />
        </Routes>
      </div>
    );
  }
}
