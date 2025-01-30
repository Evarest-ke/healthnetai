package handlers

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/Evarest-ke/healthnetai/backend/database"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"golang.org/x/crypto/bcrypt"
)

type SignupRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
	FullName string `json:"full_name" binding:"required"`
	Role     string `json:"role" binding:"required,oneof=admin doctor staff"`
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type UserResponse struct {
	ID        int    `json:"id"`
	FullName  string `json:"full_name"`
	Email     string `json:"email"`
	Role      string `json:"role"`
	LastLogin string `json:"last_login"`
}

func Signup(c *gin.Context) {
	var req SignupRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	fmt.Printf("Signup request: %+v\n", req)

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	result, err := database.DB.Exec(
		"INSERT INTO users (email, password_hash, full_name, role) VALUES ($1, $2, $3, $4)",
		req.Email, string(hashedPassword), req.FullName, req.Role,
	)
	if err != nil {
		log.Println("==============Failed to create user=====================", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	id, _ := result.LastInsertId()

	// Generate JWT token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": id,
		"role":    req.Role,
		"exp":     time.Now().Add(time.Hour * 24).Unix(),
	})

	tokenString, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		log.Println("==============Failed to generate token=====================", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "User created successfully",
		"user_id": id,
		"token":   tokenString,
		"role":    req.Role,
	})
}

func Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		log.Println("==============Failed to bind json=====================", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get full user data
	var userData struct {
		ID       int64
		FullName string
		Email    string
		Role     string
	}

	var passwordHash string
	err := database.DB.QueryRow(
		"SELECT id, full_name, email, role, password_hash FROM users WHERE email = $1",
		req.Email,
	).Scan(&userData.ID, &userData.FullName, &userData.Email, &userData.Role, &passwordHash)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(passwordHash), []byte(req.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// Generate JWT token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": userData.ID,
		"role":    userData.Role,
		"exp":     time.Now().Add(time.Hour * 24).Unix(),
	})

	tokenString, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	// Update last login
	database.DB.Exec("UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?", userData.ID)

	c.JSON(http.StatusOK, gin.H{
		"token":     tokenString,
		"role":      userData.Role,
		"full_name": userData.FullName,
		"email":     userData.Email,
	})
}

func GetCurrentUser(c *gin.Context) {
	// Get user ID from JWT token context
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var user UserResponse
	err := database.DB.QueryRow(`
		SELECT id, full_name, email, role, last_login 
		FROM users 
		WHERE id = $1`,
		userID,
	).Scan(&user.ID, &user.FullName, &user.Email, &user.Role, &user.LastLogin)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch user data"})
		return
	}

	c.JSON(http.StatusOK, user)
}
