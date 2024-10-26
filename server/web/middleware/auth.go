package middleware

import (
	"fmt"
	"net/http"
	"os"

	jwt "github.com/form3tech-oss/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/jphacks/os_2404/usecase"
	mycontext "github.com/jphacks/os_2404/utils/context"
)

type IAuth interface {
	Authenticate() gin.HandlerFunc
}

type Auth struct {
	uc usecase.IAuthUsecase
}

func NewAuth(uc usecase.IAuthUsecase) IAuth {
	return &Auth{uc: uc}
}

func (m *Auth) Authenticate() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString := c.Request.Header.Get("jwt")
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return []byte(os.Getenv("rawPrivKey")), nil
		})
		if err != nil {
			c.JSON(
				http.StatusBadRequest,
				gin.H{"error": err.Error()},
			)
			c.Abort()
			return
		}
		str := ""
		if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
			str, ok = claims["session"].(string)
			if !ok {
				c.JSON(
					http.StatusBadRequest,
					gin.H{"error": fmt.Errorf("kata asa-sion")},
				)
				c.Abort()
				return
			}
		} else {
			c.JSON(
				http.StatusBadRequest,
				gin.H{"error": fmt.Errorf("token empty")},
			)
			c.Abort()
			return
		}
		ok, err := m.uc.CheckSessionExpiry(c, str)
		if err != nil {
			c.JSON(
				http.StatusBadRequest,
				gin.H{"error": err.Error()},
			)
			c.Abort()
			return
		}
		if !ok {
			err := m.uc.DeleteSession(c, str)
			if err != nil {
				c.JSON(
					http.StatusBadRequest,
					gin.H{"error": err.Error()},
				)
				c.Abort()
			}
			c.JSON(
				http.StatusBadRequest,
				gin.H{"error": "session expiry err"},
			)
			c.Abort()
			return
		}
		userId, err := m.uc.GetUserIdFromSession(c, str)
		if err != nil {
			c.JSON(
				http.StatusBadRequest,
				gin.H{"error": err.Error()},
			)
			c.Abort()
			return
		}
		storedtoken, err := m.uc.GetTokenByUserId(c, userId)
		if err != nil {
			c.JSON(
				http.StatusBadRequest,
				gin.H{"error": err.Error()},
			)
			c.Abort()
			return
		}
		// TODO 切れてたらrefresh
		newToken, err := m.uc.RefreshAccessToken(c, userId, storedtoken)
		if err != nil {
			c.JSON(
				http.StatusBadRequest,
				gin.H{"error": err.Error()},
			)
			c.Abort()
			return
		}

		ctx := c.Request.Context()
		ctx = mycontext.SetUserId(ctx, userId)
		ctx = mycontext.SetToken(ctx, newToken)
		_ = c.Request.WithContext(ctx)
		c.Next()
	}
}
